import { useState } from 'react'
import { IconMail, IconBrandLinkedin, IconBrandGithub, IconX } from '@tabler/icons-react'
import { copyEmail } from '@/components/ui/Toast'
import Tooltip from '@/components/ui/Tooltip'
import type { TeamMember } from '@/data/experience'

interface Props {
	member: TeamMember
	accentColor: string
	isSelf?: boolean
}

export default function TeamMemberCard({ member, accentColor, isSelf = false }: Props) {
	const [photoOpen, setPhotoOpen] = useState(false)

	return (
		<>
			<div
				className="rounded-xl border p-4 flex items-center gap-3 transition-colors duration-150"
				style={{
					backgroundColor: isSelf ? `${accentColor}0d` : 'var(--bg-surface)',
					borderColor: isSelf ? `${accentColor}50` : 'var(--overlay)',
				}}
				onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${accentColor}80`)}
				onMouseLeave={(e) =>
					(e.currentTarget.style.borderColor = isSelf
						? `${accentColor}50`
						: 'var(--overlay)')
				}
			>
				{/* Avatar */}
				{member.photo ? (
					<Tooltip content="View photo" position="top">
						<button
							className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 transition-opacity duration-150 hover:opacity-80"
							style={{ borderColor: `${accentColor}60` }}
							onClick={() => setPhotoOpen(true)}
						>
							<img
								src={member.photo}
								alt={member.name}
								className="w-full h-full object-cover"
							/>
						</button>
					</Tooltip>
				) : (
					<div
						className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
						style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
					>
						{member.name.charAt(0)}
					</div>
				)}

				<div className="flex-1 min-w-0">
					<p
						className="text-sm font-semibold flex items-center gap-1.5 min-w-0"
						style={{ color: 'var(--text)' }}
					>
						<span className="truncate">{member.name}</span>
						{isSelf && (
							<span
								className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-mono"
								style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
							>
								me
							</span>
						)}
					</p>
					<p className="text-xs truncate" style={{ color: 'var(--subtext)' }}>
						{member.position}
					</p>
					{/* Socials */}
					<div className="flex items-center gap-3 mt-1.5">
						{member.email && (
							<Tooltip content="Copy email" position="top">
								<button
									onClick={() => copyEmail(member.email!)}
									className="transition-colors duration-150 cursor-hand"
									style={{
										background: 'none',
										border: 'none',
										padding: 0,
										color: 'var(--subtext)',
										fontFamily: 'inherit',
									}}
									onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = 'var(--subtext)')
									}
								>
									<IconMail size={13} />
								</button>
							</Tooltip>
						)}
						{member.linkedin && (
							<Tooltip content="LinkedIn" position="top">
								<a
									href={member.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="transition-colors duration-150"
									style={{ color: 'var(--subtext)' }}
									onMouseEnter={(e) => (e.currentTarget.style.color = '#0077b5')}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = 'var(--subtext)')
									}
								>
									<IconBrandLinkedin size={13} />
								</a>
							</Tooltip>
						)}
						{member.github && (
							<Tooltip content="GitHub" position="top">
								<a
									href={member.github}
									target="_blank"
									rel="noopener noreferrer"
									className="transition-colors duration-150"
									style={{ color: 'var(--subtext)' }}
									onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = 'var(--subtext)')
									}
								>
									<IconBrandGithub size={13} />
								</a>
							</Tooltip>
						)}
					</div>
				</div>
			</div>

			{/* Photo popup */}
			{member.photo && photoOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center"
					style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
					onClick={() => setPhotoOpen(false)}
				>
					<button
						className="absolute top-4 right-4 p-2 rounded-full"
						style={{ color: 'var(--subtext)', backgroundColor: 'var(--bg-surface)' }}
						onClick={() => setPhotoOpen(false)}
					>
						<IconX size={20} />
					</button>
					<div
						className="flex flex-col items-center gap-3"
						onClick={(e) => e.stopPropagation()}
					>
						<img
							src={member.photo}
							alt={member.name}
							className="rounded-2xl object-cover shadow-2xl"
							style={{ maxWidth: '320px', maxHeight: '400px', width: '100%' }}
						/>
						<div className="text-center">
							<p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
								{member.name}
							</p>
							<p className="text-xs mt-0.5" style={{ color: 'var(--subtext)' }}>
								{member.position}
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
