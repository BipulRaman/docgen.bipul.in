# LetterGen

A **React + TypeScript** app for generating formal letters from HTML templates and exporting them as A4-sized PDFs.

**Live:** [docgen.bipul.in](https://docgen.bipul.in)

## Tech Stack

- **React 18** with **TypeScript 5** (strict mode)
- **Vite 5** — build tool
- **jsPDF + html2canvas** — PDF export
- **Plain CSS** — no frameworks
- **GitHub Actions** — CI/CD to GitHub Pages

## Getting Started

```bash
npm install
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # TypeScript check + production build → dist/
npm run preview   # Preview production build locally
```

## Project Structure

```
├── index.html
├── vite.config.ts
├── public/
│   ├── CNAME
│   └── logo-bnp.png
└── src/
    ├── App.tsx                  # Root component (PIN gate + layout)
    ├── main.tsx                 # React entry point
    ├── types.ts                 # LetterTemplate, PlaceholderField interfaces
    ├── templateLoader.ts        # Auto-discovers templates via import.meta.glob
    ├── placeholders.ts          # Extracts fields & renders template HTML
    ├── exportPdf.ts             # html2canvas → jsPDF A4 PDF export
    ├── styles.css               # All styles (layout, A4 page, PIN screen)
    ├── components/
    │   ├── PinScreen.tsx        # PIN auth (current IST time as HHMM)
    │   ├── TemplateForm.tsx     # Auto-generated form from placeholders
    │   └── LetterPreview.tsx    # Live A4 preview + Export PDF button
    └── templates/
        └── bnp-invitation.html  # Example template
```

## How Templates Work

Templates are **plain HTML files** in `src/templates/`. They are auto-discovered at build time — no manual registration required.

### Template Format

Each `.html` file must begin with a metadata comment:

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

### Adding a New Template

1. Create a new `.html` file in `src/templates/`
2. Start with the metadata comment: `<!-- template: { "id": "...", "name": "..." } -->`
3. Write HTML content with `{{placeholders}}`
4. Place any logo/image assets in `public/` and reference via absolute path (e.g., `/logo.png`)
5. Done — template auto-appears in the dropdown

## Deployment

Push to `main` triggers the GitHub Actions workflow which builds and deploys to the `gh-pages` branch. Custom domain is configured via `public/CNAME`.

## License

MIT
