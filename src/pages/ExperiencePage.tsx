import { Link, useNavigate } from 'react-router-dom'
import { IconBriefcase, IconCalendarEvent } from '@tabler/icons-react'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import SlabTitle from '@/components/ui/SlabTitle'
import TagBadge from '@/components/ui/TagBadge'
import CompanyLogo from '@/components/ui/CompanyLogo'
import { experience } from '@/data/experience'
import { formatDate, getDuration, isValidHttpUrl } from '@/lib/utils'
import Container from '@/components/ui/Container'
import { EXPERIENCE_TYPE_LABEL, EXPERIENCE_TYPE_COLOR, EXPERIENCE_TYPE_BG } from '@/lib/constants'
import useDocTitle from '@/lib/hooks/useDocTitle'

export default function ExperiencePage() {
	useDocTitle('Experience')
	const fulltime = experience.filter((e) => e.type === 'fulltime')
	const other = experience.filter((e) => e.type !== 'fulltime')

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 space-y-12 py-8 md:py-10">
				{/* Header */}
				<section className="space-y-3">
					<div className="flex items-center gap-3">
						<IconBriefcase size={28} color="var(--primary)" />
						<SlabTitle title="Experience" config="4c" as="h1" />
					</div>
					<p
						className="max-w-prose text-sm leading-relaxed"
						style={{ color: 'var(--subtext)' }}
					>
						My full professional history — full-time roles, freelance, and part-time
						work.
					</p>
				</section>

				{/* Full-time */}
				<section>
					<h2
						className="flex items-center gap-2 text-lg font-bold mb-5"
						style={{ color: 'var(--text)' }}
					>
						<IconBriefcase size={18} color="var(--primary)" />
						Full-time
					</h2>
					<div className="space-y-4">
						{fulltime.map((item) => (
							<ExperienceCard key={item.id} item={item} />
						))}
					</div>
				</section>

				{/* Freelance / Contract */}
				{other.length > 0 && (
					<section>
						<h2
							className="flex items-center gap-2 text-lg font-bold mb-5"
							style={{ color: 'var(--text)' }}
						>
							<IconBriefcase size={18} color={EXPERIENCE_TYPE_COLOR['freelance']} />
							Freelance & Part-time
						</h2>
						<div className="space-y-4">
							{other.map((item) => (
								<ExperienceCard key={item.id} item={item} />
							))}
						</div>
					</section>
				)}
			</Container>
		</div>
	)
}

function ExperienceCard({ item }: { item: (typeof experience)[0] }) {
	const typeColor = EXPERIENCE_TYPE_COLOR[item.type] ?? 'var(--primary)'
	const navigate = useNavigate()
	const canNavigate = !item.noDetail

	return (
		<div
			className={`rounded-xl border p-3.5 sm:p-5 transition-colors duration-150${canNavigate ? ' lg:cursor-auto cursor-pointer active:scale-[0.99]' : ''}`}
			style={{
				backgroundColor: 'var(--bg-surface)',
				borderColor: 'var(--overlay)',
				borderLeftWidth: '3px',
				borderLeftColor: typeColor,
			}}
			onClick={() => {
				if (canNavigate && window.innerWidth < 1024) {
					navigate(`/experience/${item.id}`)
				}
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.borderColor = typeColor
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.borderColor = 'var(--overlay)'
				e.currentTarget.style.borderLeftColor = typeColor
			}}
		>
			<div className="flex items-start gap-3">
				<CompanyLogo
					logoUrl={item.logoUrl}
					logoAlt={item.logoAlt}
					company={item.company}
					size="md"
					color={typeColor}
				/>

				{/* Details */}
				<div className="flex-1 min-w-0">
					{item.noDetail ? (
						<span className="font-bold text-base" style={{ color: 'var(--text)' }}>
							{item.role}
						</span>
					) : (
						<Link
							to={`/experience/${item.id}`}
							className="font-bold text-base inline-flex items-center gap-1 transition-colors duration-150"
							style={{ color: 'var(--text)' }}
							onMouseEnter={(e) => (e.currentTarget.style.color = typeColor)}
							onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text)')}
						>
							{item.role}
						</Link>
					)}
					{isValidHttpUrl(item.companyUrl) ? (
						<a
							href={item.companyUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover-primary text-sm block mt-0.5"
							style={{ color: 'var(--subtext)' }}
						>
							{item.company}
						</a>
					) : (
						<span className="text-sm block mt-0.5" style={{ color: 'var(--subtext)' }}>
							{item.company}
						</span>
					)}
					<div
						className="flex items-center gap-1.5 mt-1.5 text-xs"
						style={{ color: 'var(--subtext)' }}
					>
						<span
							className="px-1.5 py-0.5 rounded font-mono"
							style={{
								backgroundColor: EXPERIENCE_TYPE_BG[item.type],
								color: typeColor,
							}}
						>
							{EXPERIENCE_TYPE_LABEL[item.type]}
						</span>
						<IconCalendarEvent size={11} />
						<span>
							{formatDate(item.startDate, { yearMonthOnly: true })} —{' '}
							{item.endDate
								? formatDate(item.endDate, { yearMonthOnly: true })
								: 'Present'}
						</span>
					</div>
					<span
						className="inline-block text-xs font-mono px-1.5 py-0.5 rounded mt-1"
						style={{
							backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.1)',
							color: 'var(--primary)',
						}}
					>
						{getDuration(item.startDate, item.endDate)}
					</span>
				</div>
			</div>

			<p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--subtext)' }}>
				{item.description}
			</p>

			<div className="flex flex-wrap gap-1.5 mt-3">
				{item.tags.map((tag) => (
					<TagBadge key={tag} tag={tag} />
				))}
			</div>
		</div>
	)
}
