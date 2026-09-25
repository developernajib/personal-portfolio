import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconCode, IconCheck, IconScale, IconStar } from '@tabler/icons-react'
import { useSelectedTech } from '@/lib/selectedTech'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import Container from '@/components/ui/Container'
import SlabTitle from '@/components/ui/SlabTitle'
import TagBadge from '@/components/ui/TagBadge'
import Tooltip from '@/components/ui/Tooltip'
import { technologies } from '@/data/technologies'
import { skills } from '@/data/skills'
import { experience } from '@/data/experience'
import { getDuration } from '@/lib/utils'
import { TECH_CONTEXT_COLOR, TECH_CONTEXT_LABEL_FN } from '@/lib/constants'
import useDocTitle from '@/lib/hooks/useDocTitle'

const CATEGORIES = ['All', 'Language', 'Frontend', 'Backend', 'Database', 'DevOps'] as const

function getTotalDuration(tech: (typeof technologies)[0]): string {
	return getDuration(tech.startDate, tech.endDate)
}

function TechCard({
	tech,
	selected,
	onToggle,
}: {
	tech: (typeof technologies)[0]
	selected: boolean
	onToggle: () => void
}) {
	const relatedExp = useMemo(
		() =>
			experience.filter((e) => tech.usage.some((u) => u.company && u.company === e.company)),
		[tech.usage]
	)

	return (
		<div
			className="hover-border-primary rounded-xl border p-3 sm:p-4 flex flex-col gap-3 transition-all duration-150"
			style={{
				backgroundColor: 'var(--bg-surface)',
				borderColor: selected ? 'var(--primary)' : 'var(--overlay)',
				...(selected && {
					boxShadow: '0 0 20px rgba(var(--primary-rgb, 0,213,217), 0.12)',
				}),
			}}
		>
			{/* Icon + name */}
			<div className="flex items-center gap-3">
				<div
					className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
					style={{ backgroundColor: tech.iconBg }}
				>
					{tech.icon ? (
						<img
							src={tech.icon}
							alt={tech.name}
							className="w-6 h-6 object-contain"
							width="24"
							height="24"
							loading="lazy"
							decoding="async"
						/>
					) : (
						<span
							style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}
						>
							{tech.name.charAt(0)}
						</span>
					)}
				</div>
				<div>
					<p className="font-bold text-sm" style={{ color: 'var(--text)' }}>
						{tech.name}
					</p>
					<p className="text-xs" style={{ color: 'var(--subtext)' }}>
						{tech.desc}
					</p>
				</div>
				<div className="ml-auto flex-shrink-0 flex items-center gap-2">
					<span
						className="text-xs px-2 py-0.5 rounded font-mono"
						style={{
							backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.1)',
							color: 'var(--primary)',
						}}
					>
						{getTotalDuration(tech)}
					</span>
					<Tooltip
						content={
							selected
								? `Deselect ${tech.name}`
								: `Select ${tech.name} for comparison`
						}
						position="top"
					>
						<button
							onClick={onToggle}
							aria-pressed={selected}
							aria-label={
								selected
									? `Deselect ${tech.name}`
									: `Select ${tech.name} for comparison`
							}
							className="w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-150"
							style={{
								borderColor: selected ? 'var(--primary)' : 'var(--overlay)',
								backgroundColor: selected
									? 'rgba(var(--primary-rgb, 0,213,217),0.15)'
									: 'transparent',
								color: 'var(--primary)',
							}}
						>
							{selected && <IconCheck size={13} stroke={3} />}
						</button>
					</Tooltip>
				</div>
			</div>

			{/* Divider */}
			<div style={{ height: '1px', backgroundColor: 'var(--overlay)' }} />

			{/* Usage */}
			<div className="space-y-2">
				{tech.usage.length > 0 && (
					<p className="text-xs font-semibold" style={{ color: 'var(--subtext)' }}>
						Used At
					</p>
				)}
				{tech.usage.map((u, i) => {
					const contextColor = TECH_CONTEXT_COLOR[u.context] ?? 'var(--subtext)'
					const contextLabel = TECH_CONTEXT_LABEL_FN(u)
					return (
						<div key={i} className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-1.5">
								<span
									className="text-xs px-1.5 py-0.5 rounded font-mono"
									style={{
										backgroundColor: `${contextColor}18`,
										color: contextColor,
									}}
								>
									{u.context.charAt(0).toUpperCase() + u.context.slice(1)}
								</span>
								<p className="text-xs font-medium" style={{ color: 'var(--text)' }}>
									{contextLabel}
								</p>
							</div>
							<span
								className="text-xs font-mono flex-shrink-0"
								style={{ color: 'var(--subtext)' }}
							>
								{getDuration(u.from, u.to)}
							</span>
						</div>
					)
				})}
			</div>

			{/* Related tags */}
			{relatedExp.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-1">
					{relatedExp[0].tags
						.filter((t) => t !== tech.name)
						.slice(0, 4)
						.map((tag) => (
							<TagBadge key={tag} tag={tag} />
						))}
				</div>
			)}
		</div>
	)
}

export default function Technologies() {
	useDocTitle('Technologies')
	const navigate = useNavigate()
	const location = useLocation()
	const [selectedIds, setSelectedIds] = useSelectedTech()
	const [showSelectedOnly, setShowSelectedOnly] = useState(false)

	// Fresh arrivals from navbar or footer always show the full grid.
	// Keyed on the location key so repeat clicks on the same route reset too.
	useEffect(() => {
		setShowSelectedOnly(false)
	}, [location.key])

	// Nothing left selected means nothing to filter, fall back to the full grid
	useEffect(() => {
		if (showSelectedOnly && selectedIds.length === 0) setShowSelectedOnly(false)
	}, [showSelectedOnly, selectedIds])

	function toggle(id: string) {
		setSelectedIds(
			selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]
		)
	}

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 space-y-12 py-8 md:py-10">
				{/* Header */}
				<section className="space-y-3">
					<div className="flex items-center gap-3">
						<IconCode size={28} color="var(--primary)" />
						<SlabTitle title="Technologies" config="4c" as="h1" />
					</div>
					<p
						className="max-w-prose text-sm leading-relaxed"
						style={{ color: 'var(--subtext)' }}
					>
						Every tech I use in production. Where I used it, for how long, and
						in what role. Listed entries are the highlights. I have used all of
						these across many personal builds too.
					</p>
					<p className="text-xs" style={{ color: 'var(--primary)' }}>
						Pick cards to compare them with your stack.
					</p>
				</section>

				{/* Tech grid by category */}
				{CATEGORIES.filter((c) => c !== 'All').map((category) => {
					const techs = technologies.filter(
						(t) =>
							t.category === category &&
							(!showSelectedOnly || selectedIds.includes(t.id))
					)
					if (techs.length === 0) return null
					return (
						<section key={category}>
							<div
								className="flex items-center gap-3 mb-4 pb-2 border-b"
								style={{ borderColor: 'var(--overlay)' }}
							>
								<h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
									{category}
								</h2>
								<button
									onClick={() => {
										const ids = techs.map((t) => t.id)
										const allSelected = ids.every((id) =>
											selectedIds.includes(id)
										)
										setSelectedIds(
											allSelected
												? selectedIds.filter((id) => !ids.includes(id))
												: [
														...selectedIds,
														...ids.filter(
															(id) => !selectedIds.includes(id)
														),
													]
										)
									}}
									className="hover-primary ml-auto text-xs font-medium"
									style={{ color: 'var(--subtext)' }}
								>
									{techs.every((t) => selectedIds.includes(t.id))
										? 'Deselect all'
										: 'Select all'}
								</button>
							</div>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{techs.map((tech) => (
									<TechCard
										key={tech.id}
										tech={tech}
										selected={selectedIds.includes(tech.id)}
										onToggle={() => toggle(tech.id)}
									/>
								))}
							</div>
						</section>
					)
				})}

				{/* Skills harvested from projects, edit them in data/skills.ts */}
				{skills.length > 0 && (
					<section>
						<div
							className="flex items-center gap-3 mb-4 pb-2 border-b"
							style={{ borderColor: 'var(--overlay)' }}
						>
							<IconStar size={20} color="var(--primary)" />
							<h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
								Skills
							</h2>
						</div>
						<p className="mb-6 text-sm" style={{ color: 'var(--subtext)' }}>
							Other skills from real projects. This leaves out the tech cards
							above.
						</p>
						<div className="space-y-6">
							{skills.map((group) => (
								<div key={group.title}>
									<p
										className="mb-2 text-sm font-semibold"
										style={{ color: 'var(--text)' }}
									>
										{group.title}
									</p>
									<div className="flex flex-wrap gap-1.5">
										{group.items.map((item) => (
											<span
												key={item}
												className="rounded-full border px-3 py-1 text-xs"
												style={{
													color: 'var(--text)',
													borderColor: 'var(--overlay)',
													backgroundColor: 'var(--bg-surface)',
												}}
											>
												{item}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</section>
				)}
			</Container>

			{/* Floating buttons */}
			<div className="fixed z-40 right-4 bottom-24 lg:right-8 lg:bottom-8 flex flex-col items-end gap-2">
				{selectedIds.length > 0 && (
					<button
						onClick={() => setShowSelectedOnly((v) => !v)}
						className="hover-bg-primary-up flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold border transition-all duration-150 hover:scale-105 active:scale-95"
						style={{
							color: 'var(--primary)',
							borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.45)',
							backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.08)',
							boxShadow: '0 8px 24px rgba(var(--primary-rgb, 0,213,217),0.25)',
						}}
						aria-label={
							showSelectedOnly
								? 'Show all technologies'
								: 'Show only selected technologies'
						}
					>
						<IconCheck size={14} stroke={2.5} />
						{showSelectedOnly ? 'Show all' : `Selected (${selectedIds.length})`}
					</button>
				)}
				<button
					onClick={() => navigate('/technologies/compare')}
					className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-2xl transition-transform duration-150 hover:scale-105 active:scale-95"
					style={{
						color: '#06281f',
						backgroundColor: 'var(--primary)',
						boxShadow: '0 8px 30px rgba(var(--primary-rgb, 0,213,217),0.45)',
					}}
					aria-label="Compare technologies"
				>
					<IconScale size={16} stroke={2.5} />
					Compare{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
				</button>
			</div>
		</div>
	)
}
