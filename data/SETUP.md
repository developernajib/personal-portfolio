# Personal Data Setup

This folder contains your personal data. **It is gitignored** — your real files are never pushed to GitHub.

## Quick Start

1. Copy each `.example.ts` file and remove the `.example` part:

```bash
cd data
cp config.example.ts config.ts
cp experience.example.ts experience.ts
cp projects.example.ts projects.ts
cp technologies.example.ts technologies.ts
cp certificates.example.ts certificates.ts
cp education.example.ts education.ts
cp currentlyWorkingOn.example.ts currentlyWorkingOn.ts
```

2. Edit each `.ts` file with your own information (details below).

3. Set up your `.env` file at the project root:

```bash
cp .env.example .env
```

| Variable ----------- | Description -- |-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token (classic). Scopes: `read:user`. Used for the GitHub Activity heatmap widget. Generate at https://github.com/settings/tokens |
| `VITE_RESUME_URL` | Google Drive (or any public URL) to your resume PDF. Opens in a new tab on click. Leave empty to hide the Resume button. |

---

## File-by-File Guide

### `config.ts` — Site & Personal Info

Your identity, location, and social links. Used across the entire site — header, footer, hero section, SEO meta tags, and the location map widget.

| Field               | What to put                                           |
| ------------------- | ----------------------------------------------------- |
| `name`              | Display name (shown in header)                        |
| `fullName`          | Full name (hero section and meta tags)                |
| `title`             | Job title (e.g. "Software Engineer II")               |
| `image`             | Profile photo filename — place the image in `public/` |
| `url`               | Your portfolio's live URL                             |
| `description`       | One-liner about yourself (used in meta tags)          |
| `location.city`     | Your city                                             |
| `location.country`  | Your country                                          |
| `location.timezone` | IANA timezone (e.g. `Asia/Dhaka`, `America/New_York`) |
| `location.lat`      | Latitude for the map widget                           |
| `location.lng`      | Longitude for the map widget                          |
| `socials.github`    | GitHub profile URL                                    |
| `socials.linkedin`  | LinkedIn profile URL                                  |
| `socials.telegram`  | Telegram profile URL                                  |
| `socials.email`     | Your email address                                    |

---

### `experience.ts` — Work Experience

Array of jobs/roles. Displayed on the homepage (featured items) and the Experience page.

| Field         | Required | Notes                                                                          |
| ------------- | -------- | ------------------------------------------------------------------------------ |
| `id`          | Yes      | URL slug for the detail page (e.g. `software-engineer-at-company`)             |
| `role`        | Yes      | Job title                                                                      |
| `company`     | Yes      | Company name                                                                   |
| `companyUrl`  | No       | Company website URL                                                            |
| `location`    | No       | City, Country                                                                  |
| `logoUrl`     | No       | Company logo path — place in `public/logos/`                                   |
| `logoAlt`     | No       | Alt text for the logo                                                          |
| `startDate`   | Yes      | Format: `YYYY-MM-DD`                                                           |
| `endDate`     | No       | Omit for current position                                                      |
| `description` | Yes      | Short summary (shown in list/card view)                                        |
| `details`     | No       | Longer description (shown on detail page)                                      |
| `tags`        | Yes      | Tech stack used at this role (array of strings)                                |
| `featured`    | No       | `true` to show on homepage                                                     |
| `type`        | No       | `fulltime`, `freelance`, `intern`, etc.                                        |
| `noDetail`    | No       | Set `true` to skip generating a detail page (useful for short gigs)            |
| `projects`    | No       | Array of projects at this company: `{ name, purpose, description, tags, url }` |
| `manager`     | No       | Manager info: `{ name, title, email, linkedin }`                               |
| `team`        | No       | Team members: `{ name, position, email, github, linkedin }`                    |
| `gallery`     | No       | Photos: `{ src, caption }` — place images in `public/gallery/`                 |

---

### `projects.ts` — Portfolio Projects

Array of projects to showcase. Displayed on the Projects page with card layout and detail pages.

| Field             | Required | Notes                                          |
| ----------------- | -------- | ---------------------------------------------- |
| `slug`            | Yes      | URL slug (e.g. `my-saas-app`)                  |
| `title`           | Yes      | Project name                                   |
| `description`     | Yes      | Short description (shown in card view)         |
| `longDescription` | No       | Detailed description — supports **markdown**   |
| `image`           | Yes      | Cover image path — place in `public/projects/` |
| `gallery`         | No       | Additional screenshots: `{ src, caption }`     |
| `date`            | Yes      | Format: `YYYY-MM-DD`                           |
| `tags`            | Yes      | Tech stack (array of strings)                  |
| `liveUrl`         | No       | Live demo URL                                  |
| `githubUrl`       | No       | Source code URL                                |
| `featured`        | No       | `true` to highlight                            |

---

### `technologies.ts` — Tech Stack

Array of technologies you know. The **first 7 items** appear on the homepage preview, so order them by importance.

| Field       | Required | Notes                                                               |
| ----------- | -------- | ------------------------------------------------------------------- |
| `id`        | Yes      | Unique identifier (e.g. `react`, `go`, `docker`)                    |
| `name`      | Yes      | Display name                                                        |
| `desc`      | Yes      | Short description (e.g. "JavaScript library for UIs")               |
| `category`  | Yes      | `Frontend`, `Backend`, `Language`, `Database`, `DevOps`, etc.       |
| `icon`      | Yes      | Icon URL — use `https://cdn.simpleicons.org/{name}/{hexcolor}`      |
| `iconBg`    | Yes      | Background tint for the icon (hex + alpha, e.g. `#61DAFB20`)        |
| `startDate` | Yes      | When you started using it (`YYYY-MM-DD`)                            |
| `endDate`   | No       | Set if you no longer actively use it                                |
| `featured`  | No       | `true` to prioritize in display                                     |
| `usage`     | No       | Where you used it — array of `{ context, company, role, from, to }` |

**Finding icons:** Browse [Simple Icons](https://simpleicons.org/) for brand icons. URL format: `https://cdn.simpleicons.org/{slug}/{hexcolor}`

---

### `certificates.ts` — Certifications

Array of certificates and credentials.

| Field           | Required | Notes                                                    |
| --------------- | -------- | -------------------------------------------------------- |
| `id`            | Yes      | Unique identifier                                        |
| `title`         | Yes      | Certificate name                                         |
| `issuer`        | Yes      | Issuing organization (e.g. Udemy, AWS, Coursera)         |
| `date`          | Yes      | Date received (`YYYY-MM-DD`)                             |
| `image`         | Yes      | Certificate image path — place in `public/certificates/` |
| `credentialUrl` | No       | Verification/credential link                             |
| `description`   | No       | What the certificate covers                              |
| `skills`        | No       | Related skills (array of strings)                        |

---

### `education.ts` — Education

Array of degrees and education entries.

| Field         | Required | Notes                             |
| ------------- | -------- | --------------------------------- |
| `degree`      | Yes      | e.g. "Bachelor of Science"        |
| `field`       | Yes      | e.g. "Computer Science"           |
| `institution` | Yes      | University/school name            |
| `location`    | No       | City, Country                     |
| `startYear`   | Yes      | Start year (number)               |
| `endYear`     | No       | Graduation year (omit if ongoing) |
| `cgpa`        | No       | Your GPA/CGPA                     |
| `cgpaMax`     | No       | Maximum GPA scale (e.g. 4.0)      |

---

### `currentlyWorkingOn.ts` — Bento Widget

What you're currently building and learning. Shown in the homepage bento grid widget.

Two arrays to fill out:

**`currentlyWorkingOn`** — active projects:

| Field      | Required | Notes                      |
| ---------- | -------- | -------------------------- |
| `title`    | Yes      | Project name               |
| `subtitle` | Yes      | Stack or short description |
| `url`      | No       | Link to the project        |

**`currentlyLearning`** — what you're studying:

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
├── your-photo.jpg              # Profile photo (referenced in config.ts)
├── logos/
│   └── company.png             # Company logos for experience entries
├── projects/
│   ├── my-project.webp         # Full resolution (detail page / lightbox)
│   └── my-project-thumb.webp   # Thumbnail ~400px wide (cards / grids)
├── certificates/
│   ├── my-cert.webp            # Full resolution
│   └── my-cert-thumb.webp      # Thumbnail
└── gallery/
    └── team-photo.webp         # Experience gallery photos
```

### Thumbnails

The app uses thumbnails in grids/cards for performance, and full-res images in lightbox/detail views.

**Convention:** for every image, create a smaller `-thumb` version alongside it. If a `-thumb` file doesn't exist, the browser will show a broken image in the grid.

```bash
# Using ImageMagick — resize to 400px wide, keep aspect ratio
magick foo.webp -resize 400x foo-thumb.webp
```

Or use [Squoosh](https://squoosh.app) for a web-based tool.

### Recommended formats and sizes

| Type              | Format                  | Size       |
| ----------------- | ----------------------- | ---------- |
| Profile photo     | `.jpg` or `.webp`       | 400x400px  |
| Project cover     | `.webp`                 | 1200x630px |
| Project thumbnail | `.webp`                 | 400px wide |
| Certificate image | `.webp`                 | Any        |
| Company logo      | `.png` (transparent bg) | 64x64px    |

---

## Tips

- All dates use `YYYY-MM-DD` format
- The first 7 technologies appear on the homepage — order them by what you want to highlight
- Set `featured: true` on your best projects and most relevant experience
- Use `noDetail: true` on experience entries to skip generating a detail page (good for short freelance gigs)
- Markdown is supported in project `longDescription`
- Use `.webp` for images — significantly smaller file size than PNG/JPEG
