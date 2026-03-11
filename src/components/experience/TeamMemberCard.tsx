import { useState } from 'react'
import { IconMail, IconBrandLinkedin, IconBrandGithub, IconX } from '@tabler/icons-react'
import { copyEmail } from '@/components/ui/Toast'
import type { TeamMember } from '@/data/experience'

interface Props {
	member: TeamMember
	accentColor: string
}

export default function TeamMemberCard({ member, accentColor }: Props) {
	const [photoOpen, setPhotoOpen] = useState(false)

	return (
		<>
			<div
				className="rounded-xl border p-4 flex items-center gap-3 transition-colors duration-150"
				style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
				onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${accentColor}50`)}
				onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--overlay)')}
			>
				{/* Avatar */}
				{member.photo ? (
					<button
						className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 transition-opacity duration-150 hover:opacity-80"
						style={{ borderColor: `${accentColor}60`, cursor: 'zoom-in' }}
						onClick={() => setPhotoOpen(true)}
						title="View photo"
					>
						<img
							src={member.photo}
							alt={member.name}
							className="w-full h-full object-cover"
						/>
					</button>
				) : (
					<div
						className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
						style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
					>
						{member.name.charAt(0)}
					</div>
				)}

				<div className="flex-1 min-w-0">
					<p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
						{member.name}
					</p>
					<p className="text-xs truncate" style={{ color: 'var(--subtext)' }}>
						{member.position}
					</p>
					{/* Socials */}
					<div className="flex items-center gap-3 mt-1.5">
						{member.email && (
							<button
								onClick={() => copyEmail(member.email!)}
								className="transition-colors duration-150"
								style={{
									background: 'none',
									border: 'none',
									padding: 0,
									cursor: 'pointer',
									color: 'var(--subtext)',
									fontFamily: 'inherit',
								}}
								onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
								onMouseLeave={(e) =>
									(e.currentTarget.style.color = 'var(--subtext)')
								}
								title="Copy email"
							>
								<IconMail size={13} />
							</button>
						)}
						{member.linkedin && (
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
								title="LinkedIn"
							>
								<IconBrandLinkedin size={13} />
							</a>
						)}
						{member.github && (
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
								title="GitHub"
							>
								<IconBrandGithub size={13} />
							</a>
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
