import { useRef, useCallback, useState, useEffect } from 'react'
import { useThrottledMouseMove } from '@/lib/hooks/useThrottledMouseMove'

// Skip entirely on touch/mobile — no mousemove events, no DOM overhead
const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

function BackgroundEffectInner() {
	const ref = useRef<HTMLDivElement>(null)

	const handleMove = useCallback((clientX: number, clientY: number) => {
		const el = ref.current
		if (!el) return
		const rect = el.getBoundingClientRect()
		const x = ((clientX - rect.left) / rect.width) * 100
		const y = ((clientY - rect.top) / rect.height) * 100
		el.style.setProperty('--x', `${x}%`)
		el.style.setProperty('--y', `${y}%`)
	}, [])

	useThrottledMouseMove(handleMove)

	return (
		<div
			ref={ref}
			className="fixed inset-0 pointer-events-none z-0"
			style={{
				background: `radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(var(--primary-rgb, 0,213,217), 0.04), transparent 60%)`,
			}}
		/>
	)
}

export default function BackgroundEffect() {
	const [ready, setReady] = useState(false)

	useEffect(() => {
		if (isTouchDevice) return
		// Defer until browser is idle so we don't block LCP
		if ('requestIdleCallback' in window) {
			const id = requestIdleCallback(() => setReady(true))
			return () => cancelIdleCallback(id)
		}
		// Fallback: 2s delay
		const timer = setTimeout(() => setReady(true), 2000)
		return () => clearTimeout(timer)
	}, [])

	if (!ready) return null
	return <BackgroundEffectInner />
}
