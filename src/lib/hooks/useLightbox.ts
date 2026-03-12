import { useState, useCallback } from 'react'

interface UseLightboxResult {
	index: number | null
	open: (i: number) => void
	close: () => void
	prev: () => void
	next: () => void
}

export function useLightbox(total: number): UseLightboxResult {
	const [index, setIndex] = useState<number | null>(null)

	const open = useCallback((i: number) => setIndex(i), [])
	const close = useCallback(() => setIndex(null), [])
	const prev = useCallback(
		() => setIndex((i) => (i !== null ? (i - 1 + total) % total : null)),
		[total]
	)
	const next = useCallback(() => setIndex((i) => (i !== null ? (i + 1) % total : null)), [total])

	return { index, open, close, prev, next }
}
