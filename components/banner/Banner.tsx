"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface BannerProps {
  messages: string[];
  speed?: number;
}

export const Banner: React.FC<BannerProps> = ({ messages, speed = 40 }) => {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mesure des dimensions avec ResizeObserver pour de meilleures performances
  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const containerEntry = entries.find(
        (entry) => entry.target === containerRef.current
      );
      const contentEntry = entries.find(
        (entry) => entry.target === contentRef.current
      );

      if (containerEntry) {
        setContainerWidth(containerEntry.contentRect.width);
      }
      if (contentEntry) {
        setContentWidth(contentEntry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Animation optimisée avec requestAnimationFrame
  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      if (!contentRef.current || !containerWidth || !contentWidth) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = timestamp - startTimeRef.current;
      const pixelsMoved = (elapsed * speed) / 1000;
      const position =
        containerWidth - (pixelsMoved % (containerWidth + contentWidth));

      contentRef.current.style.transform = `translate3d(${position}px, 0, 0)`;

      animationRef.current = requestAnimationFrame(animate);
    },
    [speed, containerWidth, contentWidth]
  );

  useEffect(() => {
    if (containerWidth && contentWidth) {
      startTimeRef.current = undefined;
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, containerWidth, contentWidth]);

  // Version mobile simplifiée avec CSS animations
  if (isMobile) {
    return (
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-pink-500/8 via-purple-500/8 to-pink-500/8 border-b border-white/8">
        {/* Dégradés simplifiés pour mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

        <div className="h-10 flex items-center">
          <div className="animate-scroll-mobile whitespace-nowrap flex items-center gap-6">
            {[...messages, ...messages, ...messages].map((message, index) => (
              <span key={index} className="text-sm font-medium text-pink-300">
                {message}
              </span>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll-mobile {
            0% {
              transform: translate3d(100%, 0, 0);
            }
            100% {
              transform: translate3d(-100%, 0, 0);
            }
          }
          .animate-scroll-mobile {
            animation: scroll-mobile ${20 + messages.length * 2}s linear
              infinite;
            will-change: transform;
          }
        `}</style>
      </div>
    );
  }

  // Version desktop complète
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border-b border-white/10">
      {/* Dégradés latéraux */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

      <div ref={containerRef} className="relative h-10 flex items-center">
        <div
          ref={contentRef}
          className="absolute whitespace-nowrap flex items-center gap-8"
          style={{
            willChange: "transform",
          }}
        >
          {[...messages, ...messages].map((message, index) => (
            <span
              key={index}
              className="text-sm font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
            >
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
