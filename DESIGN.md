# wassy328.com Design System

The design language of this portfolio: an editorial, cinematic reinterpretation of [shinyaokano.jp](https://shinyaokano.jp/)'s UI/UX, built on the Morphos "Abalone" palette. This document describes the system as implemented — every token and value below comes from `src/styles/global.css` and the component styles.

> Source of truth: `src/styles/global.css` (tokens, editorial primitives, motion layer). Colors are authored in `oklch()`; hex values in this document are sRGB approximations for reference only. **Never hardcode raw color values in components — always go through `var(--*)` tokens.**

---

## 1. Visual Theme & Atmosphere

The site reads like a printed portfolio book rather than a web app. Pages open with an oversized uppercase display headline under a small letterspaced monospace label (the "eyebrow"), content is organized into numbered sections (`01`, `02`, …) separated by hairline rules, and lists are editorial rows — never card grids. Color is used sparingly: the page is essentially monochrome (cool near-white or deep teal-black) with a single teal primary doing all the accent work, plus a blush pink reserved for hover moments.

Motion is a first-class part of the identity but always restrained: a one-time eagle silhouette intro on the home page, masked line-rise entrances for headlines, and scroll-triggered reveals. Everything degrades to "visible and still" — without JavaScript, on slow connections (a CSS failsafe reveals content after 1.6s), and under `prefers-reduced-motion`.

**Key Characteristics:**
- Editorial typography: uppercase display headlines with *positive* letter-spacing (+0.02em), monospace micro-labels with very wide tracking (+0.22–0.28em)
- Two-palette system (light + dark) defined entirely as `oklch()` custom properties; cool, slightly blue-gray neutrals
- Hairline-first geometry: 1px rules (`--border`) structure everything; borders over boxes, lines over shadows
- Numbered indexing as a visual motif: section numbers, list item numbers (`01` `02` …), always monospace and teal
- Flat surfaces; shadows exist (`--shadow`) but are reserved for images and overlays, not layout
- Two-layer motion system (CSS entrance + IntersectionObserver reveal) with complete reduced-motion and no-JS fallbacks

---

## 2. Color Palette & Roles

All colors are `oklch()` tokens with a light set on `:root` and a dark set on `.dark`. The dark theme is not an inversion — it is a separately tuned palette (e.g. primary gets lighter and more luminous in dark mode to keep contrast).

### Light theme

| Token | Value | ≈ Hex | Role |
|---|---|---|---|
| `--background` | `oklch(0.979 0.003 264.5)` | `#F7F8FA` | Page background (cool near-white) |
| `--foreground` | `oklch(0.209 0.017 216.6)` | `#0F1A1D` | Primary text (deep teal-black) |
| `--card` | `oklch(0.933 0.007 260.7)` | `#E6E9EE` | Card / code block surfaces |
| `--primary` | `oklch(0.500 0.090 193.2)` | `#007371` | The teal. Accents, links, numbers, active states, eyebrow rules |
| `--primary-foreground` | `oklch(0.979 0.003 264.5)` | `#F7F8FA` | Text on primary fills |
| `--secondary` | `oklch(0.952 0.006 264.5)` | `#EDEFF3` | Alternate light surface |
| `--muted` | `oklch(0.946 0.006 264.5)` | `#EBEDF1` | Inline code bg, tag pills, hover washes |
| `--muted-foreground` | `oklch(0.500 0.015 220)` | `#5A6569` | Secondary text, metadata, inactive labels |
| `--accent` | `oklch(0.838 0.072 5.7)` | `#F4B7C3` | Blush pink; link hover, category tints |
| `--destructive` | `oklch(0.636 0.208 25.3)` | `#EF4444` | Errors (rarely used) |
| `--border` | `oklch(0.860 0.009 232.4)` | `#CBD2D6` | Hairlines everywhere |
| `--input` | `oklch(0.860 0.009 232.4)` | `#CBD2D6` | Form control borders (same as border in light) |
| `--ring` | `oklch(0.600 0.095 185.2)` | `#279288` | Focus rings, hover border emphasis |
| `--link-hover` | `oklch(0.550 0.140 5.7)` | `#B24865` | Prose link hover (deeper pink for AA contrast on light) |

### Dark theme (`.dark`)

| Token | Value | ≈ Hex | Role notes vs. light |
|---|---|---|---|
| `--background` | `oklch(0.209 0.017 216.6)` | `#0F1A1D` | Light theme's foreground becomes the canvas |
| `--foreground` | `oklch(0.979 0.003 264.5)` | `#F7F8FA` | |
| `--card` | `oklch(0.197 0.020 207.3)` | `#0A181A` | Slightly darker than bg, not lighter |
| `--primary` | `oklch(0.797 0.095 185.2)` | `#6ED1C5` | Much lighter, luminous teal |
| `--primary-foreground` | `oklch(0.209 0.017 216.6)` | `#0F1A1D` | |
| `--secondary` / `--muted` | `oklch(0.324 0.020 206.4)` | `#283739` | |
| `--muted-foreground` | `oklch(0.780 0.012 219.6)` | `#AFB9BD` | |
| `--accent` | `oklch(0.838 0.072 5.7)` | `#F4B7C3` | Same blush in both themes |
| `--destructive` | `oklch(0.704 0.191 22.2)` | `#FF6467` | |
| `--border` | `oklch(1 0 0 / 12%)` | white @ 12% | Translucent white hairlines |
| `--input` | `oklch(1 0 0 / 16%)` | white @ 16% | |
| `--ring` | `oklch(0.797 0.095 185.2)` | `#6ED1C5` | Same as primary |
| `--link-hover` | `oklch(0.838 0.072 5.7)` | `#F4B7C3` | Blush is bright enough on dark |

### Gradient System
None. The design is deliberately gradient-free; depth comes from hairlines, type scale, and the light/dark duality. The only "gradient-like" effects are semi-transparent washes made with `color-mix(in oklch, var(--token) N%, transparent)` (category badges, header backdrop).

---

## 3. Typography Rules

### Font Family
- **Sans (body)**: `Geist`, falling back to `Noto Sans JP` (Japanese), then `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif`
- **Mono (labels / metadata / nav)**: `Geist Mono`, falling back to `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
- Delivered via Astro Fonts API (Google provider), `display: swap`. Only the latin subsets of Geist / Geist Mono are preloaded; Noto Sans JP loads its unicode-range subsets on demand.

*The monospace face is not just for code — it is the voice of the system: navigation, eyebrows, dates, tags, section numbers, and buttons all speak Geist Mono in uppercase with wide tracking.*

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Hero title (home) | Geist | `clamp(2.5rem, 8.2vw, 7rem)` | 700 | 0.98 | +0.01em | Uppercase; teal period accent |
| Display (page heads) | Geist | `clamp(2.75rem, 8vw, 5.5rem)` | 700 | 1.02 | +0.02em | Uppercase; `.display` |
| Article h1 | Geist | 2.25–3rem | 600–700 | 1.15–1.2 | −0.02 to +0.01em | Blog / project detail titles |
| Section heading | Geist | 0.95rem | 600 | — | +0.24em | Uppercase + mono `sec-num` (`01`) in teal |
| List row title | Geist | `clamp(1.15rem, 2.2vw, 1.5rem)` | 600 | 1.3 | +0.01em | Editorial list rows |
| Body | Geist / Noto Sans JP | 17px (16px <720px) | 400 | 1.7 (2.0 for leads/bio) | normal | |
| Eyebrow / label | Geist Mono | 0.72rem | 500 | — | +0.28em | Uppercase; teal 2rem rule prefix |
| Nav link | Geist Mono | 0.75rem | 500 | +0.22em | — | Uppercase; underline wipe |
| Link-more CTA | Geist Mono | 0.75rem | 500 | — | +0.24em | Uppercase; arrow + underline wipe |
| Date / metadata | Geist Mono | 0.75–0.78rem | 400–500 | — | +0.12em | `font-variant-numeric: tabular-nums` |
| Tag | Geist Mono | 0.72rem | 400 | — | +0.14em | Uppercase; teal `#` prefix |
| Code | Geist Mono | 0.9em inline / 0.95em blocks | 400 | 1.6 | — | `--muted` bg inline, `--card` blocks |

### Principles
- **Tracking encodes hierarchy, not size**: the smaller the text, the wider the letter-spacing (+0.12em metadata → +0.28em eyebrows). Display type goes the other way (+0.02em).
- **Uppercase means system voice**: anything uppercase + mono is chrome (nav, labels, numbers); sentence-case sans is content.
- **Japanese body text is roomy**: leads and bio paragraphs use `line-height: 2` and `text-align: justify` where the block spans the full container.
- **Numbers are always tabular** in dates and metadata to keep hairline lists aligned.

---

## 4. Component Stylings

### Buttons & CTAs

**Link-more (primary CTA pattern)** — the signature "button" is not a button:
- Text: mono 0.75rem uppercase +0.24em, `--foreground`
- Arrow glyph (`→` / `↗`) shifts 0.35em on hover; label underline wipes in from the left (1px, `currentColor`, 0.35s `cubic-bezier(0.22, 1, 0.36, 1)`)
- Hover color: `--primary`
- Markup contract: the text must be wrapped in `<span class="label">` for the underline wipe
- External links append a `.sr-only` note (「新しいタブで開きます」)

**Pill CTA (`.form-cta`, /contact)**
- Transparent bg, 1px `--border`, radius 999px, padding 0.6em 1.3em, mono uppercase 0.72rem
- Hover/focus: fills `--primary`, text `--primary-foreground`
- Disabled variant: dashed border, `--muted-foreground`, `cursor: not-allowed`

**`.btn-primary` / `.btn-ghost`** (legacy utility, rarely used)
- Primary: `--primary` bg, `--primary-foreground` text, radius `--radius`, hover opacity 0.9
- Ghost: transparent bg, 1px `--border`, hover `--muted` wash

**Icon buttons (header)**: 36×36px, 1px `--border`, radius `--radius`, hover `--muted` bg + `--ring` border.

### Editorial list rows (the card replacement)
- Container: `border-top: 1px solid var(--border)` on the list, `border-bottom` per row — no side borders, no fill
- Row grid: number (`01`, mono 0.8rem, teal) / body / meta / arrow
- Hover: row padding-left eases +0.5rem, title turns `--primary`, arrow fades in and slides right
- Descriptions clamp to 2 lines (`-webkit-line-clamp`)

### Cards & Containers
- True cards are rare. Where used (`.card`, contact form block): `--card` bg, 1px `--border`, radius `--radius` (0.5rem), padding ~1.25–1.75rem
- Hover (interactive cards only): `--shadow` + `--ring` border

### Inputs & Forms
- `--background` bg, 1px `--input` border, radius `--radius`, padding 0.5em 0.75em, 16px font (prevents iOS zoom)

### Navigation (Header)
- Sticky, `backdrop-filter: saturate(180%) blur(12px)` over `color-mix(in oklch, var(--background) 82%, transparent)`
- Bottom hairline is transparent until scroll (`header.scrolled` via JS, `window.scrollY > 8`)
- Brand: `WASSY.` — mono 700, +0.22em, teal period
- Links right-aligned, mono uppercase, underline wipe on hover, `aria-current="page"` + persistent underline when active
- Mobile (<720px): hamburger toggles a blurred dropdown panel; Escape / outside-tap / link-tap close it

### Image Treatment
- Prose images (project pages): 1px `--border` + `--shadow` + radius `--radius` — screenshots never bleed into the page background
- Blog hero images: radius only
- Figure captions: 0.85rem, `--muted-foreground`, centered

### Distinctive Components

**Eyebrow** — mono uppercase micro-label preceded by a 2rem × 1px teal rule; optional `.index` number in teal. Opens every page head and major section.

**Category badge (`.cat-badge`)** — pill, 0.72rem, tinted with `color-mix` per category: tech = teal tint, travel = blush tint, essay = ring tint, event = link-hover tint.

**Table of contents (blog, ≥1160px)** — sticky right-gutter nav; "On this page" eyebrow label; items carry a 2px transparent left border that turns teal + bold when active (scroll-spy); internal scroll for long lists.

**Skip link** — mono uppercase pill, off-screen until keyboard focus.

**Theme toggle** — sun/moon icon button; theme persisted in `localStorage`, pre-paint inline script in `BaseHead.astro` prevents flash.

---

## 5. Layout Principles

### Spacing System
- No formal scale; spacing is rem-based and generous. Recurring values: 0.75 / 1.25 / 1.75 / 2.5 / 3.5 / 4.5 / 6rem
- Section rhythm: `margin-bottom: 4.5rem` between numbered sections; `padding: 4.5rem 0 3.5rem` for page heads; 6rem bottom padding on `main`

### Grid & Container
- Three container widths: `--container-narrow` 720px (articles), `--container` 960px (about/contact), `--container-wide` 1160px (home, lists, header/footer)
- Home hero: full viewport (`min-height: calc(100svh - 72px)`), content on an editorial left offset, vertical SCROLL indicator in the left gutter
- Lists are single-column editorial rows at all widths — never multi-column card grids

### Whitespace Philosophy
- **Air above the fold**: page heads spend 8rem of vertical space before content starts; the hero spends a full viewport
- **Hairlines carry structure** so whitespace can stay uninterrupted — no boxed sections
- **Footer stays at the viewport bottom** on short pages (body flex column + `main { flex: 1 0 auto }`)

### Border Radius Scale
- `--radius` (0.5rem): cards, buttons, inputs, images, code blocks
- `calc(--radius − 0.25rem)`: inline code
- Pill (999px): tags, badges, form CTAs, skip link
- Circle (50%): avatar
- 0: everything hairline-based (lists, rules, TOC)

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (default) | No shadow, no border | Page, sections, lists |
| Hairline | 1px `--border` | Primary structure: rules, rows, cards, TOC spine |
| Raised | `--shadow-sm` / `--shadow` (2-layer soft) | Prose images, skip link, hovered cards |
| Overlay | backdrop blur + translucent bg | Sticky header, mobile nav panel |
| Focus | `--ring` border / visible outline | All interactive elements |

**Shadow Philosophy**: shadows are evidence, not decoration — they appear only where something genuinely sits on top of the page (screenshots, the floating header). Layout never relies on elevation; it relies on hairlines and type. Dark mode swaps shadow opacity up (30–40%) and borders to translucent white.

### Decorative Depth
- Light/dark duality itself is the main "depth" device
- `color-mix` washes (badges, header) give soft tint without gradients

---

## 7. Motion

Motion is layered and fully degradable. All of it stops under `prefers-reduced-motion: reduce`.

1. **Intro (home only, once per tab session)** — `EagleIntro.astro`: an eagle silhouette sweeps across; the screen appears in its wake. Text inside `[data-eagle-reveal]` splits into characters that appear left-to-right as the eagle passes. The home hero therefore does *not* use the Entrance layer.
2. **Entrance (every page, CSS-only, no JS)** — `.mask-line` (headline rises out of an overflow mask, 1.1s), `.rise-in` (fade-up, 0.9s), `.rule-draw` (hairline scales in, 1s). Delays staggered inline via `style="--delay: 0.18s"`. Easing is always `cubic-bezier(0.22, 1, 0.36, 1)`.
3. **Reveal (scroll)** — `[data-reveal]` + IntersectionObserver (`BaseHead.astro`); `[data-reveal-stagger]` cascades direct children at 0.07s intervals. Failsafe: if the script hasn't run 1.6s after load (`html.reveal-ready` absent), a CSS animation reveals everything on its own.
4. **Micro-interactions** — underline wipes (left-in, right-out), arrow nudges, row padding ease, 0.15–0.35s.

**Motion grammar**: one easing curve everywhere; transforms and opacity only (no layout animation); nothing loops except the hero scroll-indicator drop and the contact "coming soon" pulse.

---

## 8. Do's and Don'ts

### Do
- Reference every color and radius through `var(--*)` tokens and verify both themes — dark is a tuned palette, not a filter
- Use the eyebrow + display pattern for any new page head, and numbered `sec-num` headings for sections
- Use editorial hairline rows for any list of content; keep numbering (`01` …) mono and teal
- Wrap `.link-more` text in `<span class="label">` (the underline wipe depends on it) and add `.sr-only` notes to external links
- Keep Japanese body copy at `line-height: 2` for leads; keep metadata numerals tabular
- Give every new animation a `prefers-reduced-motion: reduce` escape and a JS-free fallback
- Keep new UI keyboard-accessible: visible focus states ride the same styles as hover

### Don't
- Don't write raw hex/oklch values in components or pages
- Don't introduce card grids, filled section backgrounds, or gradients — structure comes from hairlines and whitespace
- Don't use uppercase/mono styling for content text, or sentence-case sans for system labels (it breaks the two-voice rule)
- Don't add shadows to layout elements; reserve them for images and overlays
- Don't let any motion run without reduced-motion and no-JS degradation
- Don't link from this public site to private or team-only sites
- Don't negative-track small text; wide tracking is the system's signature at small sizes

---

## 9. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <560px | About profile/skills grids stack; timeline goes single-column |
| Tablet | <720px | Nav collapses to hamburger panel; body 17px → 16px; list rows drop the arrow column and stack meta under the title; footer stacks |
| Desktop | 720–1159px | Full nav; editorial lists in full grid; no TOC |
| Wide | ≥1160px | Blog TOC appears in the right gutter (15rem, sticky) |

### Touch Targets
- Icon buttons 36×36px; mobile nav links get full-width 0.7em padded rows
- Form controls stay at 16px font to avoid iOS zoom

### Collapsing Strategy
- **Hero type**: `clamp()` does the work — 2.5rem floor → 7rem ceiling (hero), 2.75rem → 5.5rem (display); no breakpoint jumps
- **Hero height**: `100svh` minus header (72px → 64px on mobile) so iOS browser chrome never clips it
- **Editorial rows**: 4-column grid (`num / body / meta / arrow`) → 2-column (`num / body`, meta wraps below) under 720px
- **Section padding**: main 3em/5em → 2em/4em under 720px

### Image Behavior
- `max-width: 100%; height: auto` globally; blog hero images render 2:1 at 1020×510 (blog lists are text-only editorial rows — no thumbnails)

---

## 10. Agent Prompt Guide

### Quick Color Reference
- Accent / links / numbers / active: `--primary` (light `#007371`, dark `#6ED1C5`)
- Page bg: `--background` (light `#F7F8FA`, dark `#0F1A1D`)
- Body text: `--foreground`; secondary text: `--muted-foreground`
- Hairlines: `--border`; focus & hover borders: `--ring`
- Hover pink (prose links): `--link-hover`; decorative blush: `--accent`
- Surfaces (code, cards): `--card` / `--muted`

### Example Component Prompts
- "Add a new page head: `.eyebrow` label 'Talks' (mono 0.72rem, +0.28em tracking, with the 2rem teal rule), then an uppercase `.display` headline 'Speaking' using the `.mask-line` entrance with `--delay: 0.18s`."
- "Build an editorial list of talks: hairline-separated rows with a mono teal index (`01`), a 600-weight title that turns `--primary` on hover, tabular-nums mono date on the right, and an arrow that slides in on hover. Add `data-reveal` with staggered `--reveal-delay`."
- "Add a secondary CTA with the `.link-more` pattern: uppercase mono text wrapped in `<span class='label'>`, trailing `→`, underline wipe on hover, color `--muted-foreground` turning `--primary`."
- "Style this screenshot like other project images: 1px `var(--border)`, `var(--radius)` corners, `var(--shadow)`."

### Iteration Guide
1. Check both themes before calling any change done — tokens shift meaning between light and dark
2. Keep new text styles inside the two voices: mono-uppercase-tracked (system) or sans-sentence-case (content)
3. Reuse `global.css` primitives (`.eyebrow`, `.display`, `.link-more`, reveal attributes) before writing new CSS
4. When adding motion, wire all three fallbacks: reduced-motion, no-JS, and the 1.6s reveal failsafe
5. Test at 375px, 720px boundary, and ≥1160px (TOC) — the 720px collapse is where most regressions appear
6. Run `npm run build` and check the page in `astro preview`; verify focus states by tabbing through
7. If a value isn't in this document or `global.css`, derive it from an existing page rather than inventing a new one
