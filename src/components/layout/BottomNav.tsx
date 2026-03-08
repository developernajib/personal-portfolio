import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
	IconDots,
	IconBrandGithub,
	IconBrandLinkedin,
	IconBrandTelegram,
	IconClock,
	IconSun,
	IconMoon,
	IconX,
} from '@tabler/icons-react'
import { bottomNavItems, moreNavItems } from '@/data/navItems'
import { useTheme } from '@/lib/useTheme'
import { useSiteTimer } from '@/lib/hooks/useSiteTimer'
import Site from '@/lib/config'
import EmailCopyButton from '@/components/ui/EmailCopyButton'

const socialLinks = [
	{ href: Site.socials.github, label: 'GitHub', Icon: IconBrandGithub },
	{ href: Site.socials.linkedin, label: 'LinkedIn', Icon: IconBrandLinkedin },
	{ href: Site.socials.telegram, label: 'Telegram', Icon: IconBrandTelegram },
]

export default function BottomNav() {
	const [drawerOpen, setDrawerOpen] = useState(false)
	const location = useLocation()
	const { theme, toggle } = useTheme()
	const timerRef = useSiteTimer()
	const year = new Date().getFullYear()
	const drawerRef = useRef<HTMLDivElement>(null)

	// Close drawer on route change
	useEffect(() => {
		setDrawerOpen(false)
	}, [location.pathname])

	// Close drawer on escape key
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setDrawerOpen(false)
		}
		if (drawerOpen) {
			document.addEventListener('keydown', onKey)
			return () => document.removeEventListener('keydown', onKey)
		}
	}, [drawerOpen])

	// Check if "More" section has any active route
	const isMoreActive = moreNavItems.some(
		(item) => location.pathname === item.href || location.pathname.startsWith(item.href + '/')
	)

	return (
		<>
			{/* Overlay */}
			{drawerOpen && (
				<div
					className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
					style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
					onClick={() => setDrawerOpen(false)}
				/>
			)}

			{/* Drawer */}
			<div
				ref={drawerRef}
				className="fixed left-0 right-0 z-50 lg:hidden transition-transform duration-300 ease-out"
				style={{
					bottom: 0,
					transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
				}}
			>
				<div
					className="mx-3 mb-[calc(5rem+env(safe-area-inset-bottom,0px))] rounded-2xl border p-4 shadow-2xl"
					style={{
						backgroundColor: 'color-mix(in srgb, var(--bg-surface) 50%, transparent)',
						borderColor: 'color-mix(in srgb, var(--primary) 18%, transparent)',
						backdropFilter: 'blur(24px) saturate(180%)',
						WebkitBackdropFilter: 'blur(24px) saturate(180%)',
						boxShadow:
							'0 -12px 40px rgba(0,0,0,0.25), 0 0 0 1px color-mix(in srgb, var(--primary) 15%, transparent), inset 0 1px 0 color-mix(in srgb, var(--text) 8%, transparent), inset 0 0 32px rgba(var(--primary-rgb, 0,213,217), 0.04)',
					}}
				>
					{/* Drawer header */}
					<div className="flex items-center justify-between mb-4">
						<span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
							More
						</span>
						<button
							onClick={() => setDrawerOpen(false)}
							aria-label="Close menu"
							className="p-1.5 rounded-lg transition-colors duration-150"
							style={{
								color: 'var(--subtext)',
								backgroundColor:
									'color-mix(in srgb, var(--overlay) 30%, transparent)',
							}}
						>
							<IconX size={16} />
						</button>
					</div>

					{/* Secondary nav links */}
					<div className="flex gap-2 mb-4">
						{moreNavItems.map((item) => {
							const Icon = item.icon
							return (
								<NavLink
									key={item.href}
									to={item.href}
									className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200"
									style={({ isActive }) => ({
										color: isActive ? 'var(--primary)' : 'var(--subtext)',
										backgroundColor: isActive
											? 'rgba(var(--primary-rgb, 0,213,217),0.12)'
											: 'color-mix(in srgb, var(--bg-mantle) 60%, transparent)',
										border: isActive
											? '1px solid rgba(var(--primary-rgb, 0,213,217),0.2)'
											: '1px solid transparent',
									})}
								>
									{Icon && <Icon size={20} stroke={1.5} />}
									<span className="text-xs font-medium">{item.title}</span>
								</NavLink>
							)
						})}
					</div>

					{/* Divider */}
					<div
						className="h-px mb-4"
						style={{
							backgroundColor: 'color-mix(in srgb, var(--overlay) 50%, transparent)',
						}}
					/>

					{/* Theme toggle */}
					<button
						onClick={(e) => {
							toggle(e)
						}}
						className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-mono font-medium mb-4 transition-all duration-200"
						style={{
							color: 'var(--primary)',
							backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.08)',
							border: '1px solid rgba(var(--primary-rgb, 0,213,217),0.2)',
						}}
					>
						{theme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
						{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
					</button>

					{/* Social links + timer */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1">
							{socialLinks.map(({ href, label, Icon }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={label}
									className="p-2 rounded-lg"
									style={{ color: 'var(--subtext)' }}
								>
									<Icon size={18} stroke={1.5} />
								</a>
							))}
							<EmailCopyButton
								email={Site.socials.email}
								size={18}
								style={{ color: 'var(--subtext)' }}
								className="p-2 rounded-lg"
							/>
						</div>
						<div className="flex items-center gap-1.5" title="Time on site">
							<IconClock size={13} style={{ color: 'var(--subtext)' }} />
							<span ref={timerRef} className="font-mono text-xs" style={{ color: 'var(--primary)' }}>
								00:00
							</span>
						</div>
					</div>

					{/* Copyright */}
					<div className="mt-3 text-center">
						<span className="text-xs font-mono" style={{ color: 'var(--subtext)' }}>
							© {year} {Site.fullName}
						</span>
					</div>
				</div>
			</div>

			{/* Floating bottom nav bar — glass morphism */}
			<div
				className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-3"
				style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
			>
				<nav
					className="rounded-2xl border shadow-2xl"
					style={{
						backgroundColor: 'color-mix(in srgb, var(--bg-surface) 45%, transparent)',
						borderColor: 'color-mix(in srgb, var(--primary) 18%, transparent)',
						backdropFilter: 'blur(24px) saturate(180%)',
						WebkitBackdropFilter: 'blur(24px) saturate(180%)',
						boxShadow:
							'0 -8px 32px rgba(0,0,0,0.2), 0 0 0 1px color-mix(in srgb, var(--primary) 12%, transparent), inset 0 1px 0 color-mix(in srgb, var(--text) 8%, transparent), inset 0 0 24px rgba(var(--primary-rgb, 0,213,217), 0.03)',
					}}
				>
					<div className="flex items-center justify-around px-1 h-[3.75rem]">
						{bottomNavItems.map((item) => {
							const Icon = item.icon
							return (
								<NavLink
									key={item.href}
									to={item.href}
									end={item.href === '/'}
									className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all duration-200 relative"
									style={({ isActive }) => ({
										color: isActive ? 'var(--primary)' : 'var(--subtext)',
									})}
								>
									{({ isActive }) => (
										<>
											{/* Active indicator dot */}
											{isActive && (
												<span
													className="absolute -top-0.5 w-1 h-1 rounded-full"
													style={{ backgroundColor: 'var(--primary)' }}
												/>
											)}
											{Icon && <Icon size={21} stroke={isActive ? 2 : 1.5} />}
											<span className="text-[10px] font-medium leading-none mt-0.5">
												{item.title}
											</span>
										</>
									)}
								</NavLink>
							)
						})}

						{/* More button */}
						<button
							onClick={() => setDrawerOpen((v) => !v)}
							className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all duration-200 relative"
							style={{
								color:
									drawerOpen || isMoreActive
										? 'var(--primary)'
										: 'var(--subtext)',
							}}
						>
							{(drawerOpen || isMoreActive) && (
								<span
									className="absolute -top-0.5 w-1 h-1 rounded-full"
									style={{ backgroundColor: 'var(--primary)' }}
								/>
							)}
							<IconDots size={21} stroke={drawerOpen || isMoreActive ? 2 : 1.5} />
							<span className="text-[10px] font-medium leading-none mt-0.5">
								More
							</span>
						</button>
					</div>
				</nav>
			</div>
		</>
	)
}
