import { IconExternalLink, IconBrandGithub } from '@tabler/icons-react'
import { isValidHttpUrl } from '@/lib/utils'
import type { Project } from '@/data/projects'

interface Props {
	project: Project
}

export default function ProjectLinks({ project }: Props) {
	const live = project.liveUrl && isValidHttpUrl(project.liveUrl) ? project.liveUrl : null
	const extras = (project.extraLiveUrls ?? []).filter((e) => isValidHttpUrl(e.url))
	const source = project.githubUrl && isValidHttpUrl(project.githubUrl) ? project.githubUrl : null

	if (!live && extras.length === 0 && !source) return null

	return (
		<div className="mt-8 flex flex-wrap gap-2">
			{live && (
				<a
					href={live}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium border hover-bg-primary-up"
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
			{extras.map((entry) => (
				<a
					key={entry.url}
					href={entry.url}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium border hover-bg-primary-up"
					style={{
						color: 'var(--primary)',
						borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.3)',
						backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.08)',
					}}
				>
					<IconExternalLink size={13} />
					{entry.label}
				</a>
			))}
			{source && (
				<a
					href={source}
					target="_blank"
					rel="noopener noreferrer"
					className="hover-primary hover-border-primary flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium border"
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
	)
}
