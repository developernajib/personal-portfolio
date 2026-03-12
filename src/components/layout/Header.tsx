import { NavLink, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { mainNavItems } from '@/data/navItems'
import Container from '@/components/ui/Container'
import { useTheme } from '@/lib/useTheme'
import { experience } from '@/data/experience'
import { projects } from '@/data/projects'

/* Module-level lookup maps — built once, O(1) access vs O(n) find() */
const experienceById = Object.fromEntries(experience.map((e) => [e.id, e.role]))
const projectsBySlug = Object.fromEntries(projects.map((p) => [p.slug, p.title]))

function resolveLabel(part: string, parentPart?: string): string {
	if (parentPart === 'experience') return experienceById[part] ?? part.replace(/-/g, ' ')
	if (parentPart === 'projects') return projectsBySlug[part] ?? part.replace(/-/g, ' ')
	return part.replace(/-/g, ' ')
}

export default function Header() {
	const location = useLocation()
	const { theme, toggle } = useTheme()

	const breadcrumb = useMemo(() => {
		const pathParts = location.pathname.split('/').filter(Boolean)
		return [
			{ label: '~', href: '/' },
			...pathParts.map((part, i) => ({
				label: resolveLabel(part, pathParts[i - 1]),
				href: '/' + pathParts.slice(0, i + 1).join('/'),
			})),
		]
	}, [location.pathname])

	const isHome = breadcrumb.length === 1

	return (
		<header
			className="sticky top-0 z-30 select-none"
			style={{
				backdropFilter: 'blur(12px)',
				WebkitBackdropFilter: 'blur(12px)',
				maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
				WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
				paddingTop: '1.25rem',
				paddingBottom: '1.75rem',
			}}
		>
			<Container className="flex items-center justify-between">
				{/* Breadcrumb */}
				<div className="flex items-center text-sm md:text-base font-mono min-w-0 overflow-hidden">
					{breadcrumb.map((crumb, i) => (
						<span key={crumb.href} className="flex items-center cursor-pointer">
							{i > 0 && (
								<span className="mx-1" style={{ color: 'var(--subtext)' }}>
									/
								</span>
							)}
							{i === breadcrumb.length - 1 ? (
								<span
									className="truncate max-w-[45vw] sm:max-w-none inline-block"
									style={{ color: 'var(--primary)' }}
								>
									{crumb.label}
								</span>
							) : (
								<NavLink
									to={crumb.href}
									className="hover-opacity"
									style={{ color: 'var(--primary)' }}
								>
									{crumb.label}
								</NavLink>
							)}
						</span>
					))}
					{!isHome && (
						<span className="mx-1" style={{ color: 'var(--subtext)' }}>
							/
						</span>
					)}
					{isHome && (
						<span className="mx-1" style={{ color: 'var(--subtext)' }}>
							/
						</span>
					)}
					<span
						className="terminal-cursor"
						style={{ backgroundColor: 'var(--primary)' }}
					/>
				</div>

				{/* Right side */}
				<div className="flex items-center gap-0.5">
					{/* Desktop nav */}
					<nav className="hidden items-center lg:flex">
						{mainNavItems.map((item) => (
							<NavLink
								key={item.href}
								to={item.href}
								className="px-3 py-1.5 text-base transition-colors duration-150"
								style={({ isActive }) => ({
									color: isActive ? 'var(--primary)' : 'var(--subtext)',
								})}
								onMouseEnter={(e) => {
									e.currentTarget.style.color = 'var(--primary)'
									// Prefetch the page chunk on hover — fires the dynamic import
									// so the bundle is cached before the user clicks
									item.preload?.()
								}}
								onMouseLeave={(e) => {
									const isActive =
										e.currentTarget.getAttribute('aria-current') === 'page'
									e.currentTarget.style.color = isActive
										? 'var(--primary)'
										: 'var(--subtext)'
								}}
								end={item.href === '/'}
							>
								{item.title}
							</NavLink>
						))}
					</nav>

					{/* Theme toggle — hidden on mobile, available in BottomNav More drawer */}
					<button
						onClick={(e) => toggle(e)}
						className="ml-3 hidden lg:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-medium hover-bg-primary-up"
						style={{
							color: 'var(--primary)',
							backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
							border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)',
						}}
						aria-label="Toggle theme"
					>
						{theme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
						{theme === 'dark' ? 'Light' : 'Dark'}
					</button>
				</div>
			</Container>
		</header>
	)
}
