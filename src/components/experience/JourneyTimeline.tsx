import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconRoute } from '@tabler/icons-react'
import CompanyLogo from '@/components/ui/CompanyLogo'
import { formatDate, getDuration } from '@/lib/utils'
import { EXPERIENCE_TYPE_LABEL, EXPERIENCE_TYPE_COLOR } from '@/lib/constants'
import type { ExperienceItem } from '@/data/experience'

interface Props {
	items: ExperienceItem[]
}

export default function JourneyTimeline({ items }: Props) {
	const sectionRef = useRef<HTMLElement>(null)
	const railRef = useRef<HTMLDivElement>(null)
	const [progress, setProgress] = useState(0)
	const [visible, setVisible] = useState<Set<string>>(new Set())
	const [centers, setCenters] = useState<number[]>([])
	const [hovered, setHovered] = useState<string | null>(null)

	const ordered = useMemo(
		() => [...items].sort((a, b) => b.startDate.localeCompare(a.startDate)),
		[items]
	)

	const colors = useMemo(
		() => ordered.map((item) => EXPERIENCE_TYPE_COLOR[item.type] ?? 'var(--primary)'),
		[ordered]
	)

	// Rail gradient: each card owns the stretch around its dot,
	// shaded dark to light in that card color
	const railGradient = useMemo(() => {
		if (centers.length !== ordered.length || ordered.length === 0) return null
		const parts: string[] = []
		for (let i = 0; i < ordered.length; i++) {
			const start = i === 0 ? 0 : (centers[i - 1] + centers[i]) / 2
			const end = i === ordered.length - 1 ? 100 : (centers[i] + centers[i + 1]) / 2
			const c = colors[i]
			const dark = `color-mix(in srgb, ${c} 60%, black)`
			const light = `color-mix(in srgb, ${c} 60%, white)`
			parts.push(`${dark} ${start.toFixed(1)}%, ${light} ${end.toFixed(1)}%`)
		}
		return `linear-gradient(to bottom, ${parts.join(', ')})`
	}, [centers, ordered, colors])

	// Measure each node center as a percent of the rail track
	useEffect(() => {
		function measure() {
			const rail = railRef.current
			if (!rail) return
			const trackTop = 8
			const trackHeight = rail.clientHeight - 16
			if (trackHeight <= 0) return
			const railRect = rail.getBoundingClientRect()
			const nodes = rail.querySelectorAll<HTMLElement>('[data-node]')
			setCenters(
				Array.from(nodes).map((n) => {
					const r = n.getBoundingClientRect()
					const dotY = r.top - railRect.top + 28
					return Math.min(100, Math.max(0, ((dotY - trackTop) / trackHeight) * 100))
				})
			)
		}
		measure()
		const timer = setTimeout(measure, 600)
		window.addEventListener('resize', measure)
		return () => {
			clearTimeout(timer)
			window.removeEventListener('resize', measure)
		}
	}, [ordered])

	// Reveal nodes as they enter the viewport
	useEffect(() => {
		const nodes = sectionRef.current?.querySelectorAll<HTMLElement>('[data-node]')
		if (!nodes || nodes.length === 0) return
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const id = entry.target.getAttribute('data-node')
					if (entry.isIntersecting && id) {
						setVisible((prev) => {
							if (prev.has(id)) return prev
							const next = new Set(prev)
							next.add(id)
							return next
						})
					}
				})
			},
			{ threshold: 0.2 }
		)
		nodes.forEach((n) => observer.observe(n))
		return () => observer.disconnect()
	}, [ordered])

	// Fill the rail as the section scrolls through the viewport
	useEffect(() => {
		let frame = 0
		function update() {
			frame = 0
			const section = sectionRef.current
			const rail = railRef.current
			if (!section || !rail) return
			const rect = section.getBoundingClientRect()
			const total = rect.height - window.innerHeight * 0.4
			const passed = window.innerHeight * 0.7 - rect.top
			setProgress(Math.min(1, Math.max(0, total > 0 ? passed / total : 0)))
		}
		function onScroll() {
			if (frame === 0) frame = requestAnimationFrame(update)
		}
		update()
		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll)
		return () => {
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onScroll)
			if (frame !== 0) cancelAnimationFrame(frame)
		}
	}, [])

	return (
		<section ref={sectionRef}>
			<h2
				className="flex items-center gap-2 text-lg font-bold mb-6"
				style={{ color: 'var(--text)' }}
			>
				<IconRoute size={18} color="var(--primary)" />
				Journey
			</h2>

			<div ref={railRef} className="relative">
				{/* Track in card colors, dim until scrolled past */}
				<div
					className="absolute left-[9px] sm:left-1/2 sm:-translate-x-1/2 top-2 bottom-2 w-0.5 rounded-full"
					style={{
						background: railGradient ?? 'var(--overlay)',
						opacity: railGradient ? 0.25 : 1,
					}}
				/>
				{/* Progress fill in card colors */}
				{railGradient && (
					<div
						className="absolute left-[9px] sm:left-1/2 sm:-translate-x-1/2 top-2 w-0.5 rounded-full"
						style={{
							height: `calc((100% - 16px) * ${progress})`,
							background: railGradient,
							filter: 'saturate(1.2)',
							boxShadow: '0 0 12px rgba(var(--primary-rgb, 0,213,217),0.35)',
							transition: 'height 0.1s linear',
						}}
					/>
				)}

				<div className="space-y-5">
					{ordered.map((item, index) => {
						const color = EXPERIENCE_TYPE_COLOR[item.type] ?? 'var(--primary)'
						const shown = visible.has(item.id)
						const leftSide = index % 2 === 0
						return (
							<div
								key={item.id}
								data-node={item.id}
								className="relative pl-8 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-16"
								style={{
									opacity: shown ? 1 : 0,
									transform: shown ? 'translateY(0)' : 'translateY(24px)',
									transition: 'opacity 0.5s ease, transform 0.5s ease',
								}}
								onMouseEnter={() => setHovered(item.id)}
								onMouseLeave={() => setHovered(null)}
							>
								{/* Dot on the rail, clickable like the title */}
								{item.noDetail ? (
									<span
										className={`absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-5 flex items-center justify-center ${item.highlight ? 'journey-pulse' : ''}`}
										style={{ width: '20px', height: '20px' }}
									>
										<span
											className="block rounded-full transition-transform duration-200"
											style={{
												width: '12px',
												height: '12px',
												backgroundColor: 'var(--bg-base)',
												border: `3px solid ${color}`,
												boxShadow: item.highlight
													? `0 0 14px ${color}`
													: `0 0 8px ${color}55`,
												transform:
													hovered === item.id ? 'scale(1.4)' : 'scale(1)',
											}}
										/>
									</span>
								) : (
									<Link
										to={`/experience/${item.id}`}
										className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-5 flex items-center justify-center"
										style={{ width: '20px', height: '20px' }}
										aria-label={`${item.role} at ${item.company}`}
									>
										<span
											className={`flex items-center justify-center rounded-full ${item.highlight ? 'journey-pulse' : ''}`}
											style={{ width: '20px', height: '20px' }}
										>
											<span
												className="block rounded-full transition-transform duration-200"
												style={{
													width: '12px',
													height: '12px',
													backgroundColor: 'var(--bg-base)',
													border: `3px solid ${color}`,
													boxShadow: item.highlight
														? `0 0 14px ${color}`
														: `0 0 8px ${color}55`,
													transform:
														hovered === item.id
															? 'scale(1.4)'
															: 'scale(1)',
												}}
											/>
										</span>
									</Link>
								)}

								{/* Date label on the rail, opposite side of the card */}
								{item.noDetail ? (
									<span
										className={`hidden sm:block absolute top-4 font-mono text-xs whitespace-nowrap ${
											leftSide
												? 'left-[calc(50%+30px)]'
												: 'right-[calc(50%+30px)]'
										}`}
										style={{
											color: hovered === item.id ? color : 'var(--subtext)',
										}}
									>
										{new Date(item.startDate).getFullYear()} -{' '}
										{item.endDate
											? new Date(item.endDate).getFullYear()
											: 'Present'}
									</span>
								) : (
									<Link
										to={`/experience/${item.id}`}
										className={`hidden sm:block absolute top-4 font-mono text-xs whitespace-nowrap transition-colors duration-150 ${
											leftSide
												? 'left-[calc(50%+30px)]'
												: 'right-[calc(50%+30px)]'
										}`}
										style={{
											color: hovered === item.id ? color : 'var(--subtext)',
										}}
									>
										{new Date(item.startDate).getFullYear()} -{' '}
										{item.endDate
											? new Date(item.endDate).getFullYear()
											: 'Present'}
									</Link>
								)}

								<div
									className={
										leftSide
											? 'sm:col-start-1 sm:row-start-1'
											: 'sm:col-start-2 sm:row-start-1'
									}
								>
									<div
										className="rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5"
										style={{
											backgroundColor: 'var(--bg-surface)',
											borderColor: item.highlight
												? 'var(--primary)'
												: 'var(--overlay)',
											...(item.highlight && {
												boxShadow:
													'0 0 24px rgba(var(--primary-rgb, 0,213,217), 0.12)',
											}),
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = color
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = item.highlight
												? 'var(--primary)'
												: 'var(--overlay)'
										}}
									>
										<div className="flex items-center gap-3">
											<CompanyLogo
												logoUrl={item.logoUrl}
												logoAlt={item.logoAlt}
												company={item.company}
												size="sm"
												color={color}
											/>
											<div className="flex-1 min-w-0">
												{item.noDetail ? (
													<p
														className="font-semibold text-sm truncate"
														style={{ color: 'var(--text)' }}
													>
														{item.role}
													</p>
												) : (
													<Link
														to={`/experience/${item.id}`}
														className="font-semibold text-sm truncate block transition-colors duration-150"
														style={{ color: 'var(--text)' }}
														onMouseEnter={(e) =>
															(e.currentTarget.style.color = color)
														}
														onMouseLeave={(e) =>
															(e.currentTarget.style.color =
																'var(--text)')
														}
													>
														{item.role}
													</Link>
												)}
												<p
													className="text-xs truncate"
													style={{ color: 'var(--subtext)' }}
												>
													{item.company}
												</p>
											</div>
											<span
												className="hidden sm:inline-block text-[11px] px-1.5 py-0.5 rounded font-mono flex-shrink-0"
												style={{ backgroundColor: `${color}1f`, color }}
											>
												{EXPERIENCE_TYPE_LABEL[item.type] ?? item.type}
											</span>
										</div>
										<div
											className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-xs"
											style={{ color: 'var(--subtext)' }}
										>
											<span className="font-mono">
												{formatDate(item.startDate, {
													yearMonthOnly: true,
												})}{' '}
												-{' '}
												{item.endDate
													? formatDate(item.endDate, {
															yearMonthOnly: true,
														})
													: 'Present'}
											</span>
											<span
												className="font-mono px-1.5 py-px rounded"
												style={{
													backgroundColor:
														'rgba(var(--primary-rgb, 0,213,217),0.1)',
													color: 'var(--primary)',
												}}
											>
												{getDuration(item.startDate, item.endDate)}
											</span>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
