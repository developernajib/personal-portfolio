import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
	IconArrowLeft,
	IconExternalLink,
	IconBrandGithub,
	IconCalendarEvent,
	IconPhoto,
} from '@tabler/icons-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TagBadge from '@/components/ui/TagBadge'
import Container from '@/components/ui/Container'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import Lightbox from '@/components/ui/Lightbox'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import { projects } from '@/data/projects'
import { formatDate, thumb } from '@/lib/utils'
import useDocTitle from '@/lib/hooks/useDocTitle'

export default function ProjectDetail() {
	const { slug } = useParams<{ slug: string }>()
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
	const [heroError, setHeroError] = useState(false)
	const [thumbErrors, setThumbErrors] = useState<Set<number>>(new Set())
	const project = projects.find((p) => p.slug === slug)
	useDocTitle(project?.title)

	if (!project) {
		return (
			<Container className="py-16 text-center">
				<p className="text-lg mb-4" style={{ color: 'var(--subtext)' }}>
					Project not found.
				</p>
				<Link
					to="/projects"
					className="flex items-center justify-center gap-1.5 text-sm transition-colors duration-150"
					style={{ color: 'var(--primary)' }}
				>
					<IconArrowLeft size={16} />
					Back to Projects
				</Link>
			</Container>
		)
	}

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10">
				{/* Back */}
				<Link
					to="/projects"
					className="hover-primary mb-6 inline-flex items-center gap-1.5 text-sm"
					style={{ color: 'var(--subtext)' }}
				>
					<IconArrowLeft size={16} />
					All Projects
				</Link>

				{/* Header */}
				<div className="mb-6">
					<h1
						className="text-xl font-bold mb-2 sm:text-2xl"
						style={{ color: 'var(--text)' }}
					>
						{project.title}
					</h1>

					<div className="flex items-center gap-3 mb-4">
						<div
							className="flex items-center gap-1.5 text-xs"
							style={{ color: 'var(--subtext)' }}
						>
							<IconCalendarEvent size={13} />
							{formatDate(project.date)}
						</div>
					</div>

					{/* Links */}
					<div className="flex flex-wrap gap-2 mb-5">
						{project.liveUrl && (
							<a
								href={project.liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border hover-bg-primary-up"
								style={{
									color: 'var(--primary)',
									borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.3)',
									backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.08)',
								}}
							>
								<IconExternalLink size={13} />
								Live Demo
							</a>
						)}
						{project.githubUrl && (
							<a
								href={project.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="hover-primary hover-border-primary flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border"
								style={{
									color: 'var(--subtext)',
									borderColor: 'var(--overlay)',
									backgroundColor: 'var(--bg-surface)',
								}}
							>
								<IconBrandGithub size={13} stroke={1.5} />
								Source Code
							</a>
						)}
					</div>

					{/* Tags */}
					<div className="flex flex-wrap gap-1.5">
						{project.tags.map((tag) => (
							<TagBadge key={tag} tag={tag} />
						))}
					</div>
				</div>

				{/* Hero image — eager load since it's above the fold on this page */}
				{project.image && (
					<div
						className="mb-8 overflow-hidden rounded-xl border"
						style={{ borderColor: 'var(--overlay)' }}
					>
						{!heroError ? (
							<img
								src={project.image}
								alt={project.title}
								className="w-full object-cover"
								fetchPriority="high"
								onError={() => setHeroError(true)}
							/>
						) : (
							<div className="aspect-video">
								<ImagePlaceholder label="Image not found" />
							</div>
						)}
					</div>
				)}

				{/* Description */}
				<div
					className="rounded-xl border p-6"
					style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
				>
					{project.longDescription ? (
						<div
							className="prose prose-sm max-w-none"
							style={{ color: 'var(--subtext)' }}
						>
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{project.longDescription}
							</ReactMarkdown>
						</div>
					) : (
						<p className="text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
							{project.description}
						</p>
					)}
				</div>

				{/* Gallery — lazy load thumbnails */}
				{project.gallery && project.gallery.length > 0 && (
					<section className="space-y-4 mt-8">
						<div className="flex items-center gap-2">
							<IconPhoto size={18} color="var(--primary)" />
							<h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
								Screenshots
							</h2>
						</div>
						<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
							{project.gallery.map((item, i) => (
								<button
									key={i}
									onClick={() => setLightboxIndex(i)}
									className="hover-border-primary group relative aspect-video overflow-hidden rounded-lg border"
									style={{ borderColor: 'var(--overlay)' }}
								>
									{!thumbErrors.has(i) ? (
										<img
											src={thumb(item.src)}
											alt={item.caption ?? `Screenshot ${i + 1}`}
											className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
											loading="lazy"
											decoding="async"
											onError={() =>
												setThumbErrors((prev) => new Set(prev).add(i))
											}
										/>
									) : (
										<ImagePlaceholder />
									)}
								</button>
							))}
						</div>
					</section>
				)}
			</Container>

			{/* Lightbox — full-res src */}
			{lightboxIndex !== null && project.gallery && project.gallery.length > 0 && (
				<Lightbox
					items={project.gallery.map((g) => ({
						src: g.src,
						alt: g.caption ?? project.title,
						caption: g.caption,
					}))}
					currentIndex={lightboxIndex}
					onClose={() => setLightboxIndex(null)}
					onPrev={() =>
						setLightboxIndex((prev) =>
							prev !== null
								? (prev - 1 + project.gallery!.length) % project.gallery!.length
								: null
						)
					}
					onNext={() =>
						setLightboxIndex((prev) =>
							prev !== null ? (prev + 1) % project.gallery!.length : null
						)
					}
				/>
			)}
		</div>
	)
}
