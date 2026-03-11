import { useMemo } from 'react'
import { IconCode } from '@tabler/icons-react'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import Container from '@/components/ui/Container'
import SlabTitle from '@/components/ui/SlabTitle'
import TagBadge from '@/components/ui/TagBadge'
import { technologies } from '@/data/technologies'
import { experience } from '@/data/experience'
import { getDuration } from '@/lib/utils'
import { TECH_CONTEXT_COLOR, TECH_CONTEXT_LABEL_FN } from '@/lib/constants'
import useDocTitle from '@/lib/hooks/useDocTitle'

const CATEGORIES = ['All', 'Language', 'Frontend', 'Backend', 'Database', 'DevOps'] as const

function getTotalDuration(tech: (typeof technologies)[0]): string {
	return getDuration(tech.startDate, tech.endDate)
}

function TechCard({ tech }: { tech: (typeof technologies)[0] }) {
	const relatedExp = useMemo(
		() =>
			experience.filter((e) => tech.usage.some((u) => u.company && u.company === e.company)),
		[tech.usage]
	)

	return (
		<div
			className="hover-border-primary rounded-xl border p-3 sm:p-4 flex flex-col gap-3"
			style={{
				backgroundColor: 'var(--bg-surface)',
				borderColor: 'var(--overlay)',
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
				<div className="ml-auto flex-shrink-0">
					<span
						className="text-xs px-2 py-0.5 rounded font-mono"
						style={{
							backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.1)',
							color: 'var(--primary)',
						}}
					>
						{getTotalDuration(tech)}
					</span>
				</div>
			</div>

			{/* Divider */}
			<div style={{ height: '1px', backgroundColor: 'var(--overlay)' }} />

			{/* Usage */}
			<div className="space-y-2">
				{tech.usage.length > 0 && (
					<p className="text-xs font-semibold" style={{ color: 'var(--subtext)' }}>
						Used at
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
						A full breakdown of the technologies I've worked with — including where I've
						used them, for how long, and in what capacity. Usage entries highlight
						notable jobs and projects only. All of these have also been used across many
						personal projects that aren't listed individually.
					</p>
				</section>

				{/* Tech grid by category */}
				{CATEGORIES.filter((c) => c !== 'All').map((category) => {
					const techs = technologies.filter((t) => t.category === category)
					if (techs.length === 0) return null
					return (
						<section key={category}>
							<h2
								className="text-lg font-bold mb-4 pb-2 border-b"
								style={{ color: 'var(--text)', borderColor: 'var(--overlay)' }}
							>
								{category}
							</h2>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{techs.map((tech) => (
									<TechCard key={tech.id} tech={tech} />
								))}
							</div>
						</section>
					)
				})}
			</Container>
		</div>
	)
}
