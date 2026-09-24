import { useState } from 'react'
import { IconMaximize } from '@tabler/icons-react'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import Lightbox from '@/components/ui/Lightbox'
import { thumbSrc } from '@/lib/utils'

interface Props {
	src: string
	alt: string
	onOpen?: () => void
	contain?: boolean
}

export default function ProjectHeroImage({ src, alt, onOpen, contain }: Props) {
	const [error, setError] = useState(false)
	const [open, setOpen] = useState(false)
	const useInternal = !onOpen

	if (error) {
		return (
			<div className="aspect-video">
				<ImagePlaceholder label="Image not found" />
			</div>
		)
	}

	return (
		<>
			<button
				onClick={() => (onOpen ? onOpen() : setOpen(true))}
				className="group relative block w-full"
				aria-label={`Open preview of ${alt}`}
			>
				<picture>
					<source media="(max-width: 768px)" srcSet={thumbSrc(src)} />
					<img
						src={src}
						alt={alt}
						className={
							contain
								? 'mx-auto block max-h-[70vh] w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]'
								: 'w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]'
						}
						fetchPriority="high"
						onError={() => setError(true)}
					/>
				</picture>
				<span
					className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
					style={{
						color: 'var(--text)',
						backgroundColor: 'rgba(0,0,0,0.6)',
						border: '1px solid var(--overlay)',
					}}
				>
					<IconMaximize size={13} />
					Preview
				</span>
			</button>
			{useInternal && open && (
				<Lightbox
					items={[{ src, alt }]}
					currentIndex={0}
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	)
}
