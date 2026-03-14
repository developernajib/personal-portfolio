import { useEffect, useCallback } from 'react'
import { IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { imgVariant } from '@/lib/utils'

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
}

export default function Lightbox({ items, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
	const current = items[currentIndex]

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
			if (e.key === 'ArrowLeft' && onPrev) onPrev()
			if (e.key === 'ArrowRight' && onNext) onNext()
		},
		[onClose, onPrev, onNext]
	)

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		document.body.style.overflow = 'hidden'
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = ''
		}
	}, [handleKeyDown])

	if (!current) return null

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
			style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
			onClick={onClose}
		>
			{/* Close button */}
			<button
				onClick={onClose}
				className="hover-primary absolute top-4 right-4 z-50 p-2 rounded-full"
				style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text)' }}
				aria-label="Close lightbox"
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
					className="hover-primary absolute left-2 sm:left-4 z-50 p-2.5 rounded-full"
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
					className="hover-primary absolute right-2 sm:right-4 z-50 p-2.5 rounded-full"
					style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text)' }}
					aria-label="Next image"
				>
					<IconChevronRight size={24} />
				</button>
			)}

			{/* Image */}
			<div
				className="flex flex-col items-center gap-2 px-14"
				style={{ maxWidth: '100vw', maxHeight: '100vh' }}
				onClick={(e) => e.stopPropagation()}
			>
				<picture>
					<source
						media="(max-width: 768px)"
						srcSet={imgVariant(current.src, '-thumb')}
					/>
					<img
						src={current.src}
						alt={current.alt}
						className="object-contain rounded-lg shadow-2xl"
						style={{ maxWidth: '92vw', maxHeight: '88vh' }}
					/>
				</picture>
				{current.caption && (
					<p className="text-sm text-center" style={{ color: 'var(--subtext)' }}>
						{current.caption}
					</p>
				)}
				{items.length > 1 && (
					<p className="text-xs" style={{ color: 'var(--overlay)' }}>
						{currentIndex + 1} / {items.length}
					</p>
				)}
			</div>
		</div>
	)
}
