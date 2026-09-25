# Md Najib Islam - Personal Portfolio

A developer portfolio built with React, TypeScript, and Tailwind CSS. Features a terminal-inspired design with dark/light theme support, custom cursors, and a monospace aesthetic powered by JetBrains Mono.

![Homepage](public/Home-Page.png)

## Features

- **Terminal-inspired UI** - monospace typography, custom cursor, blinking terminal caret
- **Dark / Light theme** - smooth toggle with view-transition circular reveal
- **Bento grid widgets** - GitHub activity heatmap, location map, currently working on
- **Fully responsive** - mobile-first with glassmorphism bottom navigation
- **Fast** - Vite build, preloaded fonts, optimized asset loading
- **SEO ready** - Open Graph meta, sitemap, robots.txt

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Build:** Vite
- **Fonts:** JetBrains Mono (self-hosted)
- **Maps:** Leaflet
- **Deployment:** Netlify

## Getting Started

```bash
# Clone
git clone https://github.com/developernajib/personal-portfolio.git
cd personal-portfolio

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your GitHub token and resume URL

# Set up data files (Manually)
# Copy data/*.example.ts files to data/*.ts and fill in your info

# Run dev server
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── bento/       # GitHub heatmap, location map, working-on widget
│   ├── experience/  # Experience detail sections, journey timeline
│   ├── home/        # Hero, education, experience preview
│   ├── layout/      # Header, Footer, BottomNav, ScrollToTop
│   ├── project/     # Project detail header, gallery, links
│   └── ui/          # Cards, buttons, lightbox, toast
├── data/            # Type definitions re-exported from data/
├── lib/             # Config, sorting, helpers
│   └── hooks/       # Custom React hooks
├── pages/           # Route pages (Home, About, Projects, Experience, etc.)
├── routes/          # Route preload helpers
└── index.css        # Global styles and theme variables
data/
├── *.example.ts     # Template data files (tracked)
└── *.ts             # Personal data files (gitignored)
```

## Environment Variables

| Variable            | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `VITE_GITHUB_TOKEN` | GitHub personal access token (for activity widget)   |
| `VITE_RESUME_URL`   | Public URL to your resume PDF                        |
| `VITE_MAP_LAT`      | Optional map pin latitude, pairs with `VITE_MAP_LNG` |

## Image Thumbnails

Every image in `public/projects/` and `public/certificates/` needs a matching thumbnail with a `-thumb` suffix. Thumbnails are used in card grids for faster loading - full-res images load only when clicked.

```
public/projects/my-app.webp           ← full resolution (detail page / lightbox)
public/projects/my-app-thumb.webp     ← thumbnail 900px wide (card grid)
public/projects/my-app-thumb-mobile.webp ← mobile thumbnail 450px wide
```

Generate thumbnails with ImageMagick:

```bash
magick original.png -resize 900x -strip -quality 82 original-thumb.webp
magick original-thumb.webp -resize 450x -strip -quality 80 original-thumb-mobile.webp
```

Both `-thumb` and `-thumb-mobile` are required for every image referenced in a card grid, and both are WebP regardless of the source format.

See [`data/setup.md`](data/setup.md) for detailed image guidelines.

## License

Licensed under the [MIT](LICENSE)

---

### 📜 Author

**Md. Najib Islam**
_Software Engineer_

[![GitHub](https://img.shields.io/badge/GitHub-DeveloperNajib-black.svg)](https://github.com/developernajib)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0005--8578--7790-green.svg)](https://orcid.org/0009-0005-8578-7790)
[![Telegram](https://img.shields.io/badge/Telegram-@developernajib-blue.svg)](https://t.me/developernajib)

_"Building solutions that matter, one line of code at a time."_

Made with ❤️ by [DeveloperNajib](https://github.com/developernajib)
