---
name: cinematic-3d-awwwards-ui
description: Activates automatically whenever designing, building, or refactoring web interfaces, landing pages, hero sections, interactive dashboards, or frontend components. Synthesizes elite Awwwards-winning art direction, 3D spatial depth, cinematic studio lighting, GSAP/Lenis choreographed motion, and anti-AI-slop design engineering for Next.js, React, and Tailwind CSS.
---

# Cinematic 3D & Awwwards UI/UX Engineering Specification
> **The Anti-AI-Slop Creative Technologist Manifesto**  
> Synthesizing: *Awwwards UI Skill*, *Cinematic UI 2.0*, *Antigravity Design Expert*, *Certum Smooth Scroll*, and *UI/UX Pro Max*.

---

## 1. Strict Anti-AI-Slop Ban List (Zero-Tolerance Rules)

Every frontend engineer and AI agent operating under this skill must treat the following patterns as **critical production regressions**:

1. **NO Flat, Lifeless Backgrounds:**  
   Banned: Bare `#FFFFFF`, `#000000`, or generic solid gray canvases.  
   *Mandatory Requirement:* Every viewport must breathe with a living texture stack: SVG fractal noise film grain (`feTurbulence`), perspective horizon grids with radial falloff masks, and kinetic Aurora lighting leaks.
2. **NO Symmetrical 3-Card Columns ("The Boring AI Triad"):**  
   Banned: Three identical columns with a centered Lucide icon in a colored circle, a bold title, and a 2-line generic description.  
   *Mandatory Requirement:* Asymmetrical Bento Grids with variable col/row spans (`col-span-12 md:col-span-8` paired with `md:col-span-4`), internal interactive micro-UIs (interactive toggles, live telemetry, draggable widgets, code inspection tabs), and monospace coordinate watermarks.
3. **NO Generic Rounded Pill Buttons:**  
   Banned: `rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white shadow-lg`.  
   *Mandatory Requirement:* Tactile 3D or Magnetic controls with spring physics, rotating conic-gradient border beams, liquid clip-path sweeps, and dual-layer rolling typography.
4. **NO Static Viewports / Instant Pop-ins:**  
   Banned: Elements snapping into existence or relying solely on default browser jump scrolling.  
   *Mandatory Requirement:* Buttery momentum scrolling via Lenis, scrubbed GSAP `ScrollTrigger` parallax offsets, and staggered word-by-word / character-by-character masked reveals.
5. **NO Unstyled Generic Typography:**  
   Banned: Relying on unconfigured default fonts (raw Arial/Inter with default weights and loose line-heights).  
   *Mandatory Requirement:* Editorial font pairings with tight tracking (`tracking-[-0.04em]` on displays), bespoke monospace accent badges (`font-mono text-xs uppercase tracking-widest`), and strict optical line-height adjustments for Arabic (RTL) vs Latin (LTR).
6. **NO Artificial Glowing Blobs in Mid-Air:**  
   Banned: Random `blur-3xl bg-purple-500/30` circles floating disconnected from layout geometry.  
   *Mandatory Requirement:* Architectural studio rim lighting anchored to physical card boundaries (`border-t-white/20`, directional spotlights following cursor coordinates, and floor plane shadow reflections).

---

## 2. The 5 Mandatory Architectural Layers

Every cinematic interface must be constructed through 5 calibrated, stacked layers:

```
┌─────────────────────────────────────────────────────────────┐
│ Layer E: Studio Glassmorphism & Typographic Direction (RTL) │
├─────────────────────────────────────────────────────────────┤
│ Layer D: Choreographed Motion (GSAP + Lenis + SplitText)   │
├─────────────────────────────────────────────────────────────┤
│ Layer C: Magnetic & Tactile Controls (Physics Springs)      │
├─────────────────────────────────────────────────────────────┤
│ Layer B: Spatial 3D Centerpiece & Z-Axis Plane (R3F / CSS)  │
├─────────────────────────────────────────────────────────────┤
│ Layer A: Living Atmospheric Background & HUD Ornaments      │
└─────────────────────────────────────────────────────────────┘
```

---

### Layer A: Living Backgrounds & Architectural Ornaments
The background is an active sensory environment, not negative space.

1. **Subtle Film Grain Overlay:**  
   Inject an ultra-lightweight SVG `fractalNoise` filter at 2.5% - 4.5% opacity with `pointer-events-none fixed inset-0 z-50 mix-blend-overlay`. This eliminates color banding in gradients and imparts tactile analog richness.
2. **Perspective Grid Floor & Ceiling:**  
   Use an isometric 3D perspective grid (`perspective: 1000px`, `rotateX(60deg)`) masked with `mask-image: radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)`.
3. **Corner Brackets & HUD Coordinate Markers:**  
   Frame cards and sections with precision technical ornaments:
   - Corner ticks: `┌ ┐ └ ┘` or SVG hairline crosshairs (`+`) anchored to four corners.
   - Monospace micro-telemetry: `LAT: 24.7136° N`, `STATUS: SYS_ONLINE`, `SYS_REV // 0.88`.

---

### Layer B: Spatial 3D Depth & Z-Axis Rigs
Flat 2D layouts flatten engagement. We command the Z-axis.

1. **Centerpiece 3D Canvas (`@react-three/fiber` + `@react-three/drei`):**  
   - Mount an interactive 3D hero artifact (sculpted geometric prism, refractive transmission glass, or dynamic metallic token).
   - Bind cursor position to camera rotation with smooth damping (`damp3` or lerp) for lifelike mouse parallax.
   - Studio lighting 3-point setup: Key light (warm directional), Fill light (cool ambient), and Rim light (high-intensity graze angle).
2. **CSS 3D Tilt Cards (`preserve-3d`):**  
   - Cards calculate mouse position relative to their center `(dx, dy)` and rotate on both `rotateX` and `rotateY` (-8° to +8°).
   - Inner content elements carry `translateZ(30px)` to float independently above the card substrate.
   - Dynamic radial spotlight glare: A `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 70%)` follows the mouse cursor on the border and surface.

---

### Layer C: Magnetic & Tactile Controls
Every click should feel physically satisfying, rewarding visitor curiosity.

1. **Spring-Physics Magnetic Pull:**  
   Buttons track cursor entry within a bounding threshold (e.g., 40px margin) and pull towards the cursor using spring physics (`stiffness: 150`, `damping: 15`). Upon exit, they snap back with an organic elastic settle.
2. **Spinning Conic-Gradient Border Beams:**  
   Border outlines feature a traveling laser beam rendered using an animated conic gradient:  
   `background: conic-gradient(from 0deg at 50% 50%, transparent 0deg, var(--accent) 60deg, transparent 120deg)`.
3. **Liquid Hover Sweeps:**  
   Hover fills expand from the exact coordinate of mouse entry using CSS clip-path or absolute scale transforms.
4. **Dual-Layer Rolling Text:**  
   Button text is duplicated in a masked overflow-hidden container. On hover, the primary text rolls up (`translateY(-100%)`) while the secondary clone rolls up from the bottom into view (`translateY(0)`).

---

### Layer D: Choreographed Motion & Smooth Scroll
Disjointed animations break immersion. Motion must be unified and cinematic.

1. **Smooth Kinetic Scroll (Lenis):**  
   Initialize Lenis smooth scroll with `lerp: 0.08` and `wheelMultiplier: 1.0` to eliminate rigid mouse-wheel stepping. Synchronize Lenis ticker with GSAP's global ticker.
2. **Scrubbed GSAP `ScrollTrigger` Parallax:**  
   Hero media, 3D meshes, and background grids scrub smoothly along the Y-axis based on scroll percentage.
3. **Masked Split-Text Staggered Reveals:**  
   Headlines reveal by line or word wrapped in `overflow-hidden` containers, translating from `translateY(110%)` to `0` with custom cubic-bezier timing (`cubic-bezier(0.16, 1, 0.3, 1)` - the expo-out ease).

---

### Layer E: Luxury Glassmorphism & Typographic Art Direction (RTL / LTR)
1. **Multi-Stop Studio Glassmorphism:**  
   Never use flat frosted glass. Use:
   - `background: rgba(18, 18, 22, 0.65)` (Dark mode) or `rgba(255, 255, 255, 0.75)` (Light mode).
   - `backdrop-filter: blur(24px) saturate(180%)`.
   - `border-top: 1px solid rgba(255, 255, 255, 0.20)` (grazing ceiling highlight).
   - `border-bottom: 1px solid rgba(0, 0, 0, 0.40)` (ambient occlusion shadow).
   - `box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)`.
2. **Full RTL (Arabic) & LTR Architectural Symmetry:**  
   - For English/Latin: High-impact editorial displays like *Syne*, *Clash Display*, or *Cabinet Grotesk*, paired with *Geist Mono* for telemetry.
   - For Arabic (RTL): Modern geometric typefaces with proper optical hierarchy (*Cairo*, *Readex Pro*, or *Tajawal*).  
   - **Crucial Arabic Typography Rule:** Arabic glyphs require generous vertical clearance. Always apply `rtl:leading-[1.45]` to prevent diacritic and ascender clipping, and avoid extreme letter-spacing (`tracking-normal` for Arabic).

---

## 3. Copy-Paste Ready Component Blueprints (Next.js App Router)

The following components are fully implemented, strictly typed in TypeScript, and ready for production in any Next.js 14/15/16 App Router application.

---

### Component 1: `MagneticButton.tsx`
*Framer Motion spring magnetic pull, conic border beam, liquid fill, and rolling text.*

```tsx
"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass";
  glowColor?: string;
  icon?: boolean;
}

export function MagneticButton({
  children,
  className = "",
  variant = "primary",
  glowColor = "#F97316", // Accent orange
  icon = true,
  onClick,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Physics spring config for organic weightless feel
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Pull strength factor (0.35 for subtle magnetic snap)
    x.set((e.clientX - centerX) * 0.35);
    y.set((e.clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const variantStyles = {
    primary: "bg-zinc-950 text-white border-zinc-800 hover:border-zinc-700",
    secondary: "bg-white text-zinc-950 border-zinc-200 hover:border-zinc-300",
    glass: "bg-zinc-900/60 text-white backdrop-blur-xl border-white/10 hover:border-white/20",
  };

  return (
    <motion.button
      ref={buttonRef}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-xl border px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer select-none active:scale-95 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Animated Conic Border Beam */}
      <span
        className="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${glowColor} 60deg, transparent 120deg)`,
          animation: "spin 3s linear infinite",
        }}
      />

      {/* Internal Card Background Mask (protecting inner text from the border beam) */}
      <span className="absolute inset-[1px] rounded-[11px] bg-zinc-950/90 transition-colors group-hover:bg-zinc-950/75" />

      {/* Ambient Radial Spotlight inside button */}
      <span
        className="pointer-events-none absolute -inset-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
        }}
      />

      {/* Rolling Dual-Layer Typography */}
      <span className="relative z-10 block h-[1.3em] overflow-hidden leading-[1.3em]">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span className="block text-zinc-300 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {children}
        </span>
      </span>

      {/* Optional Interactive Micro Arrow */}
      {icon && (
        <span className="relative z-10 ms-2 inline-block overflow-hidden w-4 h-4">
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      )}
    </motion.button>
  );
}
```

---

### Component 2: `SpatialCard.tsx`
*3D mouse tilt with perspective, cursor-tracking radial glare, and architectural corner crosshairs.*

```tsx
"use client";

import React, { useRef, useState } from "react";

interface SpatialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  badge?: string;
  telemetryCode?: string;
  className?: string;
}

export function SpatialCard({
  children,
  badge,
  telemetryCode = "SYS // 01",
  className = "",
  ...props
}: SpatialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates (-0.5 to +0.5)
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    // Tilt limits: 7 degrees max
    setRotateX(-normalizedY * 12);
    setRotateY(normalizedX * 12);
    setGlarePos({ x, y, opacity: 0.18 });
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
          transformStyle: "preserve-3d",
          transition: "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
        }}
        className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-zinc-700"
      >
        {/* Architectural Studio Ceiling Lighting (Top Rim Highlight) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Dynamic Cursor-Tracking Glare/Spotlight */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(400px circle at ${glarePos.x}px ${glarePos.y}px, rgba(255,255,255,0.18), transparent 75%)`,
          }}
        />

        {/* Precision Architectural Corner Crosshairs (+) */}
        <div className="pointer-events-none absolute top-2 left-2.5 font-mono text-[9px] text-zinc-600 select-none">
          +
        </div>
        <div className="pointer-events-none absolute top-2 right-2.5 font-mono text-[9px] text-zinc-600 select-none">
          +
        </div>
        <div className="pointer-events-none absolute bottom-2 left-2.5 font-mono text-[9px] text-zinc-600 select-none">
          +
        </div>
        <div className="pointer-events-none absolute bottom-2 right-2.5 font-mono text-[9px] text-zinc-600 select-none">
          +
        </div>

        {/* Card Header Metadata (HUD Style) */}
        {(badge || telemetryCode) && (
          <div
            style={{ transform: "translateZ(25px)" }}
            className="flex items-center justify-between pb-4 border-b border-zinc-900 text-xs font-mono"
          >
            {badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {badge}
              </span>
            )}
            {telemetryCode && (
              <span className="text-[10px] text-zinc-500 tracking-wider">
                {telemetryCode}
              </span>
            )}
          </div>
        )}

        {/* Floating Content Body on Z-Axis */}
        <div
          style={{ transform: "translateZ(35px)" }}
          className="relative z-10 pt-4"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
```

---

### Component 3: `LivingBackground.tsx`
*SVG fractalNoise film grain overlay, 3D perspective grid with radial falloff, and animated Aurora light leaks.*

```tsx
"use client";

import React from "react";

interface LivingBackgroundProps {
  showGrid?: boolean;
  showNoise?: boolean;
  showAurora?: boolean;
  accentColor?: string; // Hex color code
}

export function LivingBackground({
  showGrid = true,
  showNoise = true,
  showAurora = true,
  accentColor = "#F97316",
}: LivingBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-zinc-950">
      {/* 1. Subtle SVG Film Grain Overlay */}
      {showNoise && (
        <svg
          className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.035] mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      )}

      {/* 2. Perspective 3D Grid with Radial Falloff Mask */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 65% 55% at 50% 25%, #000 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 65% 55% at 50% 25%, #000 30%, transparent 80%)",
          }}
        />
      )}

      {/* 3. Kinetic Aurora Light Leaks (Studio Lighting) */}
      {showAurora && (
        <>
          {/* Primary Top Key Light */}
          <div
            className="absolute -top-[25%] left-1/2 h-[650px] w-[850px] -translate-x-1/2 rounded-full blur-[140px] opacity-25"
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, rgba(249, 115, 22, 0.1) 50%, transparent 80%)`,
            }}
          />

          {/* Secondary Cool Ambient Fill Light */}
          <div className="absolute top-[35%] -left-[15%] h-[500px] w-[600px] rounded-full bg-cyan-600/10 blur-[130px]" />

          {/* Subtle Bottom Ground Reflection */}
          <div className="absolute -bottom-[20%] right-[10%] h-[450px] w-[550px] rounded-full bg-emerald-600/10 blur-[120px]" />
        </>
      )}

      {/* 4. Horizon Ground Fog Line */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
    </div>
  );
}
```

---

### Component 4: `Hero3DScene.tsx`
*React Three Fiber floating metallic/glass geometry with mouse parallax and graceful fallback.*

```tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingArtifact() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Ambient slow rotation
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.25;

    // Smooth lerp mouse parallax response
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      mousePos.x * 0.6,
      0.05
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      mousePos.y * 0.6,
      0.05
    );
  });

  return (
    <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.8}>
      <mesh ref={meshRef}>
        {/* High-geometry Torus Knot or Icosahedron */}
        <torusKnotGeometry args={[1.2, 0.38, 128, 32]} />
        {/* Luxury Glass Refractive Material */}
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={0.92}
          roughness={0.12}
          thickness={1.4}
          ior={1.52}
          chromaticAberration={0.06}
          anisotropy={0.2}
          color="#FF9E4A"
        />
      </mesh>
    </Float>
  );
}

export function Hero3DScene() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    // Graceful CSS 3D fallback for environments without WebGL
    return (
      <div className="relative flex h-full min-h-[420px] w-full items-center justify-center">
        <div className="h-64 w-64 rounded-full border border-orange-500/30 bg-gradient-to-tr from-orange-500/20 via-transparent to-amber-300/10 shadow-[0_0_80px_rgba(249,115,22,0.25)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[460px] w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        {/* Studio 3-Point Lights */}
        <directionalLight position={[10, 10, 5]} intensity={1.8} color="#FFF" />
        <directionalLight position={[-10, -5, -5]} intensity={0.8} color="#38BDF8" />
        <pointLight position={[0, -2, 2]} intensity={1.2} color="#F97316" />
        
        <FloatingArtifact />
      </Canvas>
    </div>
  );
}
```

---

## 4. Pre-Delivery Self-Audit Checklist (UI-Max Scorecard >= 88/100)

Before delivering any frontend component, page, or layout to the user, you must verify all 8 criteria below. Any failing item requires immediate remediation:

| # | Audit Criterion | Verification Standard | Pass? |
|---|-----------------|-----------------------|:-----:|
| 1 | **Texture & Depth** | Is the background enriched with SVG grain and a perspective grid rather than a flat solid color? | [ ] |
| 2 | **Anti-AI-Slop Geometry** | Are cards arranged in an asymmetric Bento Grid instead of a repetitive 3-column row? | [ ] |
| 3 | **Spatial Tilt & Glare** | Do interactive cards tilt on mouse-move with cursor-following radial lighting? | [ ] |
| 4 | **Tactile & Magnetic CTAs** | Do key action buttons feature spring physics, border beams, or liquid text rolling? | [ ] |
| 5 | **Studio Rim Lighting** | Do borders utilize subtle directional lighting (`border-t-white/20`, dark underside shadows)? | [ ] |
| 6 | **Architectural HUD Ornaments** | Are cards accented with precision corner crosshairs (`+`) or monospace telemetry badges? | [ ] |
| 7 | **Bilingual Typography (RTL/LTR)** | In Arabic mode, is `rtl:leading-[1.45]` enforced to prevent ascender clipping with appropriate modern fonts (*Cairo/Tajawal*)? | [ ] |
| 8 | **Performance & Accessibility** | Are 3D and canvas effects wrapped in `use client` with graceful fallbacks and zero layout shift? | [ ] |

**Score Threshold:** Minimum **88 / 100** required for release. If below 88, apply Layer B & Layer C enhancements immediately.
