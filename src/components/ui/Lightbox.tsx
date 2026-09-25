import { useEffect, useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { thumbSrc } from '@/lib/utils'
import Tooltip from './Tooltip'

interface LightboxItem {
	src: string
	alt: string
	caption?: string
}

interface LightboxProps {
	items: LightboxItem[]
	currentIndex: number
	onClose: () => void
	onPrev?: () => void
	onNext?: () => void
	onSelect?: (index: number) => void
}

const ZOOM_SCALE = 2.25

export default function Lightbox({
	items,
	currentIndex,
	onClose,
	onPrev,
	onNext,
	onSelect,
}: LightboxProps) {
	const current = items[currentIndex]
	const stripRef = useRef<HTMLDivElement>(null)
	const frameRef = useRef<HTMLDivElement>(null)
	const [zoomed, setZoomed] = useState(false)
	const [origin, setOrigin] = useState({ x: 50, y: 50 })

	// Leaving zoom mode whenever the image changes or the viewer closes
	useEffect(() => {
		setZoomed(false)
		setOrigin({ x: 50, y: 50 })
	}, [currentIndex])

	// Touch controls on the image frame:
	//single finger drag pans while zoomed, horizontal swipe navigates when not zoomed
	useEffect(() => {
		const el = frameRef.current
		if (!el) return
		let start: { x: number; y: number } | null = null
		const onTouchStart = (e: TouchEvent) => {
			if (e.touches.length === 1) {
				start = { x: e.touches[0].clientX, y: e.touches[0].clientY }
			}
		}
		const onTouchMove = (e: TouchEvent) => {
			if (!zoomed || e.touches.length !== 1 || !start) return
			e.preventDefault()
			const t = e.touches[0]
			const rect = el.getBoundingClientRect()
			if (rect.width === 0 || rect.height === 0) return
			const dx = ((t.clientX - start.x) / rect.width) * 100
			const dy = ((t.clientY - start.y) / rect.height) * 100
			start = { x: t.clientX, y: t.clientY }
			setOrigin((o) => ({
				x: Math.min(100, Math.max(0, o.x - dx)),
				y: Math.min(100, Math.max(0, o.y - dy)),
			}))
		}
		const onTouchEnd = (e: TouchEvent) => {
			if (!zoomed && start && e.changedTouches.length === 1) {
				const t = e.changedTouches[0]
				const dx = t.clientX - start.x
				const dy = t.clientY - start.y
				if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
					if (dx < 0) onNext?.()
					else onPrev?.()
				}
			}
			start = null
		}
		el.addEventListener('touchstart', onTouchStart, { passive: true })
		el.addEventListener('touchmove', onTouchMove, { passive: false })
		el.addEventListener('touchend', onTouchEnd)
		return () => {
			el.removeEventListener('touchstart', onTouchStart)
			el.removeEventListener('touchmove', onTouchMove)
			el.removeEventListener('touchend', onTouchEnd)
		}
	}, [zoomed, onPrev, onNext])

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				if (zoomed) setZoomed(false)
				else onClose()
			}
			if (e.key === 'ArrowLeft' && onPrev) onPrev()
			if (e.key === 'ArrowRight' && onNext) onNext()
		},
		[onClose, onPrev, onNext, zoomed]
	)

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		const prevBody = document.body.style.overflow
		const prevHtml = document.documentElement.style.overflow
		document.body.style.overflow = 'hidden'
		document.documentElement.style.overflow = 'hidden'
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = prevBody
			document.documentElement.style.overflow = prevHtml
		}
	}, [handleKeyDown])

	// Keep the active thumb centered in the filmstrip
	useEffect(() => {
		const strip = stripRef.current
		const active = strip?.querySelector<HTMLElement>('[data-active="true"]')
		active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
	}, [currentIndex])

	if (!current) return null

	function pointFromClient(x: number, y: number) {
		const rect = frameRef.current?.getBoundingClientRect()
		if (!rect || rect.width === 0 || rect.height === 0) return { x: 50, y: 50 }
		return {
			x: Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100)),
			y: Math.min(100, Math.max(0, ((y - rect.top) / rect.height) * 100)),
		}
	}

	function toggleZoom(e: React.MouseEvent) {
		setOrigin(pointFromClient(e.clientX, e.clientY))
		setZoomed((z) => !z)
	}

	function panZoom(e: React.MouseEvent) {
		if (zoomed) setOrigin(pointFromClient(e.clientX, e.clientY))
	}

	return createPortal(
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
			style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
			onClick={() => {
				if (zoomed) setZoomed(false)
				else onClose()
			}}
		>
			{/* Close button - large touch target so it stays usable on mobile */}
			<button
				onClick={(e) => {
					e.stopPropagation()
					onClose()
				}}
				className="hover-primary absolute top-4 right-4 z-10 p-3 sm:p-2 rounded-full"
				style={{
					backgroundColor: 'var(--bg-surface)',
					color: 'var(--text)',
					border: '1px solid var(--overlay)',
				}}
				aria-label="Close preview"
			>
				<IconX size={20} />
			</button>

			{/* Prev button */}
			{onPrev && items.length > 1 && (
				<button
					onClick={(e) => {
						e.stopPropagation()
						onPrev()
					}}
					className="hover-primary absolute left-2 sm:left-4 z-10 p-2.5 rounded-full"
					style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text)' }}
					aria-label="Previous image"
				>
					<IconChevronLeft size={24} />
				</button>
			)}

			{/* Next button */}
			{onNext && items.length > 1 && (
				<button
					onClick={(e) => {
						e.stopPropagation()
						onNext()
					}}
					className="hover-primary absolute right-2 sm:right-4 z-10 p-2.5 rounded-full"
					style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text)' }}
					aria-label="Next image"
				>
					<IconChevronRight size={24} />
				</button>
			)}

			{/* Image */}
			<div
				className="flex flex-col items-center gap-2 px-4 sm:px-14"
				style={{ maxWidth: '100vw', maxHeight: '100dvh' }}
				onClick={(e) => e.stopPropagation()}
			>
				<Tooltip
					content={zoomed ? 'Click to exit zoom' : 'Click to zoom in'}
					position="top"
				>
					<div
						ref={frameRef}
						onClick={toggleZoom}
						onMouseMove={panZoom}
						className="relative rounded-lg cursor-hand"
						style={{
							overflow: 'hidden',
							maxWidth: '96vw',
						}}
					>
						<img
							src={current.src}
							alt={current.alt}
							className="object-contain rounded-lg shadow-2xl lightbox-img"
							style={{
								transform: zoomed ? `scale(${ZOOM_SCALE})` : 'scale(1)',
								transformOrigin: `${origin.x}% ${origin.y}%`,
								transition: 'transform 0.15s ease-out',
							}}
							draggable={false}
						/>
						{!zoomed && (current.caption || items.length > 1) && (
							<div
								className="pointer-events-none absolute inset-x-0 bottom-0 flex items-baseline justify-center gap-2 px-4 pt-8 pb-3"
								style={{
									background:
										'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
								}}
							>
								{current.caption && (
									<p
										className="text-sm text-center truncate"
										style={{ color: '#e6edf3' }}
									>
										{current.caption}
									</p>
								)}
								{items.length > 1 && (
									<p
										className="text-xs flex-shrink-0"
										style={{ color: 'var(--subtext)' }}
									>
										{currentIndex + 1} / {items.length}
									</p>
								)}
							</div>
						)}
					</div>
				</Tooltip>

				{/* Exit zoom pill, centered between the arrows, only while zoomed */}
				{zoomed && (
					<button
						onClick={(e) => {
							e.stopPropagation()
							setZoomed(false)
						}}
						className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium border"
						style={{
							color: 'var(--primary)',
							borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.4)',
							backgroundColor: 'rgba(0,0,0,0.7)',
						}}
						aria-label="Exit zoom"
					>
						<IconX size={13} />
						Exit zoom
					</button>
				)}

				{/* Filmstrip, touch devices skip it so the image gets the full screen */}
				{items.length > 1 && (
					<div
						ref={stripRef}
						className="scrollbar-none touch-filmstrip items-center gap-2 overflow-x-auto py-1"
						style={{ maxWidth: '94vw' }}
					>
						{items.map((item, i) => (
							<button
								key={i}
								data-active={i === currentIndex}
								onClick={() => onSelect?.(i)}
								className="flex-shrink-0 overflow-hidden rounded-md border transition-all duration-150"
								style={{
									width: '96px',
									height: '54px',
									borderColor:
										i === currentIndex ? 'var(--primary)' : 'var(--overlay)',
									opacity: i === currentIndex ? 1 : 0.55,
									boxShadow:
										i === currentIndex
											? '0 0 12px rgba(var(--primary-rgb, 0,213,217),0.4)'
											: 'none',
								}}
								aria-label={`View preview ${i + 1}`}
							>
								<img
									src={thumbSrc(item.src)}
									alt={item.alt}
									className="h-full w-full object-cover"
									loading="lazy"
									decoding="async"
								/>
							</button>
						))}
					</div>
				)}
			</div>
		</div>,
		document.body
	)
}
