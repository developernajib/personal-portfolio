import { Link } from 'react-router-dom'
import { IconArrowLeft, IconCalendarEvent } from '@tabler/icons-react'
import TagBadge from '@/components/ui/TagBadge'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/data/projects'

interface Props {
	project: Project
}

export default function ProjectDetailHeader({ project }: Props) {
	return (
		<>
			<Link
				to="/projects"
				className="hover-primary mb-6 inline-flex items-center gap-1.5 text-sm"
				style={{ color: 'var(--subtext)' }}
			>
				<IconArrowLeft size={16} />
				All Projects
			</Link>

			<div className="mb-6">
				<h1 className="text-xl font-bold mb-2 sm:text-2xl" style={{ color: 'var(--text)' }}>
					{project.title}
				</h1>

				{project.date && (
					<div className="flex items-center gap-3 mb-4">
						<div
							className="flex items-center gap-1.5 text-xs"
							style={{ color: 'var(--subtext)' }}
						>
							<IconCalendarEvent size={13} />
							{formatDate(project.date)}
						</div>
					</div>
				)}

				<div className="flex flex-wrap gap-1.5">
					{project.tags.map((tag) => (
						<TagBadge key={tag} tag={tag} />
					))}
				</div>
			</div>
		</>
	)
}
