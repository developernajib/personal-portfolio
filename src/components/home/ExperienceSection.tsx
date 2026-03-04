import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { IconBriefcase, IconCalendarEvent, IconArrowRight } from '@tabler/icons-react'
import TagBadge from '@/components/ui/TagBadge'
import CompanyLogo from '@/components/ui/CompanyLogo'
import { experience } from '@/data/experience'
import { formatDate, getDuration, isValidHttpUrl } from '@/lib/utils'

export default function ExperienceSection() {
	const featuredJobs = useMemo(() => experience.filter((item) => item.featured), [])
	const pastJobs = useMemo(() => experience.filter((item) => !item.featured), [])

	return (
		<section>
			<h2
				className="mb-5 flex items-center gap-2 text-xl font-bold"
				style={{ color: 'var(--text)' }}
			>
				<IconBriefcase size={22} color="var(--primary)" />
				Experience
			</h2>

			{/* Featured job — prominent full card */}
			{featuredJobs.map((item) => (
				<div
					key={item.id}
					className="mb-4 rounded-xl border p-3.5 sm:p-5 transition-all duration-200"
					style={{
						backgroundColor: 'var(--bg-surface)',
						borderColor: 'var(--primary)',
						borderLeftWidth: '3px',
					}}
				>
					<div className="flex items-start gap-3 mb-3">
						<CompanyLogo
							logoUrl={item.logoUrl}
							logoAlt={item.logoAlt}
							company={item.company}
							size="md"
							color="var(--primary)"
						/>

						<div className="flex-1 min-w-0">
							<Link
								to={`/experience/${item.id}`}
								className="font-bold text-base inline-flex items-center gap-1 hover-opacity"
								style={{ color: 'var(--primary)' }}
							>
								{item.role}
							</Link>
							{isValidHttpUrl(item.companyUrl) ? (
								<a
									href={item.companyUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm block mt-0.5 hover-primary"
									style={{ color: 'var(--subtext)' }}
								>
									{item.company}
								</a>
							) : (
								<span
									className="text-sm block mt-0.5"
									style={{ color: 'var(--subtext)' }}
								>
									{item.company}
								</span>
							)}
							<div className="flex items-center gap-2 mt-1.5">
								<div
									className="flex items-center gap-1.5 text-xs"
									style={{ color: 'var(--subtext)' }}
								>
									<IconCalendarEvent size={11} />
									<span>
										{formatDate(item.startDate, { yearMonthOnly: true })} —{' '}
										{item.endDate
											? formatDate(item.endDate, { yearMonthOnly: true })
											: 'Present'}
									</span>
								</div>
								<span
									className="text-xs px-2 py-0.5 rounded font-mono"
									style={{
										backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.12)',
										color: 'var(--primary)',
									}}
								>
									{getDuration(item.startDate, item.endDate)}
								</span>
							</div>
						</div>
					</div>

					<p className="text-sm mb-3" style={{ color: 'var(--subtext)' }}>
						{item.description}
					</p>

					{/* Duration bar */}
					<div className="mb-3">
						<div
							className="h-0.5 rounded-full overflow-hidden"
							style={{ backgroundColor: 'var(--bg-mantle)' }}
						>
							<div
								className="h-full rounded-full"
								style={{
									width: '100%',
									backgroundColor: 'var(--primary)',
									opacity: 0.5,
								}}
							/>
						</div>
					</div>

					<div className="flex flex-wrap gap-1.5">
						{item.tags.map((tag) => (
							<TagBadge key={tag} tag={tag} />
						))}
					</div>
				</div>
			))}

			{/* Past jobs — compact inline rows */}
			<div
				className="rounded-xl border px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-3"
				style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
			>
				{pastJobs.map((item, i) => (
					<div key={item.id} className="flex items-center gap-2">
						<CompanyLogo
							logoUrl={item.logoUrl}
							logoAlt={item.logoAlt}
							company={item.company}
							size="sm"
							color="var(--subtext)"
						/>
						<div>
							{isValidHttpUrl(item.companyUrl) ? (
								<a
									href={item.companyUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm font-medium hover-primary"
									style={{ color: 'var(--text)' }}
								>
									{item.company}
								</a>
							) : (
								<span
									className="text-sm font-medium"
									style={{ color: 'var(--text)' }}
								>
									{item.company}
								</span>
							)}
							<span className="text-xs ml-1.5" style={{ color: 'var(--subtext)' }}>
								(Past)
							</span>
						</div>
						{i < pastJobs.length - 1 && (
							<span
								className="hidden md:inline ml-4"
								style={{ color: 'var(--primary)' }}
							>
								/
							</span>
						)}
					</div>
				))}
			</div>

			<Link
				to="/experience"
				className="mt-4 inline-flex items-center gap-1.5 text-sm hover-primary"
				style={{ color: 'var(--subtext)' }}
			>
				Full experience page <IconArrowRight size={14} />
			</Link>
		</section>
	)
}
