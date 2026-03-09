import { useState, useMemo } from 'react'
import Container from '@/components/ui/Container'
import { IconFolders } from '@tabler/icons-react'
import SlabTitle from '@/components/ui/SlabTitle'
import ProjectCard from '@/components/ui/ProjectCard'
import TagBadge from '@/components/ui/TagBadge'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import { projects } from '@/data/projects'
import useDocTitle from '@/lib/hooks/useDocTitle'

export default function Projects() {
	useDocTitle('Projects')
	const [activeTag, setActiveTag] = useState<string | null>(null)

	// Collect all unique tags
	const allTags = useMemo(() => {
		const tags = new Set<string>()
		projects.forEach((p) => p.tags.forEach((t) => tags.add(t)))
		return Array.from(tags).sort()
	}, [])

	const filtered = activeTag ? projects.filter((p) => p.tags.includes(activeTag)) : projects

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10">
				<div className="mb-8 flex items-center gap-3">
					<IconFolders size={28} color="var(--primary)" />
					<SlabTitle title="Projects" config="4c" as="h1" />
				</div>

				{/* Tag filter */}
				{allTags.length > 0 && (
					<div className="mb-8 flex flex-wrap gap-2">
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
				)}

				{/* Project count */}
				<p className="mb-6 text-sm" style={{ color: 'var(--subtext)' }}>
					{filtered.length} project{filtered.length !== 1 ? 's' : ''}
					{activeTag ? ` tagged "${activeTag}"` : ''}
				</p>

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
