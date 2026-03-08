import {
	IconBrandGithub,
	IconBrandLinkedin,
	IconBrandTelegram,
	IconClock,
} from '@tabler/icons-react'
import Site from '@/lib/config'
import Container from '@/components/ui/Container'
import EmailCopyButton from '@/components/ui/EmailCopyButton'
import { useSiteTimer } from '@/lib/hooks/useSiteTimer'

const socialLinks = [
	{ href: Site.socials.github, label: 'GitHub', Icon: IconBrandGithub },
	{ href: Site.socials.linkedin, label: 'LinkedIn', Icon: IconBrandLinkedin },
	{ href: Site.socials.telegram, label: 'Telegram', Icon: IconBrandTelegram },
]

export default function Footer() {
	const year = new Date().getFullYear()
	const timerRef = useSiteTimer()

	return (
		<footer className="hidden lg:block mb-4 mt-8">
			<Container>
				<div
					className="flex flex-col items-center justify-between gap-4 rounded-xl border p-5 text-sm md:flex-row md:gap-0"
					style={{
						backgroundColor: 'var(--bg-crust)',
						borderColor: 'var(--overlay)',
						color: 'var(--subtext)',
					}}
				>
					<span className="whitespace-nowrap font-mono">
						© {year} {Site.fullName}
					</span>

					<div className="flex items-center gap-3">
						<div
							className="flex items-center gap-1.5"
							title="Total visit time"
						>
							<IconClock size={14} style={{ color: 'var(--subtext)' }} />
							<span
								ref={timerRef}
								className="font-mono text-xs"
								style={{ color: 'var(--primary)' }}
							>
								00:00
							</span>
						</div>

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
							className="hover:text-[var(--primary)]"
						/>
					</div>
				</div>
			</Container>
		</footer>
	)
}
