# PANGGIL APP — DESIGN SPECIFICATION & ARCHITECTURE (DESIGN.md)

## 1. Anti-Slop Philosophy & Banned Patterns
- **No Indigo / Violet / Purple:** Absolutely prohibited. Any default AI Tailwind indigo/purple color palette is banned.
- **No Background Blur/Glow Blobs:** Absolutely no `blur-*` blobs, radial gradient fog, or decorative blurred circular blobs.
- **No Symmetric Card Repetition:** No generic 3-card identical feature rows.
- **No Synthetic Placeholders:** Every UI mockup must depict real operational workflows (real order numbers, barista queues, wait telemetry, Google reviews).

## 2. Swiss Minimalist Foundation
- **Canvas Ground:** Clean neutral `bg-zinc-50` (`#FAFAFA`) for light mode, structured with precision.
- **High-Contrast Ink:** Pure high-contrast typography (`text-zinc-950` / `#09090B`, `text-zinc-600`, `text-zinc-400`).
- **Razor-Sharp Borders:** Strict 1px structural lines (`border-zinc-200`, `border-zinc-300`).
- **Monospace Elements:** Strict `font-mono` for order numbers (e.g. `#A-108`), prices, timers, timestamps, and system latency metrics.
- **Functional Accent:**
  - `Orange-600` (`#EA580C`) for brand signature and primary action.
  - `Emerald-600` (`#16A34A`) exclusively for the "Order Ready" / "Pesanan Siap" state with subtle pulse indicator.
  - `Amber-500` (`#F59E0B`) for "In Preparation / Sedang Diproses" state.

## 3. Hero Architecture (Two-Column Split)
- **Column 1 (Operational Value & Value Proposition):**
  - High-impact editorial headline emphasizing operational savings and zero-hardware capability.
  - Direct explanation of how customer phones replace plastic hardware coaster pagers.
  - Direct CTA buttons (POS Demo, Guest Menu, Sound Test).
  - Micro-telemetry bar (0 App Downloads, <150ms WebSocket latency, 85% cost savings).
- **Column 2 (Interactive Live Digital Pager Component):**
  - Client component with React state.
  - Displays a digital customer ticket for `#A-108`.
  - Interactive status toggle button:
    - State A: "قيد التجهيز / Sedang Diproses" (Amber-500 badge).
    - State B: "طلبك جاهز للاستلام / Pesanan Siap" (Emerald-600 badge with visual pulse & haptic chime simulation).
  - Quick multi-language preview bar above the simulator (ID · Bahasa / AR · العربية / EN · English).

## 4. Asymmetric Bento Grid
- Varied column spans (e.g. 8-col + 4-col, 4-col + 8-col, 6-col + 6-col).
- Real miniature UI components embedded inside:
  - **Tile 1 (Live Cashier Queue & Dispatcher):** Order cards, active ticket queue, re-buzz actions.
  - **Tile 2 (Acrylic Table Stand & QR Scanner):** Visual scan target, instant web launch in Safari/Chrome.
  - **Tile 3 (Automated Google Maps Reviews):** 5-star rating modal routing to Google Maps.
  - **Tile 4 (Interactive Digital Menu & Upselling):** Category tabs, dish cards with prices in IDR/SAR/USD, and modifiers.
  - **Tile 5 (Audio Keep-Alive Survival):** Technical diagram of silent audio background loop.
  - **Tile 6 (Multi-Outlet & Branch Selector):** Branch switcher (Jakarta, Bali, Riyadh) with staff PIN access.

## 5. Performance & Next.js App Router Architecture
- Split stateful interactive parts into dedicated Client Components (`'use client'`).
- Keep structural layout and static presentation performant and lightweight.
- Ensure strict TypeScript typing (zero `any`).
- Full responsive fidelity across mobile (360px+) and desktop (1440px+).
