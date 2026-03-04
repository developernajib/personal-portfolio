import { IconCalendarEvent } from '@tabler/icons-react'
import { formatDate, getDuration, isValidHttpUrl } from '@/lib/utils'
import TagBadge from './TagBadge'
import CompanyLogo from './CompanyLogo'
import type { ExperienceItem } from '@/data/experience'

interface ExperienceTimelineProps {
	items: ExperienceItem[]
}

export default function ExperienceTimeline({ items }: ExperienceTimelineProps) {
	return (
		<div className="space-y-4">
			{items.map((item) => (
				<div
					key={item.id}
					className="rounded-xl border p-3.5 sm:p-5 transition-colors duration-200"
					style={{
						backgroundColor: 'var(--bg-surface)',
						borderColor: item.featured ? 'var(--primary)' : 'var(--overlay)',
						borderLeftWidth: item.featured ? '3px' : '1px',
					}}
				>
					<div className="flex items-start gap-3 mb-3">
						<CompanyLogo
							logoUrl={item.logoUrl}
							logoAlt={item.logoAlt}
							company={item.company}
							size="md"
							color={item.featured ? 'var(--primary)' : 'var(--subtext)'}
						/>

						{/* Role + company + dates */}
						<div className="flex-1 min-w-0">
							<h3
								className="font-semibold text-base"
								style={{ color: 'var(--text)' }}
							>
								{item.role}
							</h3>
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
									<IconCalendarEvent size={12} />
									<span>
										{formatDate(item.startDate, { yearMonthOnly: true })} —{' '}
										{item.endDate
											? formatDate(item.endDate, { yearMonthOnly: true })
											: 'Present'}
									</span>
								</div>
								<span
									className="text-xs px-2 py-0.5 rounded"
									style={{
										backgroundColor: item.featured
											? 'rgba(var(--primary-rgb, 0,213,217),0.1)'
											: 'var(--bg-mantle)',
										color: item.featured ? 'var(--primary)' : 'var(--subtext)',
									}}
								>
									{getDuration(item.startDate, item.endDate)}
								</span>
							</div>
						</div>
					</div>

					<p className="text-sm mb-3" style={{ color: 'var(--subtext)' }}>
						{item.details || item.description}
					</p>

					<div className="flex flex-wrap gap-1.5">
						{item.tags.map((tag) => (
							<TagBadge key={tag} tag={tag} />
						))}
					</div>
				</div>
			))}
		</div>
	)
}
