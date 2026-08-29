"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goNext();
      if (e.key === "ArrowRight") goPrev();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, goNext, goPrev]);

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-alt shadow-[var(--shadow-soft)]"
          aria-label="הגדל תמונה"
        >
          <Image
            src={activeImage}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
            priority
          />
          <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-lg bg-primary/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-4 w-4" />
            הגדלה
          </span>
        </button>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                  index === activeIndex
                    ? "border-accent"
                    : "border-border hover:border-primary/40",
                )}
                aria-label={`תמונה ${index + 1}`}
                aria-current={index === activeIndex}
              >
                <Image
                  src={image}
                  alt={`${productName} — תמונה ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="גלריית תמונות"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 start-4 rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="סגור"
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute end-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label="תמונה קודמת"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute start-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label="תמונה הבאה"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="relative h-[70vh] w-full max-w-4xl">
            <Image
              src={activeImage}
              alt={productName}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
