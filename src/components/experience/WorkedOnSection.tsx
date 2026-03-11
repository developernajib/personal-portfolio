import { IconBriefcase, IconExternalLink } from '@tabler/icons-react'
import TagBadge from '@/components/ui/TagBadge'
import { isValidHttpUrl } from '@/lib/utils'
import type { ExperienceProject } from '@/data/experience'

interface Props {
	projects: ExperienceProject[]
	accentColor: string
}

export default function WorkedOnSection({ projects, accentColor }: Props) {
	if (projects.length === 0) return null

	return (
		<section>
			<h2
				className="flex items-center gap-2 text-lg font-bold mb-4"
				style={{ color: 'var(--text)' }}
			>
				<IconBriefcase size={18} color={accentColor} />
				What I Worked On
			</h2>
			<div className="space-y-3">
				{projects.map((project, i) => (
					<div
						key={i}
						className="rounded-xl border p-4 transition-colors duration-150"
						style={{
							backgroundColor: 'var(--bg-surface)',
							borderColor: 'var(--overlay)',
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.borderColor = `${accentColor}60`)
						}
						onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--overlay)')}
					>
						<div className="flex items-start justify-between gap-3 mb-2">
							<div>
								<h3
									className="font-semibold text-sm"
									style={{ color: 'var(--text)' }}
								>
									{project.name}
								</h3>
								<span
									className="text-xs px-1.5 py-0.5 rounded font-mono"
									style={{
										backgroundColor: `${accentColor}12`,
										color: accentColor,
									}}
								>
									{project.purpose}
								</span>
							</div>
							{project.url && isValidHttpUrl(project.url) && (
								<a
									href={project.url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex-shrink-0 transition-colors duration-150"
									style={{ color: 'var(--subtext)' }}
									onMouseEnter={(e) =>
										(e.currentTarget.style.color = accentColor)
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = 'var(--subtext)')
									}
								>
									<IconExternalLink size={15} />
								</a>
							)}
						</div>
						<p
							className="text-xs leading-relaxed mb-3"
							style={{ color: 'var(--subtext)' }}
						>
							{project.description}
						</p>
						<div className="flex flex-wrap gap-1">
							{project.tags.map((tag) => (
								<TagBadge key={tag} tag={tag} />
							))}
						</div>
					</div>
				))}
			</div>
			<p className="text-xs mt-3" style={{ color: 'var(--subtext)', fontStyle: 'italic' }}>
				* Some projects cannot be disclosed due to confidentiality and other reasons.
			</p>
		</section>
	)
}
