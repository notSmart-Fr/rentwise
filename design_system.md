# Sovereign Ledger: Design Manifest

The Sovereign Ledger is a premium, fintech-inspired design system characterized by deep "Obsidian Slate" surfaces, cinematic ambient lighting, and high-contrast editorial typography.

## 1. Color Palette & Surfaces

- **Background (Obsidian Slate):** `#0b1326`
  - The "Infinite" base. Use this for the main background of every page.
- **Surface (Steel Container):** `#131b2e`
  - Used for cards, dashboard panels, and dropdowns. 
- **Surface Low (Deep Container):** `#0e1629`
  - Used for background elements that need to feel "recessed" or "inset."
- **Primary Accent:** `bg-linear-to-r from-[#7C3AED] to-[#38BDF8]` (Indigo to Sky Blue)
  - Used for "Success" actions, brand highlights, and active states.
- **Secondary Accent:** `bg-linear-to-br from-[#A855F7] to-[#EC4899]` (Violet to Pink)
  - Used for secondary emphasis or "Creative" sections.

## 2. Geometry & Spacing

- **Primary Radius:** `rounded-[2.5rem]` (40px)
  - Use this for all main dashboard cards, property cards, and auth panels.
- **Secondary Radius:** `rounded-2xl` (16px)
  - Use this for inputs, buttons, and smaller interface elements.
- **The "No-Line" Rule:**
  - Avoid 1px solid borders. Instead, use tonal shifts (e.g., `#131b2e` on a `#0b1326` background) and `shadow-2xl` to define edges.
  - If a border is necessary, use `border-white/5` or a subtle gradient.

## 3. Atmospherics (Cinematic UI)

- **Ambient Orbs:** 
  - Every page should have 1-2 large, blurred background gradients (`blur-[150px]`) at the corners to create depth.
- **Backdrop Blurs:** 
  - Use `backdrop-blur-[40px]` for floating elements like Navbars or overlays to simulate frosted obsidian glass.
- **Shadows:**
  - Use deep, diffused shadows: `shadow-[0_30px_60px_rgba(0,0,0,0.5)]`.

## 4. Typography

- **Core Font:** `Manrope` (or `Inter` as fallback).
- **Headings:** `font-black`, `tracking-tightest`. 
  - High-impact, editorial style.
- **Labels:** `text-[10px]`, `uppercase`, `tracking-[0.3em]`, `font-black`.
  - Used for metadata and section titles (e.g., "PORTFOLIO PRESENCE").

## 5. Components Architecture

- **Stats Cards:** Minimalist, no background, large numeric value, subtle icon.
- **Property Cards:** Asymmetrical, high-quality images, floating price tags.
- **Inputs:** Dark backgrounds (`bg-white/5`), subtle focus rings, no labels above—only inside or as "metadata labels."

---
*Created with intent by Antigravity.*
