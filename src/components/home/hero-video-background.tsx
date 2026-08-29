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
        // Autoplay blocked — poster remains visible.
      });
    }

    syncPlayback();
    motionQuery.addEventListener("change", syncPlayback);

    return () => motionQuery.removeEventListener("change", syncPlayback);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-primary" aria-hidden="true">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[center_35%] sm:object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/logo.jpg"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* RTL-aware overlays: darken start (right) for text, bottom for depth */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/45 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}
