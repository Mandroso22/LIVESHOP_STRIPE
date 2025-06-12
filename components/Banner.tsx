"use client";

import { useEffect, useState } from "react";

interface BannerProps {
  messages: string[];
  speed?: number; // Vitesse de défilement en pixels par seconde
}

export const Banner: React.FC<BannerProps> = ({
  messages = [
    "🎉 Nouveaux produits disponibles !",
    "🚚 Livraison gratuite à partir de 50€",
    "💫 Offre spéciale : -20% sur votre première commande",
    "⭐️ Rejoignez notre communauté TikTok !",
  ],
  speed = 30,
}) => {
  const [position, setPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const container = document.getElementById("banner-container");
    const content = document.getElementById("banner-content");

    if (container && content) {
      setContainerWidth(container.offsetWidth);
      setContentWidth(content.offsetWidth);
    }

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPosition = prev - speed / 60; // Ajustement pour 60fps
        return newPosition <= -contentWidth ? containerWidth : newPosition;
      });
    }, 1000 / 60); // 60fps

    return () => clearInterval(interval);
  }, [speed, containerWidth, contentWidth]);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border-b border-white/10">
      {/* Dégradés latéraux */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

      {/* Conteneur du défilement */}
      <div id="banner-container" className="relative h-10 flex items-center">
        <div
          id="banner-content"
          className="absolute whitespace-nowrap flex items-center gap-8"
          style={{
            transform: `translateX(${position}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          {/* Duplication du contenu pour un défilement continu */}
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
