import { useState } from 'react'
import { IconPhoto } from '@tabler/icons-react'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import Lightbox from '@/components/ui/Lightbox'
import { thumbSrc, thumbMobileSrc } from '@/lib/utils'
import type { ProjectGalleryItem } from '@/data/projects'

interface Props {
	gallery: ProjectGalleryItem[]
	projectTitle: string
}

export default function ProjectGallery({ gallery, projectTitle }: Props) {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
	const [thumbErrors, setThumbErrors] = useState<Set<number>>(new Set())

	if (gallery.length === 0) return null

	function handleThumbError(i: number) {
		setThumbErrors((prev) => new Set(prev).add(i))
	}

	const lightboxItems = gallery.map((g) => ({
		src: g.src,
		alt: g.caption ?? projectTitle,
		caption: g.caption,
	}))

	return (
		<section className="space-y-4 mt-8">
			<div className="flex items-center gap-2">
				<IconPhoto size={18} color="var(--primary)" />
				<h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
					Screenshots
				</h2>
			</div>

			<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
				{gallery.map((item, i) => (
					<button
						key={i}
						onClick={() => setLightboxIndex(i)}
						className="hover-border-primary group relative aspect-video overflow-hidden rounded-lg border"
						style={{ borderColor: 'var(--overlay)' }}
						aria-label={`View screenshot ${i + 1}`}
					>
						{!thumbErrors.has(i) ? (
							<picture>
								<source
									media="(max-width: 768px)"
									srcSet={thumbMobileSrc(item.src)}
								/>
								<img
									src={thumbSrc(item.src)}
									alt={item.caption ?? `Screenshot ${i + 1}`}
									className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									loading="lazy"
									decoding="async"
									onError={() => handleThumbError(i)}
								/>
							</picture>
						) : (
							<ImagePlaceholder />
						)}
					</button>
				))}
			</div>

			{lightboxIndex !== null && (
				<Lightbox
					items={lightboxItems}
					currentIndex={lightboxIndex}
					onClose={() => setLightboxIndex(null)}
					onPrev={() =>
						setLightboxIndex((prev) =>
							prev !== null ? (prev - 1 + gallery.length) % gallery.length : null
						)
					}
					onNext={() =>
						setLightboxIndex((prev) =>
							prev !== null ? (prev + 1) % gallery.length : null
						)
					}
				/>
			)}
		</section>
	)
}
