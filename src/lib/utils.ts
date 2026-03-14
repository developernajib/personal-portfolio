export function formatDate(dateStr: string, opts?: { yearMonthOnly?: boolean }): string {
	if (!dateStr) return ''

	const date = new Date(dateStr)

	if (opts?.yearMonthOnly) {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
		})
	}

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

export function getDuration(startDate: string, endDate?: string): string {
	const start = new Date(startDate)
	const base = endDate ? new Date(endDate) : new Date()
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


export function isValidHttpUrl(url: string): boolean {
	try {
		return ['http:', 'https:'].includes(new URL(url).protocol)
	} catch {
		return false
	}
}
