import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Container from '@/components/ui/Container'
import { IconFolders, IconChevronDown } from '@tabler/icons-react'
import SlabTitle from '@/components/ui/SlabTitle'
import ProjectCard from '@/components/ui/ProjectCard'
import TagBadge from '@/components/ui/TagBadge'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import { projects } from '@/data/projects'
import { sortByOrder } from '@/lib/sort'
import useDocTitle from '@/lib/hooks/useDocTitle'

export default function Projects() {
	useDocTitle('Projects')
	const [searchParams] = useSearchParams()
	const [activeTag, setActiveTag] = useState<string | null>(null)
	const [expanded, setExpanded] = useState(false)
	const [canExpand, setCanExpand] = useState(false)
	const filterRef = useRef<HTMLDivElement>(null)

	// Collect all unique tags
	const allTags = useMemo(() => {
		const tags = new Set<string>()
		projects.forEach((p) => p.tags.forEach((t) => tags.add(t)))
		return Array.from(tags).sort()
	}, [])

	// Deep link support, e.g. /projects?tag=Go preselects the Go filter
	useEffect(() => {
		const requested = searchParams.get('tag')
		if (requested && allTags.includes(requested)) setActiveTag(requested)
	}, [searchParams, allTags])

	// Show the toggle only when the filter wraps past three rows
	useEffect(() => {
		if (expanded) return
		const el = filterRef.current
		if (el) setCanExpand(el.scrollHeight > el.clientHeight + 4)
	}, [allTags, expanded])

	const filtered = activeTag
		? sortByOrder(projects).filter((p) => p.tags.includes(activeTag))
		: sortByOrder(projects)

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10">
				<div className="mb-8 flex flex-wrap items-center gap-3">
					<IconFolders size={28} color="var(--primary)" />
					<SlabTitle title="Projects" config="4c" as="h1" />
					<span
						className="font-mono uppercase text-sm basis-full sm:basis-auto sm:ml-3 sm:self-end sm:pb-1"
						style={{ color: 'var(--subtext)' }}
					>
						{filtered.length} project{filtered.length !== 1 ? 's' : ''}
						{activeTag ? ` · ${activeTag}` : ''}
					</span>
				</div>

				{/* Tag filter */}
				{allTags.length > 0 && (
					<div className="mb-2">
						<div className="relative">
							<div
								ref={filterRef}
								className={`flex flex-wrap gap-2 ${expanded ? '' : 'max-h-24 overflow-hidden'}`}
							>
								<TagBadge
									tag="All"
									onClick={() => setActiveTag(null)}
									active={activeTag === null}
								/>
								{allTags.map((tag) => (
									<TagBadge
										key={tag}
										tag={tag}
										onClick={() => setActiveTag(activeTag === tag ? null : tag)}
										active={activeTag === tag}
									/>
								))}
							</div>
							{!expanded && canExpand && (
								<div
									className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
									style={{
										background:
											'linear-gradient(to top, var(--bg-base), transparent)',
									}}
								/>
							)}
						</div>
						{canExpand && (
							<button
								onClick={() => setExpanded((v) => !v)}
								className="hover-primary mt-2 mb-6 inline-flex items-center gap-1 text-xs font-medium"
								style={{ color: 'var(--subtext)' }}
							>
								{expanded ? 'See Less Filters' : 'See More Filters'}
								<IconChevronDown
									size={14}
									className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
								/>
							</button>
						)}
					</div>
				)}

				{filtered.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filtered.map((project) => (
							<ProjectCard key={project.slug} project={project} />
						))}
					</div>
				) : (
					<p style={{ color: 'var(--subtext)' }}>No projects found.</p>
				)}
			</Container>
		</div>
	)
}
