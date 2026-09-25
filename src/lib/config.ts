// Single source of truth for site config.
//
// Why this wrapper exists:
//  - `data/config.ts` is gitignored, so on Netlify it usually does NOT exist.
//    In that case Vite serves an empty stub (resume: '') and the Resume button
//    would stay hidden even when VITE_RESUME_URL is set in the Netlify dashboard.
//  - Locally, `.env` may contain a placeholder like `VITE_RESUME_URL=test`,
//    which is truthy but not a valid URL - rendering a broken relative link.
//
// Resolution order (first valid value wins):
//   1. Build-time env `VITE_RESUME_URL` - on Netlify this comes from the
//      dashboard (Site settings > Environment variables); locally it comes
//      from `.env`. Vite already gives real env vars precedence over `.env`
//      file values, so this single read covers "Netlify first, .env fallback".
//   2. `resume` field from `data/config.ts` (for anyone hardcoding a URL there).
//
// NOTE: Vite bakes env vars in at *build* time. After changing the variable
// on Netlify you must trigger a redeploy (Clear cache + Deploy) to pick it up.
import BaseSite from '@data/config'

function normalizeResumeUrl(raw: unknown): string | undefined {
	if (typeof raw !== 'string') return undefined
	let v = raw.trim().replace(/^['"]+|['"]+$/g, '')
	if (!v) return undefined
	// Ignore obvious placeholders so we render no button instead of a broken link.
	if (v === 'test' || v.includes('YOUR_FILE_ID') || v.includes('your_')) return undefined
	// Allow site-relative files, e.g. "/resume.pdf" placed in public/.
	if (v.startsWith('/')) return v
	// Require absolute http(s) URL, otherwise it would resolve as a broken
	// relative link (e.g. href="test" -> /test -> SPA fallback).
	if (!/^https?:\/\//i.test(v)) return undefined
	return v
}

const envResume = normalizeResumeUrl(import.meta.env.VITE_RESUME_URL)
const fileResume = normalizeResumeUrl((BaseSite as { resume?: unknown } | undefined)?.resume)

// Map marker coordinates - same "Netlify env first, .env fallback" chain:
//   1. Build-time env `VITE_MAP_LAT` / `VITE_MAP_LNG` (Netlify dashboard
//      wins over `.env` automatically, same as the resume URL above).
//   2. `location` in `data/config.ts`.
//   3. Hardcoded default (update it to the exact place you want marked).
function toFiniteNumber(raw: unknown): number | undefined {
	if (typeof raw !== 'string' && typeof raw !== 'number') return undefined
	const n = typeof raw === 'number' ? raw : Number(raw.trim())
	return Number.isFinite(n) ? n : undefined
}

const baseLocation =
	(BaseSite as { location?: Record<string, unknown> } | undefined)?.location ?? {}
const envLat = toFiniteNumber(import.meta.env.VITE_MAP_LAT)
const envLng = toFiniteNumber(import.meta.env.VITE_MAP_LNG)

const Site = {
	...(BaseSite as Record<string, unknown>),
	// Env wins when valid, otherwise fall back to the data file value.
	resume: envResume ?? fileResume ?? undefined,
	location: {
		...baseLocation,
		lat: envLat ?? toFiniteNumber(baseLocation.lat) ?? 22.3569,
		lng: envLng ?? toFiniteNumber(baseLocation.lng) ?? 91.7832,
	},
}

export default Site as typeof BaseSite & { resume?: string }
