#!/usr/bin/env node

const CYAN = '\x1b[36m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const MAGENTA = '\x1b[35m'
const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

function line(text = '') {
	console.log(text)
}

function header(text) {
	line()
	console.log(`${BOLD}${CYAN}${text}${RESET}`)
	console.log(`${DIM}${'─'.repeat(text.length)}${RESET}`)
}

function step(num, text) {
	console.log(`  ${BOLD}${YELLOW}${num}.${RESET} ${text}`)
}

function cmd(text) {
	console.log(`     ${GREEN}$ ${text}${RESET}`)
}

function note(text) {
	console.log(`     ${DIM}${text}${RESET}`)
}

function item(text) {
	console.log(`     ${BLUE}•${RESET} ${text}`)
}

// ─── Title ────────────────────────────────────────────────────────────────────

line()
console.log(`${BOLD}${MAGENTA}  DevNajib Portfolio — Setup & Usage Guide${RESET}`)
console.log(`${DIM}  A personal portfolio built with React + Vite + TypeScript${RESET}`)

// ─── 1. Installation ──────────────────────────────────────────────────────────

header('1. Installation')
step(1, 'Clone the repository')
cmd('git clone https://github.com/developernajib/devnajib-portfolio.git')
cmd('cd devnajib-portfolio')

step(2, 'Install dependencies')
cmd('npm install')

// ─── 2. Data Files Setup ──────────────────────────────────────────────────────

header('2. Data Files Setup')
line(`  ${DIM}The portfolio reads personal data from the data/ directory.${RESET}`)
line(`  ${DIM}These files are not included in the repo — copy from examples:${RESET}`)
line()

const dataFiles = [
	['data/config.ts', 'data/config.example.ts', 'Site name, title, links, email, photo'],
	['data/projects.ts', 'data/projects.example.ts', 'Portfolio projects'],
	['data/experience.ts', 'data/experience.example.ts', 'Work experience'],
	['data/certificates.ts', 'data/certificates.example.ts', 'Certifications'],
	['data/technologies.ts', 'data/technologies.example.ts', 'Tech stack'],
	['data/education.ts', 'data/education.example.ts', 'Education history'],
	[
		'data/currentlyWorkingOn.ts',
		'data/currentlyWorkingOn.example.ts',
		'Currently working on / learning',
	],
]

dataFiles.forEach(([target, example, desc]) => {
	console.log(`  ${CYAN}${target}${RESET} — ${DIM}${desc}${RESET}`)
	cmd(`cp ${example} ${target}`)
})

line()
step('All at once', 'Copy all data files in one command:')
cmd(dataFiles.map(([t, e]) => `cp ${e} ${t}`).join(' && '))

// ─── 3. Adding Your Data ──────────────────────────────────────────────────────

header('3. Editing Data Files')

line(`  ${BOLD}data/config.ts${RESET} — Site-wide settings`)
item('name         → short name shown in header (e.g. "Najib")')
item('fullName     → full name for SEO / titles')
item('title        → your role (e.g. "Full-Stack Engineer")')
item('email        → contact email')
item('github       → GitHub username (used for activity widget)')
item('linkedin     → LinkedIn profile URL')
item('image        → path to your photo in public/assets/')
item('resume       → path or URL to your resume')

line()
line(`  ${BOLD}data/projects.ts${RESET} — Each project entry:`)
item('slug         → URL key (e.g. "my-project" → /projects/my-project)')
item('image        → /projects/my-project.jpg')
item('gallery      → array of { src, caption } for screenshots')
item('liveUrl      → live demo URL')
item('githubUrl    → source code URL')
item('featured     → true to show on homepage')

line()
line(`  ${BOLD}data/certificates.ts${RESET} — Each certificate:`)
item('image        → /certificates/my-cert.jpg')
item('credentialUrl → link to verify the credential')

// ─── 4. Image Files ───────────────────────────────────────────────────────────

header('4. Image Files')
line(`  ${DIM}Place images in the public/ folder. These are git-ignored (personal data).${RESET}`)
line()
item(`${CYAN}public/assets/${RESET}       → profile photo, homepage screenshot`)
item(`${CYAN}public/projects/${RESET}     → project screenshots`)
item(`${CYAN}public/certificates/${RESET} → certificate images`)
item(`${CYAN}public/logos/${RESET}        → company logos`)

line()
line(`  ${BOLD}Image naming conventions:${RESET}`)
item('my-project.jpg           → full-res (used in hero / lightbox)')
item('my-project-thumb.jpg     → thumbnail (450px, used in gallery grid / mobile hero)')
item('my-project-thumb-mobile.jpg → mobile gallery thumbnail (200px)')

line()
line(`  ${BOLD}Generate thumbnails with ImageMagick:${RESET}`)
cmd('magick input.jpg -resize 450x -strip -quality 80 output-thumb.jpg')
cmd('magick output-thumb.jpg -resize 200x -strip -quality 75 output-thumb-mobile.jpg')

// ─── 5. Development ───────────────────────────────────────────────────────────

header('5. Development Commands')

const scripts = [
	['npm run dev', 'Start development server with hot reload'],
	['npm run build', 'Type-check and build for production'],
	['npm run preview', 'Preview the production build locally'],
	['npm run start', 'Serve production build on port 3000'],
	['npm run lint', 'Run ESLint checks'],
	['npm run format', 'Format code with Prettier'],
	['npm run help', 'Show this guide'],
]

scripts.forEach(([cmd_, desc]) => {
	console.log(`  ${GREEN}${cmd_.padEnd(22)}${RESET} ${DIM}${desc}${RESET}`)
})

// ─── 6. Deployment ────────────────────────────────────────────────────────────

header('6. Deployment (Netlify)')
item('Connect repo to Netlify')
item(`Build command: ${GREEN}npm run build${RESET}`)
item(`Publish dir:   ${GREEN}dist${RESET}`)
item('netlify.toml handles security headers and cache rules automatically')

// ─── 7. PWA ───────────────────────────────────────────────────────────────────

header('7. PWA & Offline Support')
item('Service worker auto-registers on first visit')
item('App shell, fonts, and JS/CSS are precached')
item('Images are cached on first view (CacheFirst, 21-day TTL)')
item('GitHub API responses are cached for 5 minutes (NetworkFirst)')
item('Updates auto-apply on next page reload')

line()
line(
	`  ${DIM}Run ${RESET}${GREEN}npm run build && npm run preview${RESET}${DIM} to test PWA locally.${RESET}`
)

// ─── Footer ───────────────────────────────────────────────────────────────────

line()
console.log(`${DIM}${'─'.repeat(50)}${RESET}`)
console.log(`${DIM}  Built by developernajib · github.com/developernajib${RESET}`)
line()
