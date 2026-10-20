# Sok Heng Ice Factory — Design System

> Category: ERP / Operations Dashboard Design System
> Surface: Web (Desktop-first, responsive)

Created from OpenDesign project "Web Prototype" (90d8b37a-9e3b-4b1f-ba29-18272460f535).

---

## 1. Visual Theme & Atmosphere

This system powers an ice factory ERP — a production-grade operational tool used by administrators, managers, operators, and sales teams. The visual language is **calm, precise, and information-dense without feeling heavy**. It favors clarity over decoration: white cards on a pale slate background, restrained color used only for semantic meaning (status, modules, alerts), and a single geometric sans-serif doing all the work.

The feeling should be: *a tool that stays out of the way while keeping a factory running.*

---

## 2. Color

### Background Surfaces
| Token | OKLch | Hex | Usage |
|-------|-------|-----|-------|
| `--bg` | `oklch(98.5% 0.002 250)` | `#f8fafc` | Page background |
| `--surface` | `oklch(100% 0 0)` | `#ffffff` | Cards, panels, modals |
| `--surface-hover` | `oklch(97% 0.003 250)` | `#f1f5f9` | Row/card hover |

### Foreground / Text
| Token | OKLch | Hex | Usage |
|-------|-------|-----|-------|
| `--fg` | `oklch(22% 0.025 260)` | `#1e293b` | Primary text |
| `--fg-muted` | `oklch(45% 0.02 260)` | `#64748b` | Secondary text |
| `--fg-subtle` | `oklch(60% 0.015 260)` | `#94a3b8` | Captions, timestamps |

### Borders
| Token | OKLch | Hex | Usage |
|-------|-------|-----|-------|
| `--border` | `oklch(90% 0.005 250)` | `#e2e8f0` | Default borders |
| `--border-strong` | `oklch(82% 0.01 250)` | `#cbd5e1` | Emphasized borders |

### Accent (Brand Teal)
| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-50` | `#eef7f9` | Light tint backgrounds |
| `--accent-100` | `#d4ecef` | Active nav item bg |
| `--accent-500` | `#0d7c90` | Primary accent (Admin) |
| `--accent-600` | `#0a6b7d` | Accent hover, filled buttons |
| `--accent-700` | `#085563` | Accent active |

### Semantic Colors
| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Success | `--success` | `#10b981` | Positive states, delivered |
| Success bg | `--success-bg` | `#ecfdf5` | Success badge background |
| Success fg | `--success-fg` | `#059669` | Success text on light bg |
| Warning | `--warning` | `#f59e0b` | Pending, in-progress |
| Warning bg | `--warning-bg` | `#fffbeb` | Warning badge background |
| Warning fg | `--warning-fg` | `#d97706` | Warning text on light bg |
| Danger | `--danger` | `#ef4444` | Overdue, errors, alerts |
| Danger bg | `--danger-bg` | `#fef2f2` | Danger badge background |
| Danger fg | `--danger-fg` | `#dc2626` | Danger text on light bg |
| Info | `--info` | `#3b82f6` | Informational, processing |
| Info bg | `--info-bg` | `#eff6ff` | Info badge background |
| Info fg | `--info-fg` | `#2563eb` | Info text on light bg |

### Module Accents
| Module | Token | Hex |
|--------|-------|-----|
| Central | `--module-central` | `#3b82f6` |
| Admin | `--module-admin` | `#0d7c90` |
| Operations | `--module-operations` | `#8b5cf6` |
| Sales | `--module-sales` | `#10b981` |
| POS | `--module-pos` | `#8b5cf6` |
| Collection | `--module-collection` | `#ef4444` |

---

## 3. Typography

### Font Stack
- **Primary (Latin):** `'Hanken Grotesk', ui-sans-serif, system-ui, -apple-system, sans-serif`
- **Khmer (CJK):** `'Hanuman', 'Khmer OS', 'Khmer OS System', sans-serif`
- **Combined:** `'Hanken Grotesk', 'Hanuman', ui-sans-serif, system-ui, sans-serif`
- **Monospace:** `ui-monospace, 'SF Mono', 'Cascadia Code', 'Roboto Mono', monospace`

Hanken Grotesk handles all Latin text — geometric, clean, and highly legible at small sizes. **Hanuman** (Google Fonts) handles Khmer script — it is the standard Khmer web font with excellent legibility. The combined `--font-primary` stack uses Hanken Grotesk first; when Khmer glyphs are encountered, the browser falls through to Hanuman automatically. Mono is reserved for numeric values (currency, quantities).

### Google Fonts import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanuman:wght@100;300;400;500;700;900&family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

### Type Scale
| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 10px | Uppercase labels, badges, timestamps |
| `--text-sm` | 12px | Secondary text, table cells |
| `--text-base` | 14px | Body, inputs, nav items |
| `--text-lg` | 16px | Card titles |
| `--text-xl` | 18px | Section headings |
| `--text-2xl` | 20px | Page headings |
| `--text-3xl` | 24px | Metric values |
| `--text-4xl` | 32px | Hero metrics |
| `--text-5xl` | 40px | Cash balance display |

### Font Weights
- 400 — body, descriptions
- 500 — nav items, medium emphasis
- 600 — headings, buttons, metric values
- 700 — page titles, key numbers

### Letter Spacing
- `--tracking-wide: 0.06em` — uppercase labels (10px caps)
- `--tracking-tight: -0.01em` — large display numbers

---

## 4. Spacing

### Scale (4px base unit)
| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps, icon-to-text |
| `--space-2` | 8px | Badge padding, inline gaps |
| `--space-3` | 12px | Input padding, card inner |
| `--space-4` | 16px | Card padding, section gaps |
| `--space-5` | 20px | Panel padding |
| `--space-6` | 24px | Section spacing |
| `--space-8` | 32px | Large section gaps |
| `--space-10` | 40px | Page-level spacing |
| `--space-12` | 48px | Major section breaks |

### Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Badges, small buttons |
| `--radius-md` | 8px | Inputs, icon containers |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Modals, large cards |
| `--radius-full` | 9999px | Pills, avatars |

### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)` | Modals |

---

## 5. Layout & Composition

### Grid System
- **Page layout:** Full-height flex with fixed header (64px) + sidebar (256px) + scrollable main
- **Content grid:** 12-column grid, `gap-6` (24px) between columns
- **Responsive breakpoints:** `md: 768px`, `lg: 1024px`, `xl: 1280px`

### Page Structure
```
┌─────────────────────────────────────────────┐
│ Header (64px)                                │
├──────────┬──────────────────────────────────┤
│ Sidebar  │ Main Content (scrollable)        │
│ (256px)  │                                  │
│          │ ┌──────────────────────────────┐ │
│          │ │ Page Header                  │ │
│          │ ├──────────────────────────────┤ │
│          │ │ Stats Row (4-col)            │ │
│          │ ├──────────────────────────────┤ │
│          │ │ Content Grid (2/3 + 1/3)     │ │
│          │ ├──────────────────────────────┤ │
│          │ │ Tables / Secondary Content   │ │
│          │ └──────────────────────────────┘ │
└──────────┴──────────────────────────────────┘
```

### Information Density
- Tables: `py-2.5` to `py-3` row padding, `text-sm` cells
- Cards: `p-5` to `p-6` internal padding
- Section gaps: `space-y-6` to `space-y-8`
- Max content width: `max-w-7xl` (1280px)

### Navigation
- Left sidebar with grouped nav sections
- Active state: tinted background + colored icon + colored label
- Section labels: 10px uppercase, tracked, muted color
- Bottom: role switcher + user card

---

## 6. Components

### Buttons
| Variant | Style | Usage |
|---------|-------|-------|
| Primary | Solid accent bg, white text, `rounded-lg` | Main CTAs |
| Secondary | White bg, border, `rounded-lg` | Secondary actions |
| Ghost | Transparent, hover bg | Tertiary actions |
| Icon | `p-2`, rounded, hover bg | Toolbar actions |

**Sizes:**
- Default: `px-3 py-2 text-sm`
- Large: `px-4 py-2.5 text-sm`
- Small: `px-2.5 py-1 text-xs`

### Cards
- White background, `border-slate-200`, `rounded-xl`, `custom-shadow`
- Header: `px-5 py-3.5 border-b border-slate-100`
- Body: `p-5` or `p-6`

### Badges / Pills
- `rounded-full`, `px-2 py-0.5`, `text-[10px] font-bold`
- Semantic variants: success (emerald), warning (amber), danger (rose), info (blue)
- Module-colored variants for navigation

### Tables
- Full-width, left-aligned text
- Header: `text-[10px] uppercase bg-slate-50/50 border-b border-slate-100`
- Body: `divide-y divide-slate-100`, `hover:bg-slate-50`
- Numeric columns: right-aligned, `font-semibold`

### Forms
- Inputs: `bg-slate-50 border border-slate-200 rounded-lg text-sm`
- Focus: `focus:ring-2 focus:ring-[accent]/20 focus:border-[accent]`
- Labels: `text-[10px] font-semibold text-slate-400 uppercase tracking-wider`

### Tabs
- Container: `bg-white border border-slate-200 rounded-xl p-1`
- Active: solid accent bg, white text
- Inactive: muted text, `hover:bg-slate-50`

### Modals
- Backdrop: `bg-black/30 backdrop-blur-sm`
- Panel: `bg-white rounded-xl shadow-2xl`
- Slide-over: anchored to right edge, full height

### Progress Bars
- Track: `bg-slate-100 rounded-full h-1.5` or `h-2`
- Fill: semantic color, `rounded-full`

### Avatars
- `w-9 h-9 rounded-full`, tinted background, initials
- Sizes: small (28px), default (36px), large (40px)

---

## 7. Motion & Interaction

### Transitions
- Default: `transition-colors duration-150` or `duration-200`
- Hover states: background color shift (`hover:bg-slate-50`)
- Scale on hover: `group-hover:scale-110 transition-transform` (icons in buttons)

### Focus States
- `outline: 2px solid var(--accent-600)` (or module color)
- `outline-offset: 2px`
- Applied to: buttons, links, inputs, tabs, role="tab"

### Hover Rules
- Table rows: `hover:bg-slate-50`
- Nav items: `hover:bg-slate-50 hover:text-slate-900`
- Cards: `hover:shadow-md transition-shadow`
- Buttons: darken background by one step

### Reduced Motion
- Respect `prefers-reduced-motion: reduce`
- Disable scale transforms, keep color transitions under 100ms

---

## 8. Voice & Brand

### Copy Style
- **Concise:** Labels are short ("New Order" not "Create a New Order")
- **Bilingual:** Khmer + English on every screen via `data-en`/`data-km` attributes and a language toggle (EN | ខ្មែរ). Khmer uses the Hanuman font automatically via the `--font-primary` fallback stack.
- **Numbers:** Currency formatted with thousands separators (1,250,000), Khmer Riel symbol (៛)
- **Timestamps:** Relative ("2m ago") or short date ("Aug 26")

### Language Toggle
- Every screen includes an **EN | ខ្មែរ** toggle in the header
- Translatable text uses `data-en="..."` `data-km="..."` attributes on elements
- The `setLang('en'|'km')` function swaps all `[data-en][data-km]` elements and updates dynamic content
- Khmer text renders in Hanuman via the font stack fallback — no per-element language CSS needed
- Status labels, empty states, and dynamically rendered content must also support both languages

### Capitalization
- Page headings: Title Case
- Labels: UPPERCASE at 10px with wide tracking
- Buttons: Title Case
- Table headers: UPPERCASE

### Tone
- Professional but not cold
- Action-oriented ("Log Payment", "Start Batch", "Complete Sale")
- Status language is direct ("Overdue by 6 days", "14 days overdue")

---

## 9. Anti-Patterns

The following must be avoided when generating with this system:

- **Gradients on every layer** — the system uses flat, solid colors. One subtle gradient only on the cash balance hero card.
- **Emoji as icons** — use Font Awesome icons only (fa-solid, fa-regular).
- **Colored vertical bar + rounded card** callout pattern — use semantic badges instead.
- **Hover that grays or lightens text** — hover changes background, never reduces text contrast.
- **Inter, Roboto, Arial as display type** — Hanken Grotesk is the only typeface.
- **Invented metrics** — use real values from source or clearly labeled placeholders.
- **Warm beige/cream backgrounds** — the system uses cool slate neutrals.
- **Multiple solid primary buttons** in one viewport — one primary CTA per screen.
- **Decorative icons beside every heading** — icons serve functional purpose only.
- **Generic "Lorem Ipsum"** — use domain-relevant placeholder copy when needed.
