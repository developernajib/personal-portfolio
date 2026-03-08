import { useEffect, useRef, useState } from 'react'

/**
 * Custom scrollbar for mobile/touch devices — mimics the desktop
 * gradient scrollbar (fades from transparent at top to primary at bottom).
 * Only renders on touch devices. Hidden on pointer (desktop) devices.
 */
export default function MobileScrollbar() {
	const thumbRef = useRef<HTMLDivElement>(null)
	const trackRef = useRef<HTMLDivElement>(null)
	const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		let ticking = false

		function update() {
			const el = document.documentElement
			const scrollTop = el.scrollTop || document.body.scrollTop
			const scrollHeight = el.scrollHeight || document.body.scrollHeight
			const clientHeight = el.clientHeight || document.body.clientHeight

			if (scrollHeight <= clientHeight) {
				setVisible(false)
				return
			}

			const trackHeight = trackRef.current?.clientHeight ?? clientHeight
			const thumbRatio = clientHeight / scrollHeight
			const thumbHeight = Math.max(thumbRatio * trackHeight, 30)
			const maxTop = trackHeight - thumbHeight
			const scrollRatio = scrollTop / (scrollHeight - clientHeight)
			const thumbTop = scrollRatio * maxTop

			if (thumbRef.current) {
				thumbRef.current.style.height = `${thumbHeight}px`
				thumbRef.current.style.transform = `translateY(${thumbTop}px)`
			}

			ticking = false
		}

		function onScroll() {
			setVisible(true)
			if (fadeTimer.current) clearTimeout(fadeTimer.current)
			fadeTimer.current = setTimeout(() => setVisible(false), 1200)

			if (!ticking) {
				ticking = true
				requestAnimationFrame(update)
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		// Initial calculation
		update()

		return () => {
			window.removeEventListener('scroll', onScroll)
			if (fadeTimer.current) clearTimeout(fadeTimer.current)
		}
	}, [])

	return (
		<div
			ref={trackRef}
			className="fixed top-0 right-0 w-[5px] h-full z-[9999] pointer-events-none lg:hidden"
			style={{
				opacity: visible ? 1 : 0,
				transition: 'opacity 0.3s ease',
			}}
		>
			<div
				ref={thumbRef}
				className="absolute top-0 right-0 w-full rounded-full"
				style={{
					background: 'linear-gradient(to bottom, transparent, var(--primary))',
				}}
			/>
		</div>
	)
}
