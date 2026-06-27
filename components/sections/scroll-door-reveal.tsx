"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

gsap.registerPlugin(ScrollTrigger);

/** Door animation video, scrubbed by scroll position (door opens as you scroll). */
const VIDEO_SRC = "/videos/door-animation.mp4";
/** A representative still (frame from the same animation) for the poster + reduced-motion fallback. */
const POSTER_SRC = "/frames/ezgif-frame-110.webp";

const COPY = [
  { text: "Precision Built. Professionally Installed.", center: 0.18, half: 0.14 },
  { text: "Smooth, Quiet, Reliable Operation.", center: 0.5, half: 0.14 },
  { text: "Your Garage, Transformed.", center: 0.82, half: 0.14 },
];

function smoothPhaseOpacity(p: number, center: number, halfWidth: number) {
  const dist = Math.abs(p - center);
  if (dist >= halfWidth) return 0;
  const t = 1 - dist / halfWidth;
  return t * t * (3 - 2 * t);
}

/**
 * Home-page "door reveal" — the supplied garage-door VIDEO scrubbed by scroll:
 * the section pins and the door opens as you scroll, with the brand heading
 * above and three captions + a warm glow fading in across the timeline.
 *
 * Instead of painting a 120-frame canvas, this seeks `video.currentTime` from
 * the scroll progress. A rAF loop lerps toward the scroll target (so seeking is
 * smoothed, not thrashed on every scroll tick) and only seeks past a small
 * threshold while no prior seek is pending. The video is muted + never played —
 * we drive its timeline manually. Honours reduced-motion with a static poster.
 *
 * Note: smoothness of `currentTime` seeking depends on the clip's keyframe
 * density; sparse keyframes can make the scrub snappy on some browsers (iOS
 * Safari especially). Re-encoding with frequent keyframes makes it buttery.
 */
export function ScrollDoorReveal() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);

  const targetRef = useRef(0); // scroll progress (0..1) from ScrollTrigger
  const displayRef = useRef(0); // smoothed progress actually applied to the video
  const rafRef = useRef<number | null>(null);
  const durationRef = useRef(0);
  const seekingRef = useRef(false);

  const [loadPct, setLoadPct] = useState(0);
  const [ready, setReady] = useState(false);

  // ── Buffer the video; reveal the scrub once it can seek ────────────────────
  useEffect(() => {
    if (prefersReducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => {
      durationRef.current = video.duration || 0;
    };
    const onProgress = () => {
      try {
        if (video.buffered.length && video.duration) {
          const end = video.buffered.end(video.buffered.length - 1);
          setLoadPct(Math.min(100, Math.round((end / video.duration) * 100)));
        }
      } catch {
        /* buffered can throw if not ready yet */
      }
    };
    const reveal = () => {
      setLoadPct(100);
      setReady(true);
    };
    const onSeeking = () => {
      seekingRef.current = true;
    };
    const onSeeked = () => {
      seekingRef.current = false;
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("progress", onProgress);
    video.addEventListener("canplaythrough", reveal);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);
    // Safety net: reveal even if canplaythrough is slow to fire.
    const t = window.setTimeout(reveal, 6000);

    video.load();

    return () => {
      window.clearTimeout(t);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplaythrough", reveal);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [prefersReducedMotion]);

  // ── Smooth seek loop + caption/glow, driven by the scroll target ───────────
  useEffect(() => {
    if (prefersReducedMotion || !ready) return;
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      // Ease the applied progress toward the scroll target so the seek is fluid.
      displayRef.current += (targetRef.current - displayRef.current) * 0.12;
      const p = displayRef.current;

      const dur = durationRef.current;
      if (dur > 0) {
        const t = Math.max(0, Math.min(dur - 0.05, p * dur));
        // Only seek past a ~1-frame threshold, and never while a seek is pending,
        // to avoid queueing seeks faster than the decoder can satisfy them.
        if (!seekingRef.current && Math.abs(video.currentTime - t) > 1 / 30) {
          try {
            video.currentTime = t;
          } catch {
            /* ignore transient seek errors */
          }
        }
      }

      const glow = glowRef.current;
      if (glow) glow.style.opacity = String(Math.pow(p, 1.35) * 0.75);
      for (let j = 0; j < COPY.length; j++) {
        const el = copyRefs.current[j];
        if (!el) continue;
        const o = smoothPhaseOpacity(p, COPY[j].center, COPY[j].half);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0,${(1 - o) * 16}px,0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [ready, prefersReducedMotion]);

  // ── ScrollTrigger pin + scrub → targetRef (+ subtle scale) ─────────────────
  useLayoutEffect(() => {
    if (prefersReducedMotion || !ready) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctxGsap = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=450%",
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetRef.current = self.progress;
          const wrap = videoWrapRef.current;
          if (wrap) wrap.style.transform = `scale(${1 + self.progress * 0.085})`;
        },
      });
    }, section);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctxGsap.revert();
    };
  }, [ready, prefersReducedMotion]);

  // ── Static, no-animation fallback ──────────────────────────────────────────
  if (prefersReducedMotion) {
    return (
      <section className="relative isolate flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background py-8">
        <div className="z-10 mb-8 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-3xl font-light tracking-tight text-muted-foreground md:text-5xl lg:text-6xl">
            Your Garage <br className="md:hidden" />
            <AnimatedTextCycle
              words={["Security", "Style", "Performance", "Value", "Transformation"]}
              wordClasses={["text-primary", "text-cta", "text-emerald-500", "text-primary", "text-cta"]}
              interval={3000}
              className="font-semibold"
            />
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Experience the perfect blend of architectural beauty and uncompromising durability.
          </p>
        </div>

        <div className="relative z-0 mx-auto my-8 aspect-[16/9] w-full max-w-5xl shrink-0 overflow-hidden rounded-2xl border border-border/50 shadow-2xl md:aspect-[21/9]">
          <Image
            src={POSTER_SRC}
            alt="Capital Garage Door — open sectional garage door revealing a vehicle inside"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0b0d]/90 via-transparent to-[#0a0b0d]/95"
            aria-hidden
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="block h-px w-10 bg-gradient-to-r from-transparent via-cta to-transparent" aria-hidden />
            <p
              className="font-heading font-bold leading-[1.15] tracking-wide text-white"
              style={{ fontSize: "clamp(1.75rem,5vw,3.75rem)" }}
            >
              {COPY[1].text}
            </p>
            <span className="block h-px w-10 bg-gradient-to-r from-transparent via-cta/50 to-transparent" aria-hidden />
          </div>
        </div>

        <div className="z-10 mt-8 flex flex-col items-center justify-center px-6 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground/60">Explore more</p>
          <div className="h-12 w-px bg-gradient-to-b from-muted-foreground/40 to-transparent" />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background py-8"
    >
      {/* Top Header Section */}
      <div className="z-10 mb-8 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-light tracking-tight text-muted-foreground md:text-5xl lg:text-6xl">
          Your Garage <br className="md:hidden" />
          <AnimatedTextCycle
            words={["Security", "Style", "Performance", "Value", "Transformation"]}
            wordClasses={["text-primary", "text-cta", "text-emerald-500", "text-primary", "text-cta"]}
            interval={3000}
            className="font-semibold"
          />
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Experience the perfect blend of architectural beauty and uncompromising durability.
        </p>
      </div>

      {!ready && (
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
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/60">Loading Experience</p>
          <div className="relative h-px w-52 overflow-hidden bg-muted">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cta/60 via-cta to-cta/80 transition-all duration-300 ease-out"
              style={{ width: `${loadPct}%` }}
            />
          </div>
          <p className="text-xs tabular-nums tracking-widest text-foreground/40">{loadPct} / 100</p>
        </div>
      )}

      {/* Center Video Frame */}
      <div className="relative z-0 mx-auto my-8 aspect-[16/9] w-full max-w-5xl shrink-0 overflow-hidden rounded-2xl border border-border/50 shadow-2xl md:aspect-[21/9]">
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#0a0b0d]">
          <div
            ref={videoWrapRef}
            className="relative h-full w-full origin-center will-change-transform"
            style={{ transform: "scale(1)" }}
          >
            <video
              ref={videoRef}
              className="block h-full w-full object-cover"
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              muted
              playsInline
              preload="auto"
              aria-label="Scroll-driven garage door reveal"
            />
          </div>
        </div>

        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 z-[1] opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 70% at 50% 85%, rgba(200,34,42,0.4) 0%, transparent 55%)",
            mixBlendMode: "screen",
          }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-[#0a0b0d]/90 via-transparent to-[#0a0b0d]/95"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center px-6">
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
                  className="-mb-2 object-contain drop-shadow-[0_4px_12px_rgba(200,34,42,0.35)]"
                />
              )}
              <p
                className="font-heading font-bold leading-[1.15] tracking-wide text-white"
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
      <div className="z-10 mt-8 flex flex-col items-center justify-center px-6 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground/60">
          Scroll to explore
        </p>
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-muted-foreground/40 to-transparent" />
      </div>
    </section>
  );
}
