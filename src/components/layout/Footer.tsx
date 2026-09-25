import { NavLink } from 'react-router-dom'
import {
	IconBrandGithub,
	IconBrandLinkedin,
	IconBrandTelegram,
	IconArrowUp,
	IconClock,
} from '@tabler/icons-react'
import Site from '@/lib/config'
import Container from '@/components/ui/Container'
import EmailCopyButton from '@/components/ui/EmailCopyButton'
import Tooltip from '@/components/ui/Tooltip'
import { useSiteTimer } from '@/lib/hooks/useSiteTimer'

const socialLinks = [
	{ href: Site.socials.github, label: 'GitHub', Icon: IconBrandGithub },
	{ href: Site.socials.linkedin, label: 'LinkedIn', Icon: IconBrandLinkedin },
	{ href: Site.socials.telegram, label: 'Telegram', Icon: IconBrandTelegram },
]

const quickLinks = [
	{ to: '/projects', label: 'Projects' },
	{ to: '/experience', label: 'Experience' },
	{ to: '/technologies', label: 'Technologies' },
	{ to: '/about', label: 'About' },
]

export default function Footer() {
	const year = new Date().getFullYear()
	const timerRef = useSiteTimer()

	return (
		<footer className="hidden lg:block mb-4 mt-8">
			<Container>
				<div
					className="flex flex-col items-center justify-between gap-4 rounded-xl border p-5 text-sm lg:flex-row lg:gap-3"
					style={{
						backgroundColor: 'var(--bg-crust)',
						borderColor: 'var(--overlay)',
						borderTop: '2px solid var(--primary)',
						color: 'var(--subtext)',
					}}
				>
					<span className="whitespace-nowrap font-mono text-xs">
						© {year} {Site.fullName} · {Site.location.city}, {Site.location.country}
					</span>

					<nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
						{quickLinks.map(({ to, label }) => (
							<NavLink
								key={to}
								to={to}
								className="hover-primary font-mono"
								style={({ isActive }) => ({
									color: isActive ? 'var(--primary)' : undefined,
									textDecoration: isActive ? 'underline' : 'none',
									textUnderlineOffset: '4px',
									textDecorationThickness: '2px',
								})}
							>
								{label}
							</NavLink>
						))}
					</nav>

					<div className="flex items-center gap-3">
						<Tooltip content="Total visit time" position="top">
							<div className="flex items-center gap-1.5">
								<IconClock size={14} style={{ color: 'var(--primary)' }} />
								<span
									ref={timerRef}
									className="font-mono text-xs"
									style={{ color: 'var(--primary)' }}
								>
									00:00
								</span>
							</div>
						</Tooltip>

						<span style={{ color: 'var(--overlay)' }}>-</span>

						{socialLinks.map(({ href, label, Icon }) => (
							<a
								key={label}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={label}
								className="hover-primary"
								style={{ color: 'var(--subtext)' }}
							>
								<Icon size={18} stroke={1.5} />
							</a>
						))}
						<EmailCopyButton
							email={Site.socials.email}
							size={18}
							style={{ color: 'var(--subtext)' }}
							className="hover-primary"
						/>

						<span style={{ color: 'var(--overlay)' }}>-</span>

						<Tooltip content="Back to top" position="top">
							<button
								onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
								aria-label="Back to top"
								className="hover-primary"
								style={{ color: 'var(--subtext)' }}
							>
								<IconArrowUp size={18} stroke={1.5} />
							</button>
						</Tooltip>
					</div>
				</div>
			</Container>
		</footer>
	)
}
