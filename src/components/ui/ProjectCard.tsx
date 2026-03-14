import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, thumbSrc } from '@/lib/utils'
import TagBadge from './TagBadge'
import ImagePlaceholder from './ImagePlaceholder'
import type { Project } from '@/data/projects'

interface ProjectCardProps {
	project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
	const [imgError, setImgError] = useState(false)

	return (
		<Link
			to={`/projects/${project.slug}`}
			className="group block rounded-xl border hover-border-primary cursor-pointer"
			style={{
				backgroundColor: 'var(--bg-surface)',
				borderColor: 'var(--overlay)',
			}}
		>
			{/* Image */}
			<div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
				{project.image && !imgError ? (
					<img
						src={thumbSrc(project.image)}
						alt={project.title}
						width={600}
						height={338}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
						decoding="async"
						onError={() => setImgError(true)}
					/>
				) : (
					<ImagePlaceholder label="No preview" />
				)}
				{project.featured && (
					<span
						title="Featured"
						className="absolute top-2 right-2 text-base leading-none px-1.5 py-1 rounded-md"
						style={{
							color: 'var(--primary)',
							backgroundColor: 'rgba(0,0,0,0.55)',
							border: '1px solid rgba(var(--primary-rgb, 0,213,217),0.4)',
						}}
					>
						★
					</span>
				)}
			</div>

			{/* Content */}
			<div className="p-5 space-y-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex items-center gap-1.5 min-w-0">
						<h2
							className="text-base font-semibold truncate transition-colors duration-150 group-hover:text-[var(--primary)]"
							style={{ color: 'var(--text)' }}
						>
							{project.title}
						</h2>
					</div>
					<span
						className="flex-shrink-0 text-xs whitespace-nowrap"
						style={{ color: 'var(--subtext)' }}
					>
						{formatDate(project.date)}
					</span>
				</div>

				<p className="text-sm line-clamp-3" style={{ color: 'var(--subtext)' }}>
					{project.description}
				</p>

				<div className="flex flex-wrap gap-1.5 pt-1">
					{project.tags.map((tag) => (
						<TagBadge key={tag} tag={tag} />
					))}
				</div>
			</div>
		</Link>
	)
}
