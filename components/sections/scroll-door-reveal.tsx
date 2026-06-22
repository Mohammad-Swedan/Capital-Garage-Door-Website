"use client";

import { useLayoutEffect, useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120; // total files on disk

/** Number of frames fetched/decoded in parallel. */
const CONCURRENCY = 6;

function getFrameSrc(i: number) {
  const fileNum = i + 1;
  return `/frames/ezgif-frame-${String(fileNum).padStart(3, "0")}.webp`;
}

function smoothPhaseOpacity(p: number, center: number, halfWidth: number) {
  const dist = Math.abs(p - center);
  if (dist >= halfWidth) return 0;
  const t = 1 - dist / halfWidth;
  return t * t * (3 - 2 * t);
}

/** Paints `img` into the canvas using "cover" sizing (fills, may crop). */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  iw: number,
  ih: number,
  cw: number,
  ch: number,
) {
  if (!iw || !ih) return;
  const ir = iw / ih;
  const cr = cw / ch;
  let dw: number, dh: number, ox: number, oy: number;
  if (ir > cr) {
    dh = ch;
    dw = dh * ir;
    ox = (cw - dw) / 2;
    oy = 0;
  } else {
    dw = cw;
    dh = dw / ir;
    ox = 0;
    oy = (ch - dh) / 2;
  }
  ctx.drawImage(img, ox, oy, dw, dh);
}

/**
 * Order in which frames are fetched: coarse-to-fine (every 8th, then 4th, 2nd,
 * 1st). This means a partial load still spans the *whole* sequence, so the
 * nearest-frame fallback always has something close to draw — you never get
 * stuck on the dark, door-closed opening frames while scrubbing ahead.
 */
function buildLoadOrder(isMobile: boolean) {
  const order: number[] = [];
  const seen = new Set<number>();
  const baseStep = isMobile ? 2 : 1;
  const strides = isMobile ? [8, 4, 2] : [8, 4, 2, 1];

  for (const stride of strides) {
    for (let i = 0; i < FRAME_COUNT; i += stride) {
      if (i % baseStep !== 0) continue;
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  // Ensure we catch all intended frames
  for (let i = 0; i < FRAME_COUNT; i += baseStep) {
    if (!seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  }
  return order;
}

const COPY = [
  { text: "Precision Built. Professionally Installed.", center: 0.18, half: 0.14 },
  { text: "Smooth, Quiet, Reliable Operation.", center: 0.5, half: 0.14 },
  { text: "Your Garage, Transformed.", center: 0.82, half: 0.14 },
];

export function ScrollDoorReveal() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Rendering state lives in refs so the draw path never re-creates closures.
  const framesRef = useRef<(ImageBitmap | null)[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const cwRef = useRef(0);
  const chRef = useRef(0);
  const lastProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [loadPct, setLoadPct] = useState(0);
  const [framesReady, setFramesReady] = useState(false);

  // Draw the frame nearest to `progress`. Falls back to the closest *decoded*
  // frame so the canvas is never blank and never freezes on a stale frame.
  const draw = useCallback((progress: number) => {
    const ctx = ctxRef.current;
    const cw = cwRef.current;
    const ch = chRef.current;
    if (!ctx || !cw || !ch) return;

    const frames = framesRef.current;
    const max = FRAME_COUNT - 1;
    const idx = Math.min(max, Math.max(0, Math.round(progress * max)));

    let img = frames[idx];
    if (!img) {
      for (let d = 1; d <= max; d++) {
        if (frames[idx - d]) {
          img = frames[idx - d];
          break;
        }
        if (frames[idx + d]) {
          img = frames[idx + d];
          break;
        }
      }
    }
    if (!img) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";
    // "cover" always fills the canvas, so no clear is needed (alpha:false).
    drawImageCover(ctx, img, img.width, img.height, cw, ch);
  }, []);

  // Coalesce paints to one per animation frame.
  const scheduleDraw = useCallback(
    (progress: number) => {
      lastProgressRef.current = progress;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        draw(lastProgressRef.current);
      });
    },
    [draw],
  );

  // Size the canvas backing store to its layout box × DPR. Uses clientWidth/
  // Height (the layout box) rather than getBoundingClientRect so the scroll
  // `scale()` transform on the wrapper doesn't inflate the resolution.
  const resizeCanvas = useCallback(() => {
    const wrap = canvasWrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(wrap.clientWidth * dpr));
    const h = Math.max(1, Math.floor(wrap.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    cwRef.current = w;
    chRef.current = h;
    draw(lastProgressRef.current);
  }, [draw]);

  // ── Preload frames + keep the canvas sized (runs once the section mounts,
  //    which LazyOnVisible already defers until it's near the viewport) ───────
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    ctxRef.current = ctx;

    framesRef.current = new Array(FRAME_COUNT).fill(null);
    resizeCanvas();

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => resizeCanvas())
        : null;
    if (ro && canvasWrapRef.current) ro.observe(canvasWrapRef.current);
    window.addEventListener("resize", resizeCanvas);

    let cancelled = false;
    const controller = new AbortController();
    const isMobile = window.innerWidth < 768;
    const order = buildLoadOrder(isMobile);
    const targetFramesToLoad = order.length;
    let cursor = 0;
    let loaded = 0;

    async function pump() {
      while (!cancelled && cursor < order.length) {
        const index = order[cursor++];
        try {
          const res = await fetch(getFrameSrc(index), { signal: controller.signal });
          if (!res.ok) throw new Error("network");
          const blob = await res.blob();
          const bitmap = await createImageBitmap(blob);
          if (cancelled) {
            bitmap.close();
            return;
          }
          framesRef.current[index] = bitmap;
          // Paint the first frame as soon as it exists (sits behind the loader).
          if (index === 0) draw(lastProgressRef.current);
        } catch {
          /* skip a failed frame — the nearest-frame fallback covers the gap */
        }
        loaded++;
        if (!cancelled) setLoadPct(Math.round((loaded / targetFramesToLoad) * 100));
      }
    }

    Promise.all(Array.from({ length: CONCURRENCY }, () => pump())).then(() => {
      if (!cancelled) setFramesReady(true);
    });

    return () => {
      cancelled = true;
      controller.abort();
      ro?.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      for (const f of framesRef.current) f?.close();
      framesRef.current = [];
    };
  }, [prefersReducedMotion, resizeCanvas, draw]);

  // ── ScrollTrigger scrub — only after every frame is decoded ────────────────
  useLayoutEffect(() => {
    if (!framesReady) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctxGsap = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=450%",
        pin: true,
        scrub: 0.5, // smoothed by Lenis; tight enough to feel responsive
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          scheduleDraw(p);

          // CSS side-effects
          const wrap = canvasWrapRef.current;
          if (wrap) wrap.style.transform = `scale(${1 + p * 0.085})`;

          const glow = glowRef.current;
          if (glow) glow.style.opacity = String(Math.pow(p, 1.35) * 0.75);

          for (let j = 0; j < COPY.length; j++) {
            const el = copyRefs.current[j];
            if (!el) continue;
            const o = smoothPhaseOpacity(p, COPY[j].center, COPY[j].half);
            el.style.opacity = String(o);
            el.style.transform = `translate3d(0,${(1 - o) * 16}px,0)`;
          }
        },
      });
    }, section);

    // Paint immediately so the canvas isn't blank the instant the loader is
    // removed (onUpdate only fires once the user actually scrolls).
    draw(lastProgressRef.current);

    // Force refresh on next tick to ensure correct layout calculations for pin spacer
    // after dynamic imports or client-side navigation.
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(raf);
      ctxGsap.revert();
    };
  }, [framesReady, scheduleDraw, draw]);

  // Static, no-JS-animation fallback: a single representative frame instead
  // of a pinned canvas scrub.
  if (prefersReducedMotion) {
    // Show the middle frame of the sequence
    const fallbackSrc = getFrameSrc(Math.floor(FRAME_COUNT / 2));
    return (
      <section className="relative isolate h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center py-8">
        {/* Top Header Section */}
        <div className="z-10 flex flex-col items-center justify-center text-center px-6 mb-8">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-muted-foreground tracking-tight">
             Your Garage <br className="md:hidden" />
             <AnimatedTextCycle
                 words={[
                     "Security",
                     "Style",
                     "Performance",
                     "Value",
                     "Transformation",
                 ]}
                 wordClasses={[
                     "text-primary",
                     "text-cta",
                     "text-emerald-500",
                     "text-primary",
                     "text-cta"
                 ]}
                 interval={3000}
                 className="font-semibold"
             />
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
             Experience the perfect blend of architectural beauty and uncompromising durability.
          </p>
        </div>

        {/* Center Frame */}
        <div className="relative z-0 w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-border/50 mx-auto my-8 shrink-0">
          <Image
            src={fallbackSrc}
            alt="Capital Garage Door — open sectional garage door revealing a vehicle inside"
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0b0d]/90 via-transparent to-[#0a0b0d]/95"
            aria-hidden
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="block h-px w-10 bg-gradient-to-r from-transparent via-cta to-transparent" aria-hidden />
            <p
              className="font-heading font-bold tracking-wide text-white leading-[1.15]"
              style={{ fontSize: "clamp(1.75rem,5vw,3.75rem)" }}
            >
              {COPY[1].text}
            </p>
            <span className="block h-px w-10 bg-gradient-to-r from-transparent via-cta/50 to-transparent" aria-hidden />
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="z-10 flex flex-col items-center justify-center text-center px-6 mt-8">
          <p className="text-sm uppercase tracking-widest text-muted-foreground/60 font-semibold mb-2">
             Explore more
          </p>
          <div className="w-px h-12 bg-gradient-to-b from-muted-foreground/40 to-transparent" />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center py-8"
    >
      {/* Top Header Section */}
      <div className="z-10 flex flex-col items-center justify-center text-center px-6 mb-8">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-muted-foreground tracking-tight">
           Your Garage <br className="md:hidden" />
           <AnimatedTextCycle
               words={[
                   "Security",
                   "Style",
                   "Performance",
                   "Value",
                   "Transformation",
               ]}
               wordClasses={[
                   "text-primary",
                   "text-cta",
                   "text-emerald-500",
                   "text-primary",
                   "text-cta"
               ]}
               interval={3000}
               className="font-semibold"
           />
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
           Experience the perfect blend of architectural beauty and uncompromising durability.
        </p>
      </div>

      {!framesReady && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background">
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/images/CGD-logo-no-background.png"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 object-contain drop-shadow-[0_10px_24px_rgba(200,34,42,0.35)]"
            />
            <span className="block h-px w-16 bg-gradient-to-r from-transparent via-cta/60 to-transparent" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.5em] text-foreground/60 uppercase">
            Loading Experience
          </p>
          <div className="relative h-px w-52 overflow-hidden bg-muted">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cta/60 via-cta to-cta/80 transition-all duration-300 ease-out"
              style={{ width: `${loadPct}%` }}
            />
          </div>
          <p className="text-xs tabular-nums tracking-widest text-foreground/40">{loadPct} / 100</p>
        </div>
      )}

      {/* Center Canvas Frame */}
      <div className="relative z-0 w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-border/50 mx-auto my-8 shrink-0">
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#0a0b0d]">
          <div
            ref={canvasWrapRef}
            className="relative h-full w-full origin-center will-change-transform"
            style={{ transform: "scale(1)" }}
          >
            <canvas ref={canvasRef} className="block h-full w-full" aria-label="Scroll-driven garage door reveal" />
          </div>
        </div>

        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 z-1 opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 70% at 50% 85%, rgba(200,34,42,0.4) 0%, transparent 55%)",
            mixBlendMode: "screen",
          }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 z-2 bg-gradient-to-b from-[#0a0b0d]/90 via-transparent to-[#0a0b0d]/95"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 z-3 flex flex-col items-center justify-center px-6">
          {COPY.map((item, i) => (
            <div
              key={item.text}
              ref={(el) => {
                copyRefs.current[i] = el;
              }}
              className="absolute flex max-w-3xl flex-col items-center gap-4 px-6 text-center"
              style={{ opacity: 0 }}
            >
              <span className="block h-px w-10 bg-gradient-to-r from-transparent via-cta to-transparent" aria-hidden />
              {i === COPY.length - 1 && (
                <Image
                  src="/images/CGD-logo-no-background.png"
                  alt="Capital Garage Door"
                  width={45}
                  height={21}
                  className="object-contain drop-shadow-[0_4px_12px_rgba(200,34,42,0.35)] -mb-2"
                />
              )}
              <p
                className="font-heading font-bold tracking-wide text-white leading-[1.15]"
                style={{ fontSize: "clamp(1.5rem,4vw,3.75rem)" }}
              >
                {item.text}
              </p>
              <span
                className="block h-px w-10 bg-gradient-to-r from-transparent via-cta/50 to-transparent"
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="z-10 flex flex-col items-center justify-center text-center px-6 mt-8">
        <p className="text-sm uppercase tracking-widest text-muted-foreground/60 font-semibold mb-2">
           Scroll to explore
        </p>
        <div className="w-px h-12 bg-gradient-to-b from-muted-foreground/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
