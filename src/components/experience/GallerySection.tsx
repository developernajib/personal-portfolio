import { IconPhoto } from '@tabler/icons-react'
import Lightbox from '@/components/ui/Lightbox'
import { useLightbox } from '@/lib/hooks/useLightbox'
import { thumb } from '@/lib/utils'
import type { ExperienceGalleryItem } from '@/data/experience'

interface Props {
	gallery: ExperienceGalleryItem[]
	accentColor: string
}

export default function GallerySection({ gallery, accentColor }: Props) {
	const lightbox = useLightbox(gallery.length)

	if (gallery.length === 0) return null

	const lightboxItems = gallery.map((img) => ({
		src: img.src,
		alt: img.caption || 'Gallery image',
		caption: img.caption,
	}))

	return (
		<section>
			<h2
				className="flex items-center gap-2 text-lg font-bold mb-4"
				style={{ color: 'var(--text)' }}
			>
				<IconPhoto size={18} color={accentColor} />
				Gallery
			</h2>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{gallery.map((img, i) => (
					<button
						key={i}
						onClick={() => lightbox.open(i)}
						className="relative rounded-xl overflow-hidden border group"
						style={{ borderColor: 'var(--overlay)', aspectRatio: '16/9' }}
					>
						<img
							src={thumb(img.src)}
							alt={img.caption || `Gallery image ${i + 1}`}
							className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
							loading="lazy"
							decoding="async"
						/>
						{img.caption && (
							<div
								className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
								style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff' }}
							>
								{img.caption}
							</div>
						)}
					</button>
				))}
			</div>

			{lightbox.index !== null && (
				<Lightbox
					items={lightboxItems}
					currentIndex={lightbox.index}
					onClose={lightbox.close}
					onPrev={lightbox.prev}
					onNext={lightbox.next}
				/>
			)}
		</section>
	)
}
