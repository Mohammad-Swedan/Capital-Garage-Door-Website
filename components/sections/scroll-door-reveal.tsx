"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

/** Door animation video (plays once when the section scrolls into view). */
const VIDEO_SRC = "/videos/door-animation.mp4";
/** A representative still (a frame from the same animation) shown as the poster + reduced-motion fallback. */
const POSTER_SRC = "/frames/ezgif-frame-110.webp";

/**
 * Decorative captions that fade in across the video's playback (centre = the
 * fraction of the clip at which each line peaks). Driven by the video's
 * currentTime/duration, so they reveal as the door opens.
 */
const COPY = [
  { text: "Precision Built. Professionally Installed.", center: 0.2, half: 0.2 },
  { text: "Smooth, Quiet, Reliable Operation.", center: 0.52, half: 0.2 },
  { text: "Your Garage, Transformed.", center: 0.84, half: 0.2 },
];

function smoothPhaseOpacity(p: number, center: number, halfWidth: number) {
  const dist = Math.abs(p - center);
  if (dist >= halfWidth) return 0;
  const t = 1 - dist / halfWidth;
  return t * t * (3 - 2 * t);
}

/**
 * Home-page "door reveal" — a short garage-door animation video that plays once
 * (muted) when the section scrolls into view, with the brand heading above and
 * three captions + a warm glow fading in across playback. Replaces the former
 * 120-frame scroll-scrub canvas: a finished video plays smoothly on every device
 * and is far lighter than fetching/decoding 120 frames. Honours reduced-motion
 * by showing a static poster instead of autoplaying.
 */
export function ScrollDoorReveal() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Play once when the section enters the viewport (replay if it re-enters after
  // finishing); pause when it leaves so it isn't decoding off-screen.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (video.ended) video.currentTime = 0;
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [prefersReducedMotion]);

  // Fade the captions + glow in across the clip, tied to playback progress.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      const p = video.duration ? video.currentTime / video.duration : 0;
      const glow = glowRef.current;
      if (glow) glow.style.opacity = String(Math.pow(p, 1.35) * 0.75);
      for (let j = 0; j < COPY.length; j++) {
        const el = copyRefs.current[j];
        if (!el) continue;
        const o = smoothPhaseOpacity(p, COPY[j].center, COPY[j].half);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0,${(1 - o) * 16}px,0)`;
      }
    };

    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background py-8"
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

      {/* Center Video Frame */}
      <div className="relative z-0 mx-auto my-8 aspect-[16/9] w-full max-w-5xl shrink-0 overflow-hidden rounded-2xl border border-border/50 shadow-2xl md:aspect-[21/9]">
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#0a0b0d]">
          {prefersReducedMotion ? (
            <Image
              src={POSTER_SRC}
              alt="Capital Garage Door — open sectional garage door revealing a vehicle inside"
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              muted
              playsInline
              preload="metadata"
              aria-label="Garage door opening animation"
            />
          )}
        </div>

        {/* Warm glow that ramps up as the door opens */}
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

        {/* Captions */}
        <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center px-6">
          {prefersReducedMotion ? (
            <div className="flex max-w-3xl flex-col items-center gap-4 px-6 text-center">
              <span className="block h-px w-10 bg-gradient-to-r from-transparent via-cta to-transparent" aria-hidden />
              <p
                className="font-heading font-bold leading-[1.15] tracking-wide text-white"
                style={{ fontSize: "clamp(1.5rem,4vw,3.75rem)" }}
              >
                {COPY[2].text}
              </p>
              <span className="block h-px w-10 bg-gradient-to-r from-transparent via-cta/50 to-transparent" aria-hidden />
            </div>
          ) : (
            COPY.map((item, i) => (
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
            ))
          )}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="z-10 mt-8 flex flex-col items-center justify-center px-6 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground/60">
          Explore more
        </p>
        <div className="h-12 w-px bg-gradient-to-b from-muted-foreground/40 to-transparent" />
      </div>
    </section>
  );
}
