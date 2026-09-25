# Personal Data Setup

This folder contains your personal data. **It is gitignored** - your real files are never pushed to GitHub.

## Quick Start

1. Copy each `.example.ts` file and remove the `.example` part:

```bash
cd data
cp config.example.ts config.ts
cp experience.example.ts experience.ts
cp projects.example.ts projects.ts
cp technologies.example.ts technologies.ts
cp certificates.example.ts certificates.ts
cp skills.example.ts skills.ts
cp education.example.ts education.ts
cp currentlyWorkingOn.example.ts currentlyWorkingOn.ts
```

2. Edit each `.ts` file with your own information (details below).

3. Set up your `.env` file at the project root:

```bash
cp .env.example .env
```

| Variable ----------- | Description -- |-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token (classic). Scopes: `read:user`. Used for the GitHub Activity heatmap widget. Generate at https://github.com/settings/tokens - you may mix the literal text `NajIB` anywhere inside the value, the app strips it before use so a leaked value alone cannot authenticate |
| `VITE_RESUME_URL` | Google Drive (or any public URL) to your resume PDF. Opens in a new tab on click. Leave empty to hide the Resume button. |
| `VITE_MAP_LAT` / `VITE_MAP_LNG` | Optional map marker coordinates. Both must be set together, otherwise the pin falls back to `location.lat` / `location.lng` in `config.ts`. On Netlify, set them in the dashboard and redeploy. |

---

## File-by-File Guide

### `config.ts` - Site & Personal Info

Your identity, location, and social links. Used across the entire site - header, footer, hero section, SEO meta tags, and the location map widget.

| Field               | What to put                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| `name`              | Display name (shown in header)                                                   |
| `fullName`          | Full name (hero section and meta tags)                                           |
| `title`             | Job title (e.g. "Software Engineer II")                                          |
| `image`             | Profile photo path - place the file in `public/assets/` (e.g. `/assets/me.webp`) |
| `url`               | Your portfolio's live URL                                                        |
| `description`       | One-liner about yourself (used in meta tags)                                     |
| `location.city`     | Your city                                                                        |
| `location.country`  | Your country                                                                     |
| `location.timezone` | IANA timezone (e.g. `Asia/Dhaka`, `America/New_York`)                            |
| `location.lat`      | Latitude for the map widget                                                      |
| `location.lng`      | Longitude for the map widget                                                     |
| `socials.github`    | GitHub profile URL                                                               |
| `socials.linkedin`  | LinkedIn profile URL                                                             |
| `socials.telegram`  | Telegram profile URL                                                             |
| `socials.email`     | Your email address                                                               |
| `resume`            | Leave as-is - read from the `VITE_RESUME_URL` env var                            |

---

### `experience.ts` - Work Experience

Array of jobs/roles. Displayed on the homepage (featured items) and the Experience page.

| Field         | Required | Notes                                                                                              |
| ------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `id`          | Yes      | URL slug for the detail page (e.g. `software-engineer-at-company`)                                 |
| `role`        | Yes      | Job title                                                                                          |
| `company`     | Yes      | Company name                                                                                       |
| `companyUrl`  | Yes      | Company website URL. Use `#` when there is no site - the link renders as plain text                |
| `location`    | No       | City, Country                                                                                      |
| `logoUrl`     | No       | Company logo path - place in `public/logos/`                                                       |
| `logoAlt`     | No       | Alt text for the logo                                                                              |
| `startDate`   | Yes      | Format: `YYYY-MM-DD`                                                                               |
| `endDate`     | No       | Omit for current position                                                                          |
| `description` | Yes      | Short summary (shown in list/card view)                                                            |
| `details`     | No       | Longer description (shown on detail page)                                                          |
| `tags`        | Yes      | Tech stack used at this role (array of strings)                                                    |
| `featured`    | No       | `true` to show on homepage                                                                         |
| `highlight`   | No       | `true` for a glowing accent border on the About and Experience timelines                           |
| `type`        | Yes      | One of `fulltime`, `freelance`, `contract`, `parttime`, `learning`                                 |
| `noDetail`    | No       | Set `true` to skip generating a detail page (useful for short gigs)                                |
| `projects`    | No       | Array of projects at this company: `{ name, purpose, description, tags, url, liveUrl, githubUrl }` |
| `manager`     | No       | Manager info: `{ name, title, email, linkedin, github }`                                           |
| `team`        | No       | Team members: `{ name, position, photo, email, github, linkedin }`                                 |
| `gallery`     | No       | Photos: `{ src, caption }` - place images in `public/gallery/`                                     |

---

### `projects.ts` - Portfolio Projects

Array of projects to showcase. Displayed on the Projects page with card layout and detail pages.

| Field             | Required | Notes                                                                                                               |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `slug`            | Yes      | URL slug (e.g. `my-saas-app`)                                                                                       |
| `title`           | Yes      | Project name                                                                                                        |
| `description`     | Yes      | Short description (shown in card view)                                                                              |
| `longDescription` | No       | Detailed description - supports **markdown**                                                                        |
| `image`           | No       | Cover image path - place in `public/projects/`. A placeholder shows when omitted                                    |
| `gallery`         | No       | Additional screenshots: `{ src, caption }`                                                                          |
| `date`            | Yes      | Format: `YYYY-MM-DD`                                                                                                |
| `tags`            | Yes      | Tech stack (array of strings)                                                                                       |
| `liveUrl`         | No       | Live demo URL                                                                                                       |
| `extraLiveUrls`   | No       | Extra store links: `{ label, url }[]`, shown as buttons after `liveUrl`                                             |
| `githubUrl`       | No       | Source code URL                                                                                                     |
| `featured`        | No       | `true` to highlight                                                                                                 |
| `order`           | No       | Display serial, lower shows first (e.g. `1`, `2`, `3`). Items without `order` keep file position after ordered ones |

---

### `technologies.ts` - Tech Stack

Array of technologies you know. The **first 7 items** appear on the homepage preview, so order them by importance.

| Field       | Required | Notes                                                                                                                                                                  |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | Yes      | Unique identifier (e.g. `react`, `go`, `docker`)                                                                                                                       |
| `name`      | Yes      | Display name                                                                                                                                                           |
| `desc`      | Yes      | Short description (e.g. "JavaScript library for UIs")                                                                                                                  |
| `category`  | Yes      | One of `Frontend`, `Backend`, `Language`, `Database`, `DevOps`                                                                                                         |
| `icon`      | Yes      | Local icon path - download the SVG into `public/icons/` as `{slug}-{hex}.svg` and use `/icons/{slug}-{hex}.svg` (never hotlink `cdn.simpleicons.org`, links can break) |
| `iconBg`    | Yes      | Background tint for the icon (hex + alpha, e.g. `#61DAFB20`)                                                                                                           |
| `startDate` | Yes      | When you started using it (`YYYY-MM-DD`)                                                                                                                               |
| `endDate`   | No       | Set if you no longer actively use it                                                                                                                                   |
| `featured`  | No       | `true` to prioritize in display                                                                                                                                        |
| `usage`     | Yes      | Where you used it - `{ context, company, role, from, to }[]`. `context` is `job`, `freelance` or `personal`. Use `[]` when there is nothing notable                    |

**Finding icons:** Browse [Simple Icons](https://simpleicons.org/) for brand icons. Download the SVG into `public/icons/` - never hotlink the CDN in data files.

---

### `certificates.ts` - Certifications

Array of certificates and credentials.

| Field           | Required | Notes                                                                                          |
| --------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `id`            | Yes      | Unique identifier                                                                              |
| `title`         | Yes      | Certificate name                                                                               |
| `issuer`        | Yes      | Issuing organization (e.g. Udemy, AWS, Coursera)                                               |
| `date`          | Yes      | Date received (`YYYY-MM-DD`)                                                                   |
| `image`         | No       | Certificate image path in `public/certificates/`. A placeholder shows when omitted             |
| `gallery`       | No       | Extra images for the detail page, `{ src, caption? }[]`                                        |
| `credentialUrl` | No       | Verification/credential link                                                                   |
| `description`   | No       | What the certificate covers                                                                    |
| `skills`        | No       | Related skills (array of strings)                                                              |
| `order`         | No       | Display serial, lower shows first. Items without `order` keep file position after ordered ones |

Each certificate gets a detail page at `/certificates/:id`, opened by clicking the card. Image preview lives on that detail page: click the hero or a gallery thumbnail for the full-screen viewer.

---

### `skills.ts` - Skills

Grouped skill names shown at the bottom of the Technologies page. Keep out anything already listed in `technologies.ts`. Plain strings only, no icons or detail pages.

| Field   | Required | Notes                                |
| ------- | -------- | ------------------------------------ |
| `title` | Yes      | Group name (e.g. `Backend and APIs`) |
| `items` | Yes      | Skill names (array of strings)       |

---

### `education.ts` - Education

Array of degrees and education entries.

| Field         | Required | Notes                                                                                                 |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `degree`      | Yes      | e.g. "Bachelor of Science"                                                                            |
| `field`       | Yes      | e.g. "Computer Science"                                                                               |
| `institution` | Yes      | University/school name                                                                                |
| `location`    | No       | City, Country                                                                                         |
| `startYear`   | Yes      | Start year (number)                                                                                   |
| `endYear`     | No       | Graduation year (omit if ongoing, renders as `startYear - Present`)                                   |
| `cgpa`        | No       | Your GPA/CGPA. Set both `cgpa` and `cgpaMax`, or neither - the badge is hidden when either is missing |
| `cgpaMax`     | No       | Maximum GPA scale (e.g. 4.0)                                                                          |

---

### `currentlyWorkingOn.ts` - Bento Widget

What you're currently building and learning. Shown in the homepage bento grid widget.

Two arrays to fill out:

**`currentlyWorkingOn`** - active projects:

| Field      | Required | Notes                      |
| ---------- | -------- | -------------------------- |
| `title`    | Yes      | Project name               |
| `subtitle` | Yes      | Stack or short description |
| `url`      | No       | Link to the project        |

**`currentlyLearning`** - what you're studying:

| Field      | Required | Notes                   |
| ---------- | -------- | ----------------------- |
| `title`    | Yes      | Topic name              |
| `subtitle` | Yes      | Short description       |
| `url`      | No       | Link to course/resource |

---

## Image Guidelines

Place all images in the `public/` folder:

```
public/
├── assets/
│   └── your-photo.jpg           # Profile photo (referenced in config.ts)
├── logos/
│   └── company.png              # Company logos for experience entries
├── projects/
│   ├── my-project.webp          # Full resolution (detail page / lightbox)
│   ├── my-project-thumb.webp    # Thumbnail 900px wide (card grid)
│   └── my-project-thumb-mobile.webp  # Mobile thumbnail 450px wide
├── certificates/
│   ├── my-cert.webp             # Full resolution
│   ├── my-cert-thumb.webp       # Thumbnail 450px wide
│   └── my-cert-thumb-mobile.webp # Mobile thumbnail 200px wide
├── gallery/
│   └── team-photo.webp          # Experience gallery photos
└── icons/
    └── react-61DAFB.svg         # Technology logos from Simple Icons
```

### Thumbnails

The app uses thumbnails in grids/cards for performance, and full-res images in lightbox/detail views.

**Convention:** every project and certificate image needs both a `-thumb` and a `-thumb-mobile` sibling. Both are WebP regardless of the source format. If a thumbnail is missing the grid shows a broken image.

```bash
# Projects - 900px thumb, 450px mobile thumb
magick foo.webp -resize 900x -quality 82 foo-thumb.webp
magick foo-thumb.webp -resize 450x -quality 80 foo-thumb-mobile.webp

# Certificates - 450px thumb, 200px mobile thumb
magick bar.webp -resize 450x -quality 82 bar-thumb.webp
magick bar-thumb.webp -resize 200x -quality 80 bar-thumb-mobile.webp
```

Or use [Squoosh](https://squoosh.app) for a web-based tool.

### Recommended formats and sizes

| Type              | Format                  | Size            |
| ----------------- | ----------------------- | --------------- |
| Profile photo     | `.jpg` or `.webp`       | 400x400px       |
| Project cover     | `.webp`                 | ~1600px wide    |
| Project thumbnail | `.webp`                 | 900px / 450px   |
| Certificate image | `.webp`                 | ~1000px wide    |
| Certificate thumb | `.webp`                 | 450px / 200px   |
| Company logo      | `.png` (transparent bg) | 64x64px         |
| Technology icon   | `.svg`                  | 24x24px viewBox |

---

## Tips

- All dates use `YYYY-MM-DD` format
- The first 7 technologies appear on the homepage - order them by what you want to highlight
- Set `featured: true` on your best projects and most relevant experience
- Set `highlight: true` on the one experience entry that should glow on the About and Experience timelines
- Use `noDetail: true` on experience entries to skip generating a detail page (good for short freelance gigs)
- Set `order` on projects and certificates to control display order, lower numbers show first
- Markdown is supported in project `longDescription`
- Use `.webp` for images - significantly smaller file size than PNG/JPEG
- Every project and certificate image needs both `-thumb` and `-thumb-mobile` siblings, see Image Guidelines above
