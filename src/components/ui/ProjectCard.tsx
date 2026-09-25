import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconCheck } from '@tabler/icons-react'
import { formatDate, thumbSrc } from '@/lib/utils'
import { useVisitedProjects } from '@/lib/visited'
import TagBadge from './TagBadge'
import ImagePlaceholder from './ImagePlaceholder'
import Tooltip from './Tooltip'
import type { Project } from '@/data/projects'

interface ProjectCardProps {
	project: Project
	maxTags?: number
	compact?: boolean
}

export default function ProjectCard({ project, maxTags, compact }: ProjectCardProps) {
	const [imgError, setImgError] = useState(false)
	const visited = useVisitedProjects()
	const isVisited = visited.has(project.slug)
	const visibleTags = maxTags !== undefined ? project.tags.slice(0, maxTags) : project.tags
	const hiddenCount = maxTags !== undefined ? project.tags.length - visibleTags.length : 0

	return (
		<Link
			to={`/projects/${project.slug}`}
			className="group clickable-card block rounded-xl border hover-border-primary cursor-hand"
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
					<Tooltip content="Featured" position="bottom">
						<span
							className="absolute top-2 right-2 text-base leading-none px-1.5 py-1 rounded-md"
							style={{
								color: 'var(--primary)',
								backgroundColor: 'rgba(0,0,0,0.55)',
								border: '1px solid rgba(var(--primary-rgb, 0,213,217),0.4)',
							}}
						>
							★
						</span>
					</Tooltip>
				)}
				{isVisited && (
					<Tooltip content="You have visited this project" position="top">
						<span
							className="absolute bottom-2 left-2 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md"
							style={{
								color: 'var(--primary)',
								backgroundColor: 'rgba(0,0,0,0.65)',
								border: '1px solid rgba(var(--primary-rgb, 0,213,217),0.45)',
								backdropFilter: 'blur(4px)',
							}}
						>
							<IconCheck size={12} stroke={2.5} />
							Reviewed
						</span>
					</Tooltip>
				)}
			</div>

			{/* Content */}
			<div className={compact ? 'p-4 space-y-2' : 'p-5 space-y-3'}>
				<div className="flex items-start justify-between gap-2">
					<div className="flex items-center gap-1.5 min-w-0">
						<h2
							className={
								compact
									? 'text-sm font-semibold line-clamp-2 transition-colors duration-150 group-hover:text-[var(--primary)]'
									: 'text-base font-semibold truncate transition-colors duration-150 group-hover:text-[var(--primary)]'
							}
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
					{visibleTags.map((tag) => (
						<TagBadge key={tag} tag={tag} />
					))}
					{hiddenCount > 0 && (
						<Tooltip content={`${hiddenCount} more tags`} position="top">
							<span
								className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ibeam hover:border-[var(--primary)]"
								style={{
									backgroundColor: 'var(--bg-mantle)',
									color: 'var(--subtext)',
									borderColor: 'var(--overlay)',
								}}
							>
								...
							</span>
						</Tooltip>
					)}
				</div>
			</div>
		</Link>
	)
}
