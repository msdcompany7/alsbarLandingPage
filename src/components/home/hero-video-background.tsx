"use client";

import { useEffect, useRef, useState } from "react";

/** Optimized web hero — create with FFmpeg from public/hero-video.mp4 */
export const HERO_VIDEO_OPTIMIZED = "/hero-video.web.mp4";
export const HERO_VIDEO_FALLBACK = "/hero-video.mp4";

type HeroVideoBackgroundProps = {
  /** @deprecated Prefer optimized + fallback sources; override only for testing */
  src?: string;
};

export function HeroVideoBackground({ src }: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function applyMotionPreference() {
      if (motionQuery.matches) {
        setShouldLoadVideo(false);
        return;
      }

      setShouldLoadVideo(true);
    }

    applyMotionPreference();
    motionQuery.addEventListener("change", applyMotionPreference);

    return () => motionQuery.removeEventListener("change", applyMotionPreference);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoadVideo) {
      return;
    }

    el.load();
    el.play().catch(() => {
      // Autoplay blocked — poster remains visible.
    });
  }, [shouldLoadVideo]);

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
        disablePictureInPicture
        controls={false}
      >
        {shouldLoadVideo ? (
          src ? (
            <source src={src} type="video/mp4" />
          ) : (
            <>
              <source src={HERO_VIDEO_OPTIMIZED} type="video/mp4" />
              <source src={HERO_VIDEO_FALLBACK} type="video/mp4" />
            </>
          )
        ) : null}
      </video>

      {/* RTL-aware overlays: darken start (right) for text, bottom for depth */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/45 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}
