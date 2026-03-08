import { useEffect } from 'react'

export function useThrottledMouseMove(callback: (x: number, y: number) => void): void {
	useEffect(() => {
		// Touch/mobile devices have no mouse — skip the listener entirely.
		// This saves CPU, battery, and removes one source of TBT on mobile.
		if (window.matchMedia('(hover: none)').matches) return

		let rafId: number | null = null

		const handleMouseMove = (e: MouseEvent) => {
			// Capture coords synchronously — MouseEvent objects are pooled by the browser
			// and can be mutated before the rAF callback fires.
			const x = e.clientX
			const y = e.clientY
			if (rafId !== null) return
			rafId = requestAnimationFrame(() => {
				callback(x, y)
				rafId = null
			})
		}

		window.addEventListener('mousemove', handleMouseMove, { passive: true })
		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			if (rafId !== null) cancelAnimationFrame(rafId)
		}
	}, [callback])
}
