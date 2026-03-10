# LetterGen — Copilot Instructions

## Project Overview

LetterGen is a **React + TypeScript** app for generating formal letters from HTML templates and exporting them as A4-sized PDFs. It uses **Vite** as the build tool and is deployed to **GitHub Pages** via GitHub Actions.

**Live URL:** https://docgen.bipul.in

---

## Tech Stack

- **React 18** with **TypeScript 5** (strict mode)
- **Vite 5** — build tool (`dist/` output)
- **jsPDF + html2canvas** — PDF export
- **Plain CSS** — no CSS framework or CSS-in-JS
- **GitHub Actions** — CI/CD to `gh-pages` branch

---

## Project Structure

```
LetterGen/
├── index.html                        # HTML entry point
├── package.json                      # npm scripts: dev, build, preview
├── tsconfig.json                     # Strict TS config (ES2020, react-jsx)
├── vite.config.ts                    # Vite + React plugin, base: "/LetterGen/"
├── .github/workflows/main.yml        # CI/CD: build → deploy to gh-pages
├── public/
│   ├── CNAME                         # Custom domain for GitHub Pages
│   └── logo-bnp.png                  # Logo assets (referenced in templates)
└── src/
    ├── main.tsx                      # React entry point
    ├── App.tsx                       # Root component (PIN gate + layout)
    ├── types.ts                      # LetterTemplate, PlaceholderField interfaces
    ├── templateLoader.ts             # Auto-discovers templates via import.meta.glob
    ├── placeholders.ts               # Extracts fields & renders template HTML
    ├── exportPdf.ts                  # html2canvas → jsPDF A4 PDF export
    ├── styles.css                    # All styles (layout, A4 page, PIN screen)
    ├── vite-env.d.ts                 # Type declarations for *.html?raw imports
    ├── components/
    │   ├── PinScreen.tsx             # PIN auth (current IST time as HHMM)
    │   ├── TemplateForm.tsx          # Auto-generated form from placeholders
    │   └── LetterPreview.tsx         # Live A4 preview + Export PDF button
    └── templates/
        └── bnp-invitation.html       # Example template
```

---

## How Templates Work

Templates are **plain HTML files** in `src/templates/`. They are auto-discovered at build time — no manual registration required.

### Template Format

Each `.html` file MUST begin with a metadata comment:

```html
<!-- template: { "id": "unique-id", "name": "Display Name" } -->
<div class="letter-body">
  <!-- letter content here -->
</div>
```

### Placeholder Syntax

Use double-brace placeholders in the HTML body. These are automatically parsed to generate form fields:

```
{{key|Label}}              → text input
{{key|Label|date}}         → date input
{{key|Label|textarea}}     → textarea
```

- `key` — unique identifier (alphanumeric + underscore)
- `Label` — display label shown in the form
- Duplicate keys are deduplicated (same key used twice renders one input)

### Adding a New Template

1. Create a new `.html` file in `src/templates/`
2. Start with the metadata comment: `<!-- template: { "id": "...", "name": "..." } -->`
3. Write HTML content with `{{placeholders}}`
4. Place any logo/image assets in `public/` and reference via absolute path (e.g., `/logo.png`)
5. Done — template auto-appears in the dropdown

---

## Key Conventions

### TypeScript
- Strict mode enabled (`strict: true`, `noUnusedLocals`, `noUnusedParameters`)
- All interfaces in `src/types.ts`
- Use `import type` for type-only imports

### CSS
- Single `styles.css` file, no CSS modules
- BEM-like class names: `.app-header`, `.form-group`, `.pin-overlay`
- A4 page: `width: 210mm`, `min-height: 297mm`, `padding: 10mm 20mm 25mm`
- Responsive breakpoint at 900px

### PDF Export
- `exportPdf.ts` temporarily removes `min-height` during capture to avoid blank pages
- Multi-page content is sliced into A4-height chunks; blank trailing pages are skipped
- Images must use `useCORS: true` in html2canvas

### PIN Protection
- PIN = current IST time in `HHMM` format (e.g., 14:35 → `1435`)
- Computed via `toLocaleString("en-US", { timeZone: "Asia/Kolkata" })`
- Not cryptographically secure — casual access control only

---

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # TypeScript check + production build → dist/
npm run preview   # Preview production build locally
```

---

## Deployment

- Push to `main` triggers GitHub Actions workflow
- Workflow: `npm install` → `npm run build` → deploy `dist/` to `gh-pages` branch
- GitHub Pages serves from `gh-pages` branch
- Custom domain configured via `public/CNAME`
- `vite.config.ts` `base` must match the deployment path

---

## Important Notes

- Template HTML uses **inline styles** for letterhead/tables to ensure consistent PDF rendering
- Logo and static assets go in `public/` — they are served at the root URL
- The `*.html?raw` import pattern is declared in `src/vite-env.d.ts`
- `templateLoader.ts` uses `import.meta.glob` with `eager: true` for synchronous loading
