import { useRef, useState, useEffect, useCallback } from 'react'
import { useDocumentTheme } from '@/lib/hooks/useDocumentTheme'
import { useThrottledMouseMove } from '@/lib/hooks/useThrottledMouseMove'

// Skip entirely on touch/mobile — cursor is meaningless on touch devices
const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

function CustomCursorInner() {
	const cursorRef = useRef<HTMLDivElement>(null)
	const [clicking, setClicking] = useState(false)
	const [hovering, setHovering] = useState(false)
	const [visible, setVisible] = useState(false)
	const theme = useDocumentTheme()

	const primary = theme === 'light' ? '#0099a0' : '#00D5D9'

	const hoveringRef = useRef(false)
	/* Throttle elementFromPoint to every 100ms — it forces layout recalc so
	   running it every rAF frame (~16ms) burns unnecessary CPU */
	const lastHitTestRef = useRef(0)

	const handleMove = useCallback((clientX: number, clientY: number) => {
		setVisible(true)
		if (cursorRef.current) {
			cursorRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`
		}
		const now = Date.now()
		if (now - lastHitTestRef.current < 100) return
		lastHitTestRef.current = now
		const target = document.elementFromPoint(clientX, clientY) as HTMLElement | null
		if (target) {
			const isClickable =
				target.closest('a, button, [role="button"], input, select, textarea, label') !==
				null
			if (isClickable !== hoveringRef.current) {
				hoveringRef.current = isClickable
				setHovering(isClickable)
			}
		}
	}, [])

	useThrottledMouseMove(handleMove)

	useEffect(() => {
		const onMouseDown = () => setClicking(true)
		const onMouseUp = () => setClicking(false)
		const onLeave = () => setVisible(false)
		const onEnter = () => setVisible(true)

		window.addEventListener('mousedown', onMouseDown)
		window.addEventListener('mouseup', onMouseUp)
		document.documentElement.addEventListener('mouseleave', onLeave)
		document.documentElement.addEventListener('mouseenter', onEnter)

		return () => {
			window.removeEventListener('mousedown', onMouseDown)
			window.removeEventListener('mouseup', onMouseUp)
			document.documentElement.removeEventListener('mouseleave', onLeave)
			document.documentElement.removeEventListener('mouseenter', onEnter)
		}
	}, [])

	// Use scale() instead of animating width/height/margin.
	// scale() is a composited-only property — no layout reflow, no repaint,
	// handled entirely on the GPU compositor thread.
	const scale = clicking ? 0.57 : hovering ? 1.43 : 1 // 8/14, 20/14, 14/14

	return (
		<div
			ref={cursorRef}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '14px',
				height: '14px',
				marginLeft: '-7px',
				marginTop: '-7px',
				pointerEvents: 'none',
				zIndex: 99999,
				opacity: visible ? 1 : 0,
				transform: 'translate(0px, 0px)', // overridden by handleMove
				// Only composited properties animated: transform (scale + translate) + opacity
				transition: 'scale 0.15s ease, opacity 0.2s ease',
				scale: String(scale),
			}}
		>
			{/* Corner brackets */}
			{(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
				<div
					key={corner}
					style={{
						position: 'absolute',
						width: '5px',
						height: '5px',
						borderColor: hovering ? primary : `${primary}cc`,
						borderStyle: 'solid',
						borderWidth: 0,
						borderTopWidth: corner.startsWith('t') ? '1.5px' : 0,
						borderBottomWidth: corner.startsWith('b') ? '1.5px' : 0,
						borderLeftWidth: corner.endsWith('l') ? '1.5px' : 0,
						borderRightWidth: corner.endsWith('r') ? '1.5px' : 0,
						top: corner.startsWith('t') ? 0 : 'auto',
						bottom: corner.startsWith('b') ? 0 : 'auto',
						left: corner.endsWith('l') ? 0 : 'auto',
						right: corner.endsWith('r') ? 0 : 'auto',
						transition: 'border-color 0.15s ease',
					}}
				/>
			))}

			{/* Center dot — fixed size, scale inherited from parent */}
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					width: '2px',
					height: '2px',
					marginLeft: '-1px',
					marginTop: '-1px',
					backgroundColor: primary,
					borderRadius: '50%',
				}}
			/>
		</div>
	)
}

export default function CustomCursor() {
	if (isTouchDevice) return null
	return <CustomCursorInner />
}
