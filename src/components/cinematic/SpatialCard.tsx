'use client';

import React, { useRef, useState } from 'react';

interface SpatialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  badge?: string;
  className?: string;
  tiltIntensity?: number;
  theme?: 'dark' | 'light';
}

/**
 * SpatialCard: Clean 3D perspective mouse tilt with cursor-tracking radial glare
 * Ultra-clean Swiss Minimalist finish without cluttering HUD/crosshair artifacts.
 */
export function SpatialCard({
  children,
  badge,
  className = '',
  tiltIntensity = 6,
  theme = 'light',
  ...props
}: SpatialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 0, y: 0, opacity: 0 });

  const isDark = theme === 'dark';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates (-0.5 to +0.5)
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    setRotateX(-normalizedY * tiltIntensity);
    setRotateY(normalizedX * tiltIntensity);
    setGlarePos({ x, y, opacity: isDark ? 0.2 : 0.12 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className={`group relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        ref={cardRef}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.18s cubic-bezier(0.2, 0, 0, 1)',
        }}
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          isDark
            ? 'border-zinc-800/80 bg-zinc-950/80 shadow-2xl backdrop-blur-2xl hover:border-zinc-700'
            : 'border-zinc-200/90 bg-white/95 shadow-xl shadow-zinc-200/40 backdrop-blur-xl hover:border-zinc-300'
        }`}
      >
        {/* Studio Top Rim Highlight */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[1px] ${
            isDark
              ? 'bg-gradient-to-r from-transparent via-white/25 to-transparent'
              : 'bg-gradient-to-r from-transparent via-orange-500/20 to-transparent'
          }`}
        />

        {/* Dynamic Cursor-Tracking Radial Glare Spotlight */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: isDark
              ? `radial-gradient(420px circle at ${glarePos.x}px ${glarePos.y}px, rgba(255,255,255,0.2), transparent 75%)`
              : `radial-gradient(420px circle at ${glarePos.x}px ${glarePos.y}px, rgba(234,88,12,0.1), transparent 75%)`,
          }}
        />

        {/* Optional Status Badge Header */}
        {badge && (
          <div
            style={{ transform: 'translateZ(18px)' }}
            className={`flex items-center px-6 pt-5 pb-2 text-xs ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-orange-600 dark:text-orange-400 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
              {badge}
            </span>
          </div>
        )}

        {/* Floating Content Body on Z-Axis */}
        <div style={{ transform: 'translateZ(26px)' }} className="relative z-10 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
