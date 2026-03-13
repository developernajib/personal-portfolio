import {
	IconBrandGithub,
	IconBrandLinkedin,
	IconBrandTelegram,
	IconMail,
	IconCode,
	IconBriefcase,
	IconUser,
} from '@tabler/icons-react'
import Container from '@/components/ui/Container'
import SlabTitle from '@/components/ui/SlabTitle'
import ExperienceTimeline from '@/components/ui/ExperienceTimeline'
import TagBadge from '@/components/ui/TagBadge'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import { experience } from '@/data/experience'
import { technologies } from '@/data/technologies'
import Site from '@/lib/config'
import { copyEmail } from '@/components/ui/Toast'
import useDocTitle from '@/lib/hooks/useDocTitle'

const SKILL_CATEGORY_ORDER = ['Language', 'Frontend', 'Backend', 'Database', 'DevOps'] as const

const skillCategories = SKILL_CATEGORY_ORDER.map((cat) => ({
	label: cat,
	skills: technologies.filter((t) => t.category === cat).map((t) => t.name),
})).filter((cat) => cat.skills.length > 0)

export default function About() {
	useDocTitle('About Me')
	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10 space-y-10">
				{/* About Me */}
				<section className="space-y-6">
					<div className="mb-8 flex items-center gap-3">
						<IconUser size={28} color="var(--primary)" />
						<SlabTitle title="About Me" config="4c 4c" as="h1" />
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{/* Avatar */}
						<div className="md:col-span-1">
							<img
								src={Site.image}
								alt={Site.fullName}
								className="h-full w-full max-h-72 sm:max-h-none rounded-md object-cover shadow-lg transition-transform duration-300 hover:scale-[1.02]"
								onError={(e) => {
									const t = e.currentTarget as HTMLImageElement
									t.src = 'https://avatars.githubusercontent.com/u/82390004'
								}}
							/>
						</div>

						{/* Bio prose */}
						<div className="space-y-4 md:col-span-2">
							<p
								className="text-base leading-relaxed"
								style={{ color: 'var(--subtext)' }}
							>
								<b style={{ color: 'var(--text)' }}>Hey!</b> I'm{' '}
								<a
									href={Site.socials.github}
									target="_blank"
									rel="noopener noreferrer"
									className="link"
								>
									{Site.fullName}
								</a>
								{`, a Software Engineer II based in ${Site.location.city}, ${Site.location.country}. I have 3`}
								years of full-stack experience, and I'm now focused on building
								scalable, high-performance systems with{' '}
								<a
									href="https://go.dev"
									target="_blank"
									rel="noopener noreferrer"
									className="link"
								>
									Go
								</a>
								. When I'm not working, I'm usually hacking on{' '}
								<a href="/projects" className="link">
									side projects
								</a>
								.
							</p>

							<p
								className="text-base leading-relaxed"
								style={{ color: 'var(--subtext)' }}
							>
								For 3 years I worked professionally with{' '}
								<a
									href="https://laravel.com"
									target="_blank"
									rel="noopener noreferrer"
									className="link"
								>
									Laravel
								</a>
								,{' '}
								<a
									href="https://react.dev"
									target="_blank"
									rel="noopener noreferrer"
									className="link"
								>
									React
								</a>
								, and{' '}
								<a
									href="https://www.typescriptlang.org"
									target="_blank"
									rel="noopener noreferrer"
									className="link"
								>
									TypeScript
								</a>{' '}
								— now I'm fully transitioning to{' '}
								<a
									href="https://go.dev"
									target="_blank"
									rel="noopener noreferrer"
									className="link"
								>
									Go
								</a>
								. I've already shipped a few{' '}
								<a href="/projects" className="link">
									Go projects
								</a>{' '}
								and I'm actively looking to do more. I care about writing clean code
								that holds up in production and getting things right — not just
								getting them done. I believe the best engineers never stop
								questioning their assumptions, and that mindset drives everything I
								build. See my{' '}
								<a href="/experience" className="link">
									professional history
								</a>{' '}
								for the full picture.
							</p>

							<p
								className="text-base leading-relaxed"
								style={{ color: 'var(--subtext)' }}
							>
								I care deeply about writing clean, maintainable, and
								production-ready code that actually scales. If you want to work
								together or just want to say hi, feel free to{' '}
								<button
									onClick={() => copyEmail(Site.socials.email)}
									className="link"
									style={{
										border: 'none',
										padding: '0 2px',
										cursor: 'pointer',
										fontFamily: 'inherit',
										fontSize: 'inherit',
									}}
								>
									shoot me an email
								</button>{' '}
								or{' '}
								<a
									href={Site.socials.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="link"
								>
									ping me on LinkedIn
								</a>
								.
							</p>

							{/* Social links */}
							<div
								className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2"
								style={{ color: 'var(--subtext)' }}
							>
								<a
									href={Site.socials.github}
									target="_blank"
									rel="noopener noreferrer"
									className="hover-primary inline-flex items-center gap-1.5 text-sm"
									style={{ color: 'var(--subtext)' }}
								>
									<IconBrandGithub size={16} stroke={1.5} />
									GitHub
								</a>

								<span style={{ color: 'var(--overlay)' }}>*</span>

								<a
									href={Site.socials.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="hover-primary inline-flex items-center gap-1.5 text-sm"
									style={{ color: 'var(--subtext)' }}
								>
									<IconBrandLinkedin size={16} stroke={1.5} />
									LinkedIn
								</a>

								<span style={{ color: 'var(--overlay)' }}>*</span>

								<a
									href={Site.socials.telegram}
									target="_blank"
									rel="noopener noreferrer"
									className="hover-primary inline-flex items-center gap-1.5 text-sm"
									style={{ color: 'var(--subtext)' }}
								>
									<IconBrandTelegram size={16} stroke={1.5} />
									Telegram
								</a>

								<span style={{ color: 'var(--overlay)' }}>*</span>

								<button
									onClick={() => copyEmail(Site.socials.email)}
									className="hover-primary inline-flex items-center gap-1.5 text-sm"
									style={{
										background: 'none',
										border: 'none',
										padding: 0,
										cursor: 'pointer',
										color: 'var(--subtext)',
										fontFamily: 'inherit',
									}}
								>
									<IconMail size={16} stroke={1.5} />
									Email
								</button>
							</div>
						</div>
					</div>
				</section>

				{/* Skills */}
				<section>
					<h2
						className="flex items-center gap-2 text-xl font-bold mb-5"
						style={{ color: 'var(--text)' }}
					>
						<IconCode size={20} color="var(--primary)" />
						Skills & Technologies
					</h2>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{skillCategories.map((cat) => (
							<div
								key={cat.label}
								className="rounded-xl border p-4"
								style={{
									backgroundColor: 'var(--bg-surface)',
									borderColor: 'var(--overlay)',
								}}
							>
								<p
									className="text-xs font-semibold mb-3"
									style={{ color: 'var(--primary)' }}
								>
									{cat.label}
								</p>
								<div className="flex flex-wrap gap-1.5">
									{cat.skills.map((skill) => (
										<TagBadge key={skill} tag={skill} />
									))}
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Experience Timeline */}
				<section>
					<h2
						className="flex items-center gap-2 text-xl font-bold mb-5"
						style={{ color: 'var(--text)' }}
					>
						<IconBriefcase size={20} color="var(--primary)" />
						Work Experience
					</h2>

					<ExperienceTimeline items={experience} />
				</section>

				{/* Contact */}
				<section
					className="rounded-xl border p-6 text-center"
					style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
				>
					<h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
						Get In Touch
					</h2>
					<p className="text-sm mb-5" style={{ color: 'var(--subtext)' }}>
						Whether you have a project in mind, a question, or just want to say hi — my
						inbox is always open.
					</p>
					<div className="flex flex-wrap justify-center gap-3">
						<button
							onClick={() => copyEmail(Site.socials.email)}
							className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover-bg-primary-up cursor-pointer"
							style={{
								color: 'var(--primary)',
								backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.1)',
								border: '1px solid rgba(var(--primary-rgb, 0,213,217),0.3)',
							}}
						>
							<IconMail size={15} />
							Say Hello
						</button>
						<a
							href={Site.socials.github}
							target="_blank"
							rel="noopener noreferrer"
							className="hover-primary hover-border-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border"
							style={{
								color: 'var(--subtext)',
								borderColor: 'var(--overlay)',
								backgroundColor: 'var(--bg-mantle)',
							}}
						>
							<IconBrandGithub size={15} stroke={1.5} />
							GitHub
						</a>
					</div>
				</section>
			</Container>
		</div>
	)
}
