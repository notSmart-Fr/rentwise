# RentWise Design Language: Manifest

The RentWise Design Language is a premium, fintech-inspired system characterized by deep "Obsidian Slate" surfaces, cinematic ambient lighting, and high-contrast editorial typography.

## 1. Color Palette & Surfaces

- **Background (Obsidian Slate):** `#0b1326`
  - The "Infinite" base. Use this for the main background of every page.
- **Surface (Container Low):** `#131b2e`
  - Used for large sectional panels and background wrappers.
- **Surface (Container High):** `#222a3d`
  - **The Standard for Cards.** Used for primary interaction modules and property cards.
- **Surface (Container Highest):** `#2d3449`
  - Used for active states, popovers, and elevated focus zones.
- **Primary Accent:** `bg-linear-to-r from-[#c0c1ff] to-[#8083ff]` (RentWise Indigo to Deep Violet)
  - Used for primary CTAs, success actions, and active states.

## 2. Geometry & Spacing

- **Primary Radius:** `rounded-[3rem]` (48px / xl)
  - Use this for all main dashboard cards, property cards, and primary containers.
- **Secondary Radius:** `rounded-[2rem]` (32px)
  - Use this for internal elements, image containers, and secondary blocks.
- **The "No-Line" Rule:**
  - **Prohibited:** 1px solid borders for sectioning content. 
  - **Standard:** Define boundaries through background color shifts (e.g., `#222a3d` on a `#131b2e` background).
  - **Fallback:** If a boundary is required for accessibility, use `outline-variant` (#464554) at 15% opacity.

## 3. Atmospherics (Cinematic UI)

- **Ambient Orbs:** 
  - Every page must have 1-2 large, blurred background gradients (`blur-[150px]`) to create depth.
- **Backdrop Blurs:** 
  - Use `backdrop-blur-[20px]` for floating elements to simulate frosted obsidian glass.
- **Shadows:**
  - Use deep, diffused ambient shadows (6% opacity tint of on-surface) instead of standard black drop shadows.

## 4. Typography

- **Core Font:** `Manrope` (Geometric precision with modern warmth).
- **Headings:** `font-black`, `tracking-tightest`. 
  - High-impact, editorial magazine style.
- **Labels:** `text-[10px]`, `uppercase`, `tracking-[0.3em]`, `font-black`.
  - Used for metadata tags and secondary section titles.

## 5. CSS Architecture (Modular)

To maintain this system, all styles MUST be partitioned into the following modules:
- `src/styles/theme.css`: Design tokens and `@theme` variables.
- `src/styles/base.css`: Typography resets and base element defaults.
- `src/styles/components.css`: Global UI classes (`glass-panel`, `btn`, `badge`).

---
*Codified with intent by Antigravity for RentWise.*
