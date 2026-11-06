'use client';

import React from 'react';

interface LivingBackgroundProps {
  showGrid?: boolean;
  showNoise?: boolean;
  showAurora?: boolean;
  accentColor?: string;
  theme?: 'dark' | 'light';
}

/**
 * Living Atmospheric Background (Awwwards + UI/UX Pro Max specification)
 * Enriches the canvas with SVG film grain, 3D perspective grid, and studio aurora lighting.
 */
export function LivingBackground({
  showGrid = true,
  showNoise = true,
  showAurora = true,
  accentColor = '#EA580C', // Panggil Orange
  theme = 'light',
}: LivingBackgroundProps) {
  const isDark = theme === 'dark';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden select-none"
    >
      {/* Base Canvas background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-zinc-950' : 'bg-[#FAFAFA]'}`} />

      {/* 1. Subtle SVG Analog Film Grain Overlay */}
      {showNoise && (
        <svg
          className={`fixed inset-0 h-full w-full pointer-events-none ${
            isDark ? 'opacity-[0.038] mix-blend-screen' : 'opacity-[0.03] mix-blend-multiply'
          }`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="panggilGrain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#panggilGrain)" />
        </svg>
      )}

      {/* 2. 3D Perspective Grid with Radial Falloff Mask */}
      {showGrid && (
        <div
          className={`absolute inset-0 ${isDark ? 'opacity-[0.14]' : 'opacity-[0.08]'}`}
          style={{
            backgroundImage: isDark
              ? `linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)`
              : `linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)`,
            backgroundSize: '54px 54px',
            maskImage:
              'radial-gradient(ellipse 75% 60% at 50% 15%, #000 25%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 75% 60% at 50% 15%, #000 25%, transparent 80%)',
          }}
        />
      )}

      {/* 3. Kinetic Aurora Studio Lighting Leaks */}
      {showAurora && (
        <>
          {/* Top Key Light (Panggil Orange Glow) */}
          <div
            className="absolute -top-[18%] left-1/2 h-[600px] w-[880px] -translate-x-1/2 rounded-full blur-[130px] pointer-events-none"
            style={{
              background: isDark
                ? `radial-gradient(circle, ${accentColor} 0%, rgba(234, 88, 12, 0.12) 50%, transparent 80%)`
                : `radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.05) 50%, transparent 80%)`,
              opacity: isDark ? 0.35 : 0.85,
            }}
          />

          {/* Secondary Soft Ambient Light */}
          <div
            className={`absolute top-[40%] -left-[12%] h-[480px] w-[580px] rounded-full blur-[120px] pointer-events-none ${
              isDark ? 'bg-emerald-600/10' : 'bg-emerald-500/05'
            }`}
          />

          {/* Ground Reflection Accent */}
          <div
            className={`absolute top-[75%] -right-[10%] h-[450px] w-[550px] rounded-full blur-[120px] pointer-events-none ${
              isDark ? 'bg-orange-600/10' : 'bg-orange-500/05'
            }`}
          />
        </>
      )}

      {/* 4. Horizon Gradient Ground Fade */}
      <div
        className={`absolute inset-x-0 bottom-0 h-32 ${
          isDark
            ? 'bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent'
            : 'bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent'
        }`}
      />
    </div>
  );
}
