import {
	IconUsers,
	IconUser,
	IconMail,
	IconBrandLinkedin,
	IconBrandGithub,
} from '@tabler/icons-react'
import { copyEmail } from '@/components/ui/Toast'
import TeamMemberCard from './TeamMemberCard'
import Site from '@/lib/config'
import type { ExperienceManager, TeamMember } from '@/data/experience'

interface Props {
	manager?: ExperienceManager
	team?: TeamMember[]
	accentColor: string
}

export default function TeamSection({ manager, team, accentColor }: Props) {
	return (
		<>
			{/* Manager */}
			{manager && (
				<section>
					<h2
						className="flex items-center gap-2 text-lg font-bold mb-4"
						style={{ color: 'var(--text)' }}
					>
						<IconUser size={18} color={accentColor} />
						Managed By
					</h2>
					<div
						className="rounded-xl border p-4 flex items-center gap-4"
						style={{
							backgroundColor: 'var(--bg-surface)',
							borderColor: 'var(--overlay)',
						}}
					>
						{/* Avatar placeholder */}
						<div
							className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
							style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
						>
							{manager.name.charAt(0)}
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
								{manager.name}
							</p>
							<p className="text-xs mt-0.5" style={{ color: 'var(--subtext)' }}>
								{manager.title}
							</p>
							{/* Social links */}
							<div className="flex items-center gap-3 mt-2">
								{manager.email && (
									<button
										onClick={() => copyEmail(manager.email!)}
										className="flex items-center gap-1 text-xs transition-colors duration-150"
										style={{
											background: 'none',
											border: 'none',
											padding: 0,
											cursor: 'pointer',
											color: 'var(--subtext)',
											fontFamily: 'inherit',
										}}
										onMouseEnter={(e) =>
											(e.currentTarget.style.color = accentColor)
										}
										onMouseLeave={(e) =>
											(e.currentTarget.style.color = 'var(--subtext)')
										}
									>
										<IconMail size={13} /> Email
									</button>
								)}
								{manager.linkedin && (
									<a
										href={manager.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1 text-xs transition-colors duration-150"
										style={{ color: 'var(--subtext)' }}
										onMouseEnter={(e) =>
											(e.currentTarget.style.color = '#0077b5')
										}
										onMouseLeave={(e) =>
											(e.currentTarget.style.color = 'var(--subtext)')
										}
									>
										<IconBrandLinkedin size={13} /> LinkedIn
									</a>
								)}
								{manager.github && (
									<a
										href={manager.github}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1 text-xs transition-colors duration-150"
										style={{ color: 'var(--subtext)' }}
										onMouseEnter={(e) =>
											(e.currentTarget.style.color = 'var(--text)')
										}
										onMouseLeave={(e) =>
											(e.currentTarget.style.color = 'var(--subtext)')
										}
									>
										<IconBrandGithub size={13} /> GitHub
									</a>
								)}
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Team */}
			{team && team.length > 0 && (
				<section>
					<h2
						className="flex items-center gap-2 text-lg font-bold mb-4"
						style={{ color: 'var(--text)' }}
					>
						<IconUsers size={18} color={accentColor} />
						Team
						<span
							className="text-xs px-2 py-0.5 rounded font-mono ml-1"
							style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
						>
							{team.length} member{team.length !== 1 ? 's' : ''}
						</span>
					</h2>

					{/* Position summary */}
					<div className="mb-3 flex flex-wrap gap-2">
						{Object.entries(
							team.reduce<Record<string, number>>((acc, m) => {
								acc[m.position] = (acc[m.position] ?? 0) + 1
								return acc
							}, {})
						).map(([position, count]) => (
							<span
								key={position}
								className="text-xs px-2 py-0.5 rounded border font-mono"
								style={{ borderColor: 'var(--overlay)', color: 'var(--subtext)' }}
							>
								{count}x {position}
							</span>
						))}
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{team.map((member, i) => (
							<TeamMemberCard key={i} member={member} accentColor={accentColor} isSelf={member.name === Site.fullName} />
						))}
					</div>
				</section>
			)}
		</>
	)
}
