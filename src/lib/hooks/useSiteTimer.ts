import { useEffect, useRef } from 'react'

const STORAGE_KEY = 'total-time-on-site'

function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const secs = seconds % 60
	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
	}
	return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Site timer that updates DOM directly via ref — zero React re-renders.
 * Returns a ref to attach to the <span> that displays the timer.
 */
export function useSiteTimer(): React.RefObject<HTMLSpanElement | null> {
	const spanRef = useRef<HTMLSpanElement>(null)
	const sessionStartRef = useRef<number>(Date.now())
	const savedTimeRef = useRef<number>(0)

	useEffect(() => {
		const saved = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
		savedTimeRef.current = isNaN(saved) ? 0 : saved
		sessionStartRef.current = Date.now()

		if (spanRef.current) {
			spanRef.current.textContent = formatTime(savedTimeRef.current)
		}

		const interval = setInterval(() => {
			const sessionElapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000)
			if (spanRef.current) {
				spanRef.current.textContent = formatTime(savedTimeRef.current + sessionElapsed)
			}
		}, 1000)

		const saveTime = () => {
			const sessionElapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000)
			localStorage.setItem(STORAGE_KEY, String(savedTimeRef.current + sessionElapsed))
		}

		const onVisibility = () => {
			if (document.visibilityState === 'hidden') saveTime()
		}

		window.addEventListener('beforeunload', saveTime)
		document.addEventListener('visibilitychange', onVisibility)

		return () => {
			clearInterval(interval)
			window.removeEventListener('beforeunload', saveTime)
			document.removeEventListener('visibilitychange', onVisibility)
			saveTime()
		}
	}, [])

	return spanRef
}
