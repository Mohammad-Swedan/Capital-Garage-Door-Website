"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120; // total files on disk

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

const COPY = [
  { text: "Precision Built. Professionally Installed.", center: 0.18, half: 0.14 },
  { text: "Smooth, Quiet, Reliable Operation.", center: 0.5, half: 0.14 },
  { text: "Your Garage, Transformed.", center: 0.82, half: 0.14 },
];

/** Starts preloading frames once the section is within this distance of the viewport. */
const PRELOAD_ROOT_MARGIN = "600px 0px";

export function ScrollDoorReveal() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);

  const workerRef = useRef<Worker | null>(null);

  const [loadPct, setLoadPct] = useState(0);
  const [framesReady, setFramesReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // ── Defer loading until the section is about to enter the viewport ───────
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    let observer: IntersectionObserver | null = null;
    
    // Add a small delay to let page layout stabilize before observing
    const timer = setTimeout(() => {
      const section = sectionRef.current;
      if (!section || typeof IntersectionObserver === "undefined") {
        setShouldLoad(true);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setShouldLoad(true);
            if (observer) observer.disconnect();
          }
        },
        { rootMargin: PRELOAD_ROOT_MARGIN },
      );
      observer.observe(section);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [prefersReducedMotion]);

  // ── Initialize Worker ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldLoad || prefersReducedMotion) return;
    
    // Create the worker
    const worker = new Worker(new URL('./canvas-worker.ts', import.meta.url));
    workerRef.current = worker;
    
    worker.onmessage = (e) => {
      const { type, loaded, total } = e.data;
      if (type === 'progress') {
        const pct = Math.round((loaded / total) * 100);
        setLoadPct(prev => Math.max(prev, pct));
      } else if (type === 'ready') {
        setFramesReady(true);
      }
    };
    
    const canvas = canvasRef.current;
    if (canvas && 'transferControlToOffscreen' in canvas) {
      try {
        const offscreen = canvas.transferControlToOffscreen();
        
        worker.postMessage({
          type: 'init',
          payload: {
            canvas: offscreen
          }
        }, [offscreen]);
      } catch (err) {
        console.error('OffscreenCanvas failed:', err);
      }
    } else {
        // Fallback for browsers that don't support OffscreenCanvas
        // We will just mark it ready and show the canvas fallback image since the actual heavy draw might crash if we polyfill.
        // Safari handles OffscreenCanvas since version 16.4.
        setFramesReady(true);
    }
    
    return () => {
      worker.terminate();
    };
  }, [shouldLoad, prefersReducedMotion]);

  // ── ScrollTrigger setup ───────────────────────────────────────────────────
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
        scrub: 0.4, // tight lag for a responsive, non-laggy feel
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          
          // Post to worker to paint
          if (workerRef.current) {
             workerRef.current.postMessage({ type: 'scrub', payload: p });
          }
          
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

    const onResize = () => {
      const wrap = canvasWrapRef.current;
      if (wrap && workerRef.current) {
        const rect = wrap.getBoundingClientRect();
        // Send actual desired size
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        workerRef.current.postMessage({
          type: 'resize',
          payload: {
            width: Math.max(1, Math.floor(rect.width * dpr)),
            height: Math.max(1, Math.floor(rect.height * dpr))
          }
        });
      }
    };
    
    window.addEventListener("resize", onResize);
    // Initial resize to set correct dimensions
    onResize();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => onResize()) : null;
    if (ro && canvasWrapRef.current) ro.observe(canvasWrapRef.current);

    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      ctxGsap.revert();
    };
  }, [framesReady]);

  // Static, no-JS-animation fallback: a single representative frame instead
  // of a pinned canvas scrub.
  if (prefersReducedMotion) {
    // Show the middle frame of the sequence
    const fallbackSrc = getFrameSrc(Math.floor(FRAME_COUNT / 2));
    return (
      <section className="relative h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center py-8">
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
      className="relative h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center py-8"
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

      {shouldLoad && !framesReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background">
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
