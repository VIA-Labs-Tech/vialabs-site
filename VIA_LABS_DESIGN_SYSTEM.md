# VIA Labs Design System

Use this document as the design reference when building any VIA Labs property. It captures the complete visual identity, color system, component patterns, and technical implementation details from vialabs.tech (the main marketing site, built with React + Vite + Tailwind CSS).

---

## Brand Identity

- **Company**: VIA Labs — Cross-Chain Interoperability Protocol
- **Aesthetic**: Clean, modern, minimal. Apple-inspired light mode with a deep-space dark mode. Professional but technically sophisticated.
- **Feel**: Trust, speed, precision. Not playful — serious infrastructure.

---

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS 3 with `darkMode: 'class'` strategy
- **Fonts**: Inter (weights 400, 500, 600, 700, 900) via `@fontsource/inter`
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v6

---

## Color Palette

### Brand Colors
| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| VIA Teal | `#00E5E5` | `via-teal` | Primary accent, CTAs, links, glows, highlights |
| VIA Pink | `#FF00FF` | `via-pink` | Secondary accent, stats, gradients |

### Light Mode
| Element | Value | Tailwind |
|---------|-------|----------|
| Page background | `#F5F5F7` | `bg-[#F5F5F7]` |
| Cards / modals | white | `bg-white` |
| Input fields | — | `bg-slate-50` |
| Borders | — | `border-slate-200` |
| Headings | — | `text-slate-900` |
| Body text | — | `text-slate-500` or `text-slate-600` |
| Muted text | — | `text-slate-400` |
| Glass navbar | white 70% + blur | `bg-white/70 backdrop-blur-md border-b border-white/20` |
| Dropdown bg | white | `bg-white` |
| Hover states | — | `hover:bg-slate-50` |

### Dark Mode
| Element | Value | Tailwind |
|---------|-------|----------|
| Page background | `#0F1117` | `bg-[#0F1117]` |
| Cards / modals | `#1a1b23` | `bg-[#1a1b23]` |
| Input fields | `#0F1117` | `bg-[#0F1117]` |
| Borders | — | `border-slate-700` |
| Headings | white | `text-white` |
| Body text | — | `text-slate-400` |
| Muted text | — | `text-slate-500` |
| Glass navbar | `#0F1117` 80% + blur | `bg-[#0F1117]/80 backdrop-blur-md border-b border-slate-800` |
| Dropdown bg | `#1a1b23` | `bg-[#1a1b23]` |
| Hover states | — | `hover:bg-slate-800` |

### Gradient Patterns
```
// Teal gradient (primary buttons, stat numbers)
bg-gradient-to-r from-via-teal to-emerald-400

// Pink gradient (secondary stats)
bg-gradient-to-r from-via-pink to-rose-400

// Teal glow effect
shadow-[0_0_15px_rgba(0,229,229,0.5)]

// Pink glow effect
shadow-[0_0_15px_rgba(236,72,153,0.5)]
```

---

## Typography

- **Font Family**: `Inter` (sans-serif stack fallback)
- **Antialiasing**: Always `antialiased`

### Scale
| Usage | Classes |
|-------|---------|
| Hero heading | `text-4xl sm:text-5xl md:text-6xl font-black` |
| Section heading | `text-3xl md:text-5xl font-bold` |
| Card heading | `text-lg md:text-xl font-semibold` |
| Body | `text-base text-slate-500 dark:text-slate-400` |
| Small / labels | `text-sm font-medium` |
| Tiny / badges | `text-xs font-semibold uppercase tracking-wider` |
| Stat numbers | `text-4xl sm:text-5xl md:text-7xl font-black` |

---

## Spacing & Layout

- **Max width**: `max-w-7xl mx-auto` (1280px centered)
- **Page padding**: `px-4 md:px-6`
- **Section spacing**: `space-y-10 md:space-y-20` (with `border-t border-slate-200 dark:border-slate-700` dividers between sections)
- **Card padding**: `p-6 sm:p-8`
- **Card gap**: `gap-4 md:gap-6`
- **Component margin**: `mb-4 md:mb-8` (responsive tightening on mobile)

### Navbar
- Mobile height: `h-16` (64px)
- Desktop height: `h-28` (112px)
- Mobile logo: `h-[56px]`
- Desktop logo: `h-[90px]`

---

## Component Patterns

### Cards
```tsx
// Standard card
className="bg-white dark:bg-[#1a1b23] rounded-3xl border border-slate-200 dark:border-slate-700 shadow-clean p-6 sm:p-8"

// Interactive card (hover lift)
className="... hover:shadow-xl hover:-translate-y-1 transition-all duration-300"

// Dark feature card (always dark regardless of theme)
className="bg-slate-900 rounded-3xl text-white"
```

### Buttons
```tsx
// Primary CTA
className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"

// Secondary / outline
className="px-5 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:border-slate-800 dark:hover:border-slate-400 hover:text-black dark:hover:text-white transition-all"

// Ghost link button
className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
```

### Badges / Pills
```tsx
className="bg-via-teal/10 dark:bg-via-teal/20 border border-via-teal/30 text-via-teal px-3 py-1 rounded-full text-xs font-mono"
```

### Dropdowns
```tsx
className="bg-white dark:bg-[#1a1b23] border border-slate-100 dark:border-slate-700 shadow-lg rounded-xl"
// Items:
className="px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
```

### Inputs
```tsx
className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F1117] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-via-teal/50 focus:border-via-teal outline-none transition-all"
```

### Modal Overlay
```tsx
className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
// Modal body:
className="bg-white dark:bg-[#1a1b23] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
```

---

## Dark Mode Implementation

### Strategy
- Tailwind `darkMode: 'class'` — toggle `dark` class on `<html>`
- Persist preference in `localStorage` key `via-theme` (values: `'light'` | `'dark'`)
- Default: light mode
- FOUC prevention: inline script in `index.html` before React mounts:
```html
<script>
  if (localStorage.getItem('via-theme') === 'dark') document.documentElement.classList.add('dark');
</script>
```

### useIsDark Hook
Reactive hook using MutationObserver to detect `dark` class changes:
```tsx
import { useState, useEffect } from 'react';

export function useIsDark(): boolean {
    const [isDark, setIsDark] = useState(
        () => document.documentElement.classList.contains('dark')
    );
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
        return () => observer.disconnect();
    }, []);
    return isDark;
}
```

### ThemeToggle Component
Sun/Moon icon button using Lucide icons. Place in navbar for both desktop and mobile (outside hamburger menu on mobile).

### Canvas / Non-React Contexts
For canvas drawing or other imperative code, check dark mode directly:
```ts
const dark = document.documentElement.classList.contains('dark');
```

---

## Animation Patterns (Framer Motion)

```tsx
// Fade in on scroll
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}

// Scale pop
initial={{ scale: 0.9, opacity: 0 }}
whileInView={{ scale: 1, opacity: 1 }}

// Stagger children (add delay)
transition={{ delay: 0.1 * index }}

// Hover lift (prefer Tailwind for simple transforms)
className="hover:-translate-y-1 transition-all duration-300"
```

**Important**: Framer Motion's `animate` prop overrides the entire CSS `transform` property. Never combine framer-motion transforms with Tailwind translate classes — use `left-0 right-0 flex justify-center` instead of `translate-x` when framer-motion is animating the element.

---

## Tailwind Config
```js
/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'via-teal': '#00E5E5',
        'via-pink': '#FF00FF',
      },
      boxShadow: {
        'clean': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
```

---

## CSS Base Styles
```css
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/inter/700.css";
@import "@fontsource/inter/900.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply antialiased text-slate-900 bg-[#F5F5F7] selection:bg-via-teal/20 selection:text-slate-900;
  }
}

.glass-nav {
  @apply bg-white/70 backdrop-blur-md border-b border-white/20;
}

.dark .glass-nav {
  @apply bg-[#0F1117]/80 backdrop-blur-md border-b border-slate-800;
}

@layer base {
  .dark body {
    @apply bg-[#0F1117] text-white selection:bg-via-teal/30 selection:text-white;
  }
}
```

---

## Responsive Breakpoints
Standard Tailwind breakpoints used throughout:
- Default: mobile-first (< 640px)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Key patterns:
- Navbar switches from hamburger to full nav at `lg`
- Grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Text scales up at `sm` and `md` breakpoints
- Padding/spacing tightens on mobile: `p-4 md:p-6`, `gap-4 md:gap-6`

---

## Logo Assets
- **Dark logo** (for light backgrounds): `Logo_300-02_b.png`
- **White logo** (for dark backgrounds): `Logo_300-02.png`
- Swap conditionally using `useIsDark()` hook
- Logos have transparent backgrounds

---

## Key Design Principles
1. **Mobile-first**: Always start with mobile classes, add `md:` / `lg:` for larger screens
2. **Consistent rounding**: `rounded-3xl` for cards, `rounded-xl` for dropdowns/inputs, `rounded-full` for buttons/pills
3. **Subtle shadows**: Use `shadow-clean` (custom) for cards, `shadow-lg` for dropdowns
4. **Accent restraint**: VIA Teal is the primary accent — use sparingly for CTAs, icons, highlights. Pink is secondary (stats, gradients only).
5. **Dark mode parity**: Every light-mode element must have a `dark:` variant. No hardcoded colors without dark equivalents.
6. **Glassmorphism navbar**: Semi-transparent with backdrop blur, fixed position
7. **Section dividers**: `border-t border-slate-200 dark:border-slate-700` between major content sections
