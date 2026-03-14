export function formatDate(dateStr: string, opts?: { yearMonthOnly?: boolean }): string {
	if (!dateStr) return ''
	const date = new Date(dateStr)
	if (isNaN(date.getTime())) return ''

	if (opts?.yearMonthOnly) {
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
	}
	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function getDuration(startDate: string, endDate?: string): string {
	const start = new Date(startDate)
	if (isNaN(start.getTime())) return ''
	const base = endDate ? new Date(endDate) : new Date()
	if (isNaN(base.getTime())) return ''
	const end = new Date(base.getTime() + 24 * 60 * 60 * 1000)
	const diffMs = end.getTime() - start.getTime()
	const diffMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.44))
	const years = Math.floor(diffMonths / 12)
	const months = diffMonths % 12

	if (years === 0) return `${months} mo`
	if (months === 0) return `${years} yr`
	return `${years} yr ${months} mo`
}

export function cn(...classes: (string | undefined | false | null)[]): string {
	return classes.filter(Boolean).join(' ')
}

/**
 * Returns suffix-based image variant path.
 * imgVariant('/projects/foo.png', '-mobile') → '/projects/foo-mobile.png'
 */
export function imgVariant(src: string, suffix: string): string {
	if (!src || src.startsWith('http') || src.startsWith('data:')) return src
	const dot = src.lastIndexOf('.')
	if (dot === -1) return src
	return src.slice(0, dot) + suffix + src.slice(dot)
}

/**
 * Returns the thumbnail path for a given image src.
 * All thumbnails are JPEG regardless of original format.
 * thumbSrc('/projects/foo.png') → '/projects/foo-thumb.jpg'
 */
export function thumbSrc(src: string): string {
	if (!src || src.startsWith('http') || src.startsWith('data:')) return src
	return src.replace(/\.\w+$/, '-thumb.jpg')
}

/**
 * Returns the mobile thumbnail path for a given image src.
 * thumbMobileSrc('/projects/foo.png') → '/projects/foo-thumb-mobile.jpg'
 */
export function thumbMobileSrc(src: string): string {
	if (!src || src.startsWith('http') || src.startsWith('data:')) return src
	return src.replace(/\.\w+$/, '-thumb-mobile.jpg')
}

export function isValidHttpUrl(url: string): boolean {
	try {
		return ['http:', 'https:'].includes(new URL(url).protocol)
	} catch {
		return false
	}
}
