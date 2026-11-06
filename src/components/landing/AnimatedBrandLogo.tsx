'use client';

import React, { useState } from 'react';
import { audioEngine } from '@/lib/audio-engine';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRays?: boolean;
  interactive?: boolean;
  className?: string;
}

export function AnimatedBrandLogo({
  size = 'md',
  showRays = true,
  interactive = true,
  className = '',
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const dimensionClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const imageRounding = {
    sm: 'rounded-xl',
    md: 'rounded-2xl',
    lg: 'rounded-3xl',
    xl: 'rounded-[32px]',
  };

  const handleLogoClick = async () => {
    if (!interactive) return;
    setIsClicked(true);
    try {
      await audioEngine.unlockAudioAndKeepAlive();
      // Soft gentle chime on logo click
      audioEngine.playBeepPulse(960, 0.12, 'sine');
    } catch {}
    setTimeout(() => setIsClicked(false), 600);
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleLogoClick}
      title={interactive ? 'انقر لتجربة رنين وتفاعل الشعار' : undefined}
    >
      {/* Radiating Concentric Radar Waves Behind Logo */}
      {showRays && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-full h-full rounded-3xl border border-orange-500/40 animate-radar-1" />
          <div className="absolute w-full h-full rounded-3xl border border-orange-500/30 animate-radar-2" />
          <div className="absolute w-full h-full rounded-3xl border border-emerald-500/30 animate-radar-3" />
        </div>
      )}

      {/* Main Logo Container with 3D Depth & Motion */}
      <div
        className={`relative ${dimensionClasses[size]} ${imageRounding[size]} bg-white border-2 border-zinc-300 p-0.5 shadow-md transition-all duration-300 ${
          interactive ? 'cursor-pointer hover:border-orange-500 hover:scale-105 active:scale-95' : ''
        } ${isClicked ? 'ring-4 ring-orange-500/40 scale-110' : ''}`}
      >
        {/* The Official Panggil Logo Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/panggil-logo.jpg"
          alt="Panggil Official Logo"
          className={`w-full h-full object-cover ${imageRounding[size]}`}
        />

        {/* LED Signal Indicator Light 1: Flashing Call Node (Red) */}
        <span
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-white shadow-xs ${
            isHovered || isClicked ? 'animate-ping' : 'animate-pulse'
          }`}
          title="LED Buzzer Indicator"
        />

        {/* LED Signal Indicator Light 2: Order Ready Node (Emerald Green) */}
        <span
          className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-[0_0_6px_#10B981]"
          title="LED Ready Indicator"
        />
      </div>
    </div>
  );
}
