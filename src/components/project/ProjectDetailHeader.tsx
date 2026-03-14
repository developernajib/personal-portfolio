import { Link } from 'react-router-dom'
import {
	IconArrowLeft,
	IconExternalLink,
	IconBrandGithub,
	IconCalendarEvent,
} from '@tabler/icons-react'
import TagBadge from '@/components/ui/TagBadge'
import { formatDate, isValidHttpUrl } from '@/lib/utils'
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

				<div className="flex items-center gap-3 mb-4">
					<div
						className="flex items-center gap-1.5 text-xs"
						style={{ color: 'var(--subtext)' }}
					>
						<IconCalendarEvent size={13} />
						{formatDate(project.date)}
					</div>
				</div>

				<div className="flex flex-wrap gap-2 mb-5">
					{project.liveUrl && isValidHttpUrl(project.liveUrl) && (
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
					{project.githubUrl && isValidHttpUrl(project.githubUrl) && (
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

				<div className="flex flex-wrap gap-1.5">
					{project.tags.map((tag) => (
						<TagBadge key={tag} tag={tag} />
					))}
				</div>
			</div>
		</>
	)
}
