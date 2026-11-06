'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import Link from 'next/link';

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'emerald' | 'glass';
  glowColor?: string;
  icon?: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

/**
 * MagneticButton: Spring-physics magnetic control with conic border beam and rolling text
 * (Awwwards UI + Cinematic UI 2.0 specification).
 */
export function MagneticButton({
  children,
  variant = 'primary',
  glowColor = '#EA580C', // Orange
  icon,
  href,
  target,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Framer motion spring physics
  const springConfig = { damping: 15, stiffness: 180, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!buttonRef.current || disabled) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // 0.32 magnetic pull factor
    x.set((e.clientX - centerX) * 0.32);
    y.set((e.clientY - centerY) * 0.32);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const variantStyles = {
    primary:
      'bg-zinc-950 text-white border-zinc-800 shadow-lg shadow-zinc-950/20 hover:border-zinc-700',
    secondary:
      'bg-white text-zinc-950 border-zinc-200 shadow-md shadow-zinc-200/50 hover:border-zinc-300',
    emerald:
      'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20 hover:bg-emerald-500',
    glass:
      'bg-zinc-900/80 text-white backdrop-blur-xl border-white/15 shadow-xl hover:border-white/30',
  };

  const innerContent = (
    <>
      {/* 1. Animated Conic Border Beam */}
      <span
        className="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${glowColor} 60deg, transparent 120deg)`,
          animation: 'spin 3s linear infinite',
        }}
      />

      {/* 2. Internal Card Substrate */}
      <span
        className={`absolute inset-[1px] rounded-[11px] transition-colors ${
          variant === 'primary'
            ? 'bg-zinc-950 group-hover:bg-zinc-900'
            : variant === 'emerald'
            ? 'bg-emerald-600 group-hover:bg-emerald-500'
            : variant === 'glass'
            ? 'bg-zinc-950/85'
            : 'bg-white group-hover:bg-zinc-50'
        }`}
      />

      {/* 3. Radial Spotlight Glare on Hover */}
      <span
        className="pointer-events-none absolute -inset-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
        }}
      />

      {/* 4. Dual-Layer Rolling Typography */}
      <span className="relative z-10 block h-[1.35em] overflow-hidden leading-[1.35em] font-mono font-bold">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          className={`block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full ${
            variant === 'secondary' ? 'text-orange-600' : 'text-zinc-300'
          }`}
        >
          {children}
        </span>
      </span>

      {/* 5. Optional Icon Slot */}
      {icon && (
        <span className="relative z-10 ms-2 inline-flex items-center transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
    </>
  );

  const commonClass = `group relative inline-flex items-center justify-center overflow-hidden rounded-xl border px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer select-none active:scale-[0.98] ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <motion.div
        ref={buttonRef as React.RefObject<HTMLDivElement>}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        <Link href={href} target={target} className={commonClass}>
          {innerContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      style={{ x, y }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={commonClass}
    >
      {innerContent}
    </motion.button>
  );
}
