# CLAUDE.md — Loncom Static Site Rules

> **Scope:** HTML / CSS / JS static websites. No frameworks, no build tools.
> **Reusable** across all Loncom Consulting client projects.

---

## 1. Project Structure

```
project-root/
├── index.html
├── about.html
├── css/
│   ├── tokens.css          # Design tokens only
│   ├── reset.css            # CSS reset / normalize
│   ├── global.css           # Base typography, body, links
│   ├── layout.css           # Reusable layout primitives
│   ├── components.css       # All BEM component styles
│   └── utilities.css        # Utility classes (spacing, visibility, text-align)
├── js/
│   ├── main.js              # Entry point — imports/inits all modules
│   ├── nav.js               # Mobile nav toggle
│   ├── scroll.js            # Scroll animations
│   ├── forms.js             # Form validation
│   └── vendor/              # Third-party (Swiper, etc.) — never modify
├── images/
│   ├── icons/               # SVG icons
│   └── content/             # Content images (photos, illustrations)
├── en/                      # English language pages
│   ├── index.html
│   └── about.html
├── hr/                      # Croatian language pages
│   ├── index.html
│   └── about.html
└── CLAUDE.md
```

### Rules

- **One CSS file per concern.** Never put tokens inside component files or layout inside utilities.
- **CSS load order matters.** Always load in this order: `reset → tokens → global → layout → components → utilities`.
- **JS modules.** Each JS file handles one concern. `main.js` initializes everything.
- **Vendor files are read-only.** Never edit files in `js/vendor/`. If customization is needed, override in your own JS/CSS.
- **Images:** Use `WebP` format where possible. Always provide `width` and `height` attributes on `<img>` tags to prevent layout shift.

---

## 2. CSS Architecture

### 2.1 Modern CSS Features — USE THESE

You **must** use modern CSS features. Do not write legacy workarounds when a modern solution exists.

| Feature                               | Use For                                         | Example                                                        |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| **Native nesting**                    | Component scoping, states, responsive           | `.card { & __title { } &:hover { } }`                          |
| **`@layer`**                          | Controlling specificity across files            | `@layer reset, tokens, global, layout, components, utilities;` |
| **CSS Custom Properties**             | All colors, spacing, typography, timing         | `var(--color-primary)`                                         |
| **Container queries**                 | Component-level responsiveness                  | `@container (min-width: 400px) { }`                            |
| **`:has()` selector**                 | Parent-aware styling without JS                 | `.card:has(img) { }`                                           |
| **`@scope`**                          | Section-scoped styles when nesting isn't enough | `@scope (.hero) { }`                                           |
| **`clamp()`**                         | Fluid typography and spacing                    | `font-size: clamp(1rem, 2.5vw, 2rem)`                          |
| **Logical properties**                | Internationalization-ready spacing              | `margin-inline`, `padding-block`                               |
| **`dvh` / `svh` units**               | Full-height sections that work on mobile        | `min-height: 100dvh`                                           |
| **`gap` on flex**                     | Spacing flex children without margins           | `display: flex; gap: var(--space-md)`                          |
| **`aspect-ratio`**                    | Image/video containers                          | `aspect-ratio: 16 / 9`                                         |
| **`@media (prefers-reduced-motion)`** | Disable animations for users who request it     | Wrap all animations/transitions                                |

### 2.2 `@layer` Structure

Every CSS file must declare its layer. This is non-negotiable.

```css
/* tokens.css */
@layer tokens {
  :root {
    /* ... */
  }
}

/* components.css */
@layer components {
  .card {
    /* ... */
  }
}
```

**Layer order** (declared once in `global.css` or a manifest):

```css
@layer reset, tokens, global, layout, components, utilities;
```

### 2.3 BEM Naming Convention

All component classes follow BEM strictly:

```
.block {}
.block__element {}
.block--modifier {}
```

**Rules:**

- **Block** = standalone component (`.card`, `.hero`, `.nav`, `.footer`).
- **Element** = a part that belongs to the block (`.card__title`, `.card__image`).
- **Modifier** = a variation (`.card--featured`, `.btn--large`).
- **Max nesting depth: 1 element level.** Never write `.card__header__title` — flatten to `.card__title`.
- **Never style bare HTML tags inside components.** Wrong: `.card h3 {}`. Right: `.card__title {}`.
- **Modifiers go on the block or element, not as standalone classes.** Wrong: `.featured {}`. Right: `.card--featured {}`.

**BEM with native CSS nesting — IMPORTANT LIMITATION:**

Native CSS nesting does **not** support BEM-style string concatenation (`&__element`, `&--modifier`). The `&` selector is a live reference, not a string — unlike Sass/SCSS. Write BEM elements and modifiers as flat selectors. Only use `&` for pseudo-classes, pseudo-elements, compound selectors, and combinators.

```css
/* ✅ Correct — flat BEM selectors */
.card {
  /* block styles */

  &:hover {
    /* pseudo-class — works */
  }
}

.card__title {
  /* element — flat selector */
}

.card__image {
  /* element — flat selector */
}

.card--featured {
  /* modifier — flat selector */
}
```

```css
/* ❌ BROKEN — native CSS cannot concatenate &__ or &-- */
.card {
  &__title { }   /* silently ignored */
  &--featured { } /* silently ignored */
}
```

### 2.4 Forbidden Patterns

❌ **Never do these:**

| Pattern                                                    | Why                                    | Do Instead                        |
| ---------------------------------------------------------- | -------------------------------------- | --------------------------------- |
| `!important`                                               | Breaks cascade, impossible to override | Fix specificity via `@layer`      |
| `#id` selectors for styling                                | Too specific, not reusable             | Use classes                       |
| Inline styles                                              | Unmanageable, no cascade               | Use classes or CSS variables      |
| `float` for layout                                         | Legacy pattern                         | Use Flexbox or Grid               |
| Magic numbers (`margin-top: 37px`)                         | Unreadable, unmaintainable             | Use design tokens                 |
| Tag selectors inside components (`.card h3`)               | Brittle, breaks if markup changes      | Use BEM elements (`.card__title`) |
| Deeply nested selectors (4+ levels)                        | Specificity hell                       | Flatten with BEM                  |
| `@import` in CSS (non-layer)                               | Render-blocking                        | Use `<link>` tags in HTML         |
| Styling based on DOM order (`.section > div:nth-child(3)`) | Breaks instantly if HTML changes       | Use descriptive classes           |
| `px` for font sizes                                        | Poor accessibility scaling             | Use `rem`                         |
| `&__element` / `&--modifier` in native CSS nesting         | Not string concatenation — silently fails | Use flat BEM selectors        |

---

## 3. Design Tokens

All visual values come from `tokens.css`. **Never hardcode a color, spacing value, font size, or shadow anywhere else.**

```css
@layer tokens {
  :root {
    /* ──────────── Colors ──────────── */
    --color-primary: #2563eb;
    --color-primary-light: #60a5fa;
    --color-primary-dark: #1d4ed8;
    --color-secondary: #7c3aed;
    --color-neutral-50: #fafafa;
    --color-neutral-100: #f5f5f5;
    --color-neutral-200: #e5e5e5;
    --color-neutral-300: #d4d4d4;
    --color-neutral-500: #737373;
    --color-neutral-700: #404040;
    --color-neutral-900: #171717;
    --color-white: #ffffff;
    --color-black: #0a0a0a;
    --color-success: #16a34a;
    --color-error: #dc2626;
    --color-warning: #f59e0b;

    /* ──────────── Typography ──────────── */
    --font-primary: system-ui, -apple-system, sans-serif;
    --font-heading: var(--font-primary);
    --font-mono: "Fira Code", ui-monospace, monospace;

    --text-xs: clamp(0.75rem, 1vw, 0.8rem);
    --text-sm: clamp(0.875rem, 1.2vw, 0.95rem);
    --text-base: clamp(1rem, 1.5vw, 1.125rem);
    --text-lg: clamp(1.125rem, 2vw, 1.35rem);
    --text-xl: clamp(1.25rem, 2.5vw, 1.6rem);
    --text-2xl: clamp(1.5rem, 3vw, 2rem);
    --text-3xl: clamp(2rem, 4vw, 3rem);
    --text-4xl: clamp(2.5rem, 5vw, 4rem);

    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.75;

    --weight-normal: 400;
    --weight-medium: 500;
    --weight-semibold: 600;
    --weight-bold: 700;

    /* ──────────── Spacing ──────────── */
    --space-2xs: 0.25rem; /* 4px */
    --space-xs: 0.5rem; /* 8px */
    --space-sm: 0.75rem; /* 12px */
    --space-md: 1rem; /* 16px */
    --space-lg: 1.5rem; /* 24px */
    --space-xl: 2rem; /* 32px */
    --space-2xl: 3rem; /* 48px */
    --space-3xl: 4rem; /* 64px */
    --space-4xl: 6rem; /* 96px */
    --space-section: clamp(4rem, 8vw, 8rem);

    /* ──────────── Layout ──────────── */
    --container-sm: 640px;
    --container-md: 768px;
    --container-lg: 1024px;
    --container-xl: 1200px;
    --container-max: 1400px;

    /* ──────────── Borders & Radius ──────────── */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 1rem;
    --radius-full: 9999px;
    --border-width: 1px;
    --border-color: var(--color-neutral-200);

    /* ──────────── Shadows ──────────── */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.12);

    /* ──────────── Transitions ──────────── */
    --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --duration-fast: 150ms;
    --duration-normal: 250ms;
    --duration-slow: 400ms;

    /* ──────────── Z-index scale ──────────── */
    --z-below: -1;
    --z-base: 0;
    --z-above: 10;
    --z-nav: 100;
    --z-overlay: 200;
    --z-modal: 300;
    --z-toast: 400;
  }
}
```

**Per-project customization:** Replace the values above at the start of each project. The token _names_ stay the same — only values change. This is the entire point.

---

## 4. HTML Standards

### 4.1 Document Template

Every HTML file starts with this structure:

```html
<!DOCTYPE html>
<html lang="en">
  <!-- Change per language: "hr", "bs", etc. -->
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Page description here" />
    <title>Page Title — Site Name</title>

    <!-- CSS in correct layer order -->
    <link rel="stylesheet" href="/css/reset.css" />
    <link rel="stylesheet" href="/css/tokens.css" />
    <link rel="stylesheet" href="/css/global.css" />
    <link rel="stylesheet" href="/css/layout.css" />
    <link rel="stylesheet" href="/css/components.css" />
    <link rel="stylesheet" href="/css/utilities.css" />

    <!-- Preload critical assets -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
  </head>
  <body>
    <header class="site-header"><!-- nav --></header>
    <main><!-- page content --></main>
    <footer class="site-footer"><!-- footer --></footer>

    <!-- JS at end of body -->
    <script src="/js/vendor/swiper-bundle.min.js" defer></script>
    <script src="/js/main.js" type="module"></script>
  </body>
</html>
```

### 4.2 Semantic HTML Rules

| Requirement            | Rule                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| **Use semantic tags**  | `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`, `<aside>` — not generic `<div>` |
| **Headings hierarchy** | One `<h1>` per page. Headings never skip levels (no `<h1>` → `<h3>`).                                |
| **Links vs buttons**   | `<a>` navigates. `<button>` performs an action. Never use `<div onclick>`.                           |
| **Lists**              | Navigation items use `<ul><li>`. Repeated items use lists.                                           |
| **Images**             | Always include `alt`, `width`, `height`. Decorative images get `alt=""`.                             |
| **Forms**              | Every `<input>` has a `<label>` with matching `for`/`id`.                                            |

### 4.3 Reusable HTML Patterns

Components must be **copy-paste portable.** If you copy a component's HTML from one page to another, it must work with zero changes (except content).

**Correct:**

```html
<article class="card card--featured">
  <img class="card__image" src="..." alt="..." width="400" height="300" />
  <div class="card__body">
    <h3 class="card__title">Title</h3>
    <p class="card__text">Description</p>
    <a class="card__link btn btn--primary" href="#">Learn More</a>
  </div>
</article>
```

**Wrong — not portable:**

```html
<div class="services-section">
  <div>
    <!-- no class, styled by parent -->
    <h3>Title</h3>
    <!-- styled by tag selector -->
    <p>Description</p>
    <a class="learn-more" href="#">Learn More</a>
    <!-- non-BEM, page-specific -->
  </div>
</div>
```

---

## 5. Layout System

### 5.1 Container

One reusable container class. Never create page-specific containers.

```css
@layer layout {
  .container {
    width: 100%;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--space-md);

    &--narrow {
      max-width: var(--container-md);
    }

    &--wide {
      max-width: var(--container-max);
    }
  }
}
```

### 5.2 Section Spacing

Sections use consistent vertical rhythm:

```css
@layer layout {
  .section {
    padding-block: var(--space-section);
  }
}
```

### 5.3 Grid Primitives

Reusable grid layouts — not one-off grids per page:

```css
@layer layout {
  .grid {
    display: grid;
    gap: var(--space-lg);

    &--2col {
      grid-template-columns: repeat(2, 1fr);
    }
    &--3col {
      grid-template-columns: repeat(3, 1fr);
    }
    &--4col {
      grid-template-columns: repeat(4, 1fr);
    }
    &--auto-fit {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    }

    /* Responsive: stack on mobile */
    @media (max-width: 768px) {
      &--2col,
      &--3col,
      &--4col {
        grid-template-columns: 1fr;
      }
    }
  }
}
```

---

## 6. Responsive Design

### 6.1 Mobile-First Breakpoints

**Always write mobile styles first, then layer on larger screens with `min-width` queries.**

```css
/* Standardized breakpoints — use these, nothing custom */
/* sm: 640px  | md: 768px  | lg: 1024px  | xl: 1200px  | 2xl: 1400px */
```

**Correct (mobile-first):**

```css
.hero__title {
  font-size: var(--text-2xl);

  @media (min-width: 768px) {
    font-size: var(--text-3xl);
  }

  @media (min-width: 1024px) {
    font-size: var(--text-4xl);
  }
}
```

**Wrong (desktop-first):**

```css
.hero__title {
  font-size: var(--text-4xl);

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
}
```

### 6.2 Container Queries for Components

When a component's layout should respond to **its own container** rather than the viewport:

```css
.card-grid {
  container-type: inline-size;
  container-name: card-grid;
}

@container card-grid (min-width: 600px) {
  .card {
    /* wider layout */
  }
}
```

### 6.3 Responsive Rules

- **Never hide content with `display: none` to "make it fit."** Restructure the layout instead.
- **Touch targets:** All interactive elements must be at least `44px × 44px` on mobile.
- **Use `clamp()` for fluid values** wherever possible to reduce breakpoint count.
- **Test at 320px minimum width.** Nothing should overflow or break.

---

## 7. JavaScript Rules

### 7.1 General

- **Vanilla JS only.** No jQuery, no frameworks.
- **ES modules** (`type="module"` on script tag). Use `import`/`export`.
- **`defer` or `type="module"`** on all scripts — never block rendering.
- **No inline JS.** No `onclick="..."`, no `<script>` blocks in HTML.
- **Strict mode.** Not needed with ES modules (implicit), but add `'use strict';` in non-module scripts.

### 7.2 DOM Interaction

```js
// ✅ Correct: query once, cache reference
const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.querySelector(".nav__menu");

navToggle?.addEventListener("click", () => {
  navMenu.classList.toggle("nav__menu--open");
  navToggle.setAttribute(
    "aria-expanded",
    navToggle.getAttribute("aria-expanded") === "true" ? "false" : "true",
  );
});
```

- **Always use `?.` (optional chaining)** when querying elements — the element might not exist on every page.
- **Event delegation** for repeated elements (cards, list items) — don't attach listeners to each item.
- **Never manipulate inline styles from JS.** Toggle classes instead.
- **Data attributes for JS hooks:** Use `data-*` attributes to connect JS to HTML, not BEM classes.

```html
<!-- JS hook via data attribute -->
<button
  class="nav__toggle"
  data-action="toggle-nav"
  aria-expanded="false"
></button>
```

```js
// Query by data attribute, not CSS class
document.querySelector('[data-action="toggle-nav"]');
```

### 7.3 Scroll Animations

Use `IntersectionObserver`, not scroll event listeners:

```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll("[data-animate]")
  .forEach((el) => observer.observe(el));
```

### 7.4 Form Validation

- Use **Constraint Validation API** (`checkValidity()`, `reportValidity()`).
- Show errors in a `<span>` next to the input with a `.form__error` class.
- Never use `alert()`.

### 7.5 Swiper / Third-Party Libraries

- Load from `js/vendor/` — never from CDN (no build tools = must work offline/reliably).
- Initialize in a dedicated module file.
- Always wrap initialization in a check:

```js
if (document.querySelector(".swiper")) {
  const swiper = new Swiper(".swiper", {
    /* config */
  });
}
```

---

## 8. Multi-Language Setup

### 8.1 File Structure

```
en/
├── index.html      (lang="en")
├── about.html
└── services.html
hr/
├── index.html      (lang="hr")
├── about.html
└── services.html
```

### 8.2 Rules

- **Root `index.html`** redirects to the default language (e.g., `<meta http-equiv="refresh" content="0;url=/en/">`), or serves as a language picker page.
- **Each HTML file sets its own `lang` attribute** on `<html>`.
- **Language switcher links** point to the equivalent page in the other language: `/en/about.html` ↔ `/hr/about.html`.
- **CSS and JS are shared** — never duplicate styles or scripts per language.
- **`hreflang` tags** in `<head>` for SEO:

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/about.html" />
<link rel="alternate" hreflang="hr" href="https://example.com/hr/about.html" />
<link
  rel="alternate"
  hreflang="x-default"
  href="https://example.com/en/about.html"
/>
```

---

## 9. Performance Rules

- **No render-blocking resources.** CSS via `<link>` in head (fine), JS with `defer` or `type="module"`.
- **Optimize images.** Use WebP, set explicit `width`/`height`, lazy-load below-the-fold images (`loading="lazy"`).
- **Fonts** Use Google Fonts, use `preconnect`.
- **Minimize HTTP requests.** Don't split CSS into 20 files — the 6-file structure above is the max.
- **No unused CSS.** If a component is removed from HTML, remove its CSS.
- **SVG for icons.** Inline SVGs or an SVG sprite — never icon fonts.

---

## 10. Code Quality Checklist

Before considering any page or component **done**, verify:

- [ ] HTML passes [W3C Validator](https://validator.w3.org/) with zero errors.
- [ ] All CSS values reference design tokens — no hardcoded colors, sizes, spacing.
- [ ] All classes follow BEM naming.
- [ ] Mobile layout works at 320px with no horizontal overflow.
- [ ] All images have `alt`, `width`, `height`.
- [ ] No `!important` anywhere.
- [ ] No `#id` selectors used for styling.
- [ ] All JS uses optional chaining for DOM queries.
- [ ] Interactive elements are 44px minimum touch target on mobile.
- [ ] Animations respect `prefers-reduced-motion`.
- [ ] Page weight is under 1MB total (excluding video).

---

## 11. Agent Behavior Rules

These rules govern how the AI code agent operates on this project:

1. **Never invent new token names.** Use only the tokens defined in `tokens.css`. If a new token is genuinely needed, add it to `tokens.css` first, then use it.
2. **Never create one-off classes.** If a style only applies in one place, it either belongs to an existing BEM component (add a modifier) or it's a new component (create a proper block).
3. **Always check if a component already exists** before creating new HTML/CSS. Reuse and extend with modifiers.
4. **Preserve layer order.** New CSS goes into the correct `@layer`. Never add styles outside of a layer.
5. **When editing existing code, don't restructure unless asked.** Fix/add the requested thing only.
6. **All new components must be responsive** with mobile-first styles, even if not explicitly requested.
7. **When adding JS**, always create a separate module file and import it in `main.js`. Never add inline scripts.
8. **Test every interactive element** at mobile viewport (375px) and desktop (1440px) minimum.
9. **When creating a new page**, copy the HTML template from section 4.1 — never start from scratch.
10. **When duplicating pages for a new language**, only change text content and the `lang` attribute. Never change structure, classes, or layout.
