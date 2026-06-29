"use client";

import { useRef, useCallback, useState, useEffect, type ReactNode } from "react";
import "./MagicBento.css";

interface BentoCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  children?: ReactNode;
  className?: string;
  particleColor?: string;
  progress?: number;
  progressColor?: string;
}

export function BentoCard({
  label,
  value,
  description,
  icon,
  iconBg,
  iconColor,
  children,
  className = "",
  particleColor = "hsl(262, 83%, 58%)",
  progress,
  progressColor = "hsl(262, 83%, 58%)",
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; delay: number }[]
  >([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--glow-x", `${x}px`);
    el.style.setProperty("--glow-y", `${y}px`);
    el.style.setProperty("--glow-intensity", "1");
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--glow-intensity", "0");
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        delay: Math.random() * 0.3,
      }));
      setParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, 2500);
    },
    []
  );

  return (
    <div
      ref={cardRef}
      className={`bento-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Particles */}
      <div className="bento-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="bento-particle"
            style={{
              left: p.x,
              top: p.y,
              background: particleColor,
              animationDelay: `${p.delay}s`,
              boxShadow: `0 0 6px ${particleColor}`,
            }}
          />
        ))}
      </div>

      {/* Sparkle decorations */}
      <div
        className="bento-sparkle"
        style={{ top: "15%", right: "20%", animationDelay: "0s", background: particleColor }}
      />
      <div
        className="bento-sparkle"
        style={{ top: "60%", right: "10%", animationDelay: "1s", background: particleColor }}
      />
      <div
        className="bento-sparkle"
        style={{ top: "30%", left: "10%", animationDelay: "2s", background: particleColor }}
      />

      {/* Icon */}
      <div className={`bento-icon ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div className="bento-label">{label}</div>
        <div className="bento-value mt-2">{value}</div>
        {description && <div className="bento-description mt-1">{description}</div>}
        {progress !== undefined && (
          <div className="bento-progress mt-3">
            <div
              className="bento-progress-fill"
              style={{ width: `${progress}%`, background: progressColor }}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return <div className="bento-grid">{children}</div>;
}
