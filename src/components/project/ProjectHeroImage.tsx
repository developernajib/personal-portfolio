import { useState } from 'react'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import { imgVariant } from '@/lib/utils'

interface Props {
	src: string
	alt: string
}

export default function ProjectHeroImage({ src, alt }: Props) {
	const [error, setError] = useState(false)

	if (error) {
		return (
			<div className="aspect-video">
				<ImagePlaceholder label="Image not found" />
			</div>
		)
	}

	return (
		<picture>
			<source media="(max-width: 768px)" srcSet={imgVariant(src, '-thumb')} />
			<img
				src={src}
				alt={alt}
				className="w-full object-cover"
				fetchPriority="high"
				onError={() => setError(true)}
			/>
		</picture>
	)
}
