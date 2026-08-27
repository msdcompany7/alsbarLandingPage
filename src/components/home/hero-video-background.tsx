"use client";

import { useEffect, useRef } from "react";

type HeroVideoBackgroundProps = {
  src?: string;
};

export function HeroVideoBackground({ src = "/hero-video.mp4" }: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncPlayback() {
      if (motionQuery.matches) {
        video.pause();
        return;
      }

      video.play().catch(() => {
        // Autoplay blocked — background stays on poster/fallback color.
      });
    }

    syncPlayback();
    motionQuery.addEventListener("change", syncPlayback);

    return () => motionQuery.removeEventListener("change", syncPlayback);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/logo.jpg"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Light overlay on the text side (RTL start / right) — video stays visible elsewhere */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />
    </div>
  );
}
