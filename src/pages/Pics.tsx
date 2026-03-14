import { useState } from 'react'
import Container from '@/components/ui/Container'
import { IconPhoto } from '@tabler/icons-react'
import SlabTitle from '@/components/ui/SlabTitle'
import Lightbox from '@/components/ui/Lightbox'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import { useLightbox } from '@/lib/hooks/useLightbox'
import { photos } from '@/data/pics'
import useDocTitle from '@/lib/hooks/useDocTitle'

function PhotoTile({
	photo,
	index,
	onClick,
}: {
	photo: (typeof photos)[0]
	index: number
	onClick: (i: number) => void
}) {
	const [imgFailed, setImgFailed] = useState(false)

	return (
		<button
			className="hover-border-primary break-inside-avoid block w-full overflow-hidden rounded-xl border cursor-zoom-in group"
			style={{ borderColor: 'var(--overlay)' }}
			onClick={() => onClick(index)}
			aria-label={`View ${photo.alt}`}
		>
			{imgFailed ? (
				<div
					className="aspect-square flex items-center justify-center"
					style={{ backgroundColor: 'var(--bg-surface)' }}
				>
					<span className="text-xs font-mono" style={{ color: 'var(--subtext)' }}>
						No image
					</span>
				</div>
			) : (
				<img
					src={photo.src.replace(/\.(\w+)$/, '-thumb.$1')}
					alt={photo.alt}
					className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
					loading="lazy"
					decoding="async"
					onError={() => setImgFailed(true)}
				/>
			)}
			{photo.caption && (
				<div className="px-3 py-2" style={{ backgroundColor: 'var(--bg-surface)' }}>
					<p className="text-xs" style={{ color: 'var(--subtext)' }}>
						{photo.caption}
					</p>
				</div>
			)}
		</button>
	)
}

export default function Pics() {
	useDocTitle('Photos')
	const lightbox = useLightbox(photos.length)
	const lightboxItems = photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }))

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10">
				<div className="mb-8 flex items-center gap-3">
					<IconPhoto size={28} color="var(--primary)" />
					<SlabTitle title="Pics" config="4c" as="h1" />
				</div>

				<p className="mb-8 text-sm" style={{ color: 'var(--subtext)' }}>
					A collection of photos from my life and travels.
				</p>

				{photos.length > 0 ? (
					<div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3 sm:gap-4 sm:space-y-4">
						{photos.map((photo, i) => (
							<PhotoTile
								key={photo.id}
								photo={photo}
								index={i}
								onClick={lightbox.open}
							/>
						))}
					</div>
				) : (
					<div
						className="rounded-xl border p-12 text-center"
						style={{
							backgroundColor: 'var(--bg-surface)',
							borderColor: 'var(--overlay)',
						}}
					>
						<IconPhoto size={48} color="var(--overlay)" className="mx-auto mb-3" />
						<p style={{ color: 'var(--subtext)' }}>No photos yet.</p>
					</div>
				)}
			</Container>

			{/* Lightbox — always uses full-res src */}
			{lightbox.index !== null && (
				<Lightbox
					items={lightboxItems}
					currentIndex={lightbox.index}
					onClose={lightbox.close}
					onPrev={lightbox.prev}
					onNext={lightbox.next}
				/>
			)}
		</div>
	)
}
