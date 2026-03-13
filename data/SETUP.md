# Personal Data Setup

This folder contains your personal data. **It is gitignored** — your real files are never pushed to GitHub.

## Setup

Copy each `.example.ts` file and remove the `.example` part:

```bash
cp config.example.ts config.ts
cp projects.example.ts projects.ts
cp experience.example.ts experience.ts
cp education.example.ts education.ts
cp technologies.example.ts technologies.ts
cp certificates.example.ts certificates.ts
cp currentlyWorkingOn.example.ts currentlyWorkingOn.ts
```

Then fill in your real data in each file.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable            | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token (classic). Scopes: `read:user`. Used for the GitHub Activity contribution graph. Generate at https://github.com/settings/tokens |
| `VITE_RESUME_URL`   | Google Drive (or any public URL) to your resume. Opens in a new tab on click. Leave empty to hide the Resume button. |

## Image Thumbnails

The app uses thumbnails in grids/cards for performance, and full-res images in the lightbox/detail views.

**Convention:** for every image, create a smaller `-thumb` version alongside it:

```
public/projects/foo.webp        ← full resolution (used in detail/lightbox)
public/projects/foo-thumb.webp  ← thumbnail ~400px wide (used in cards/grids)

public/certificates/bar.webp
public/certificates/bar-thumb.webp
```

If a `-thumb` file doesn't exist, the browser will show a broken image in the grid. Use [Squoosh](https://squoosh.app) or ImageMagick to generate thumbnails:

```bash
# ImageMagick — resize to 400px wide, keep aspect ratio
magick foo.webp -resize 400x foo-thumb.webp
```

## Files

| File                        | Description                              |
| --------------------------- | ---------------------------------------- |
| `config.ts`                 | Name, title, socials, location, resume   |
| `projects.ts`               | Your projects                            |
| `experience.ts`             | Your work experience                     |
| `education.ts`              | Your education history                   |
| `technologies.ts`           | Technologies you use                     |
| `certificates.ts`           | Your certificates                        |
| `currentlyWorkingOn.ts`     | What you're currently building/learning  |
