import { IconCalendarEvent, IconMapPin, IconExternalLink } from '@tabler/icons-react'
import TagBadge from '@/components/ui/TagBadge'
import CompanyLogo from '@/components/ui/CompanyLogo'
import { formatDate, getDuration, isValidHttpUrl } from '@/lib/utils'
import { EXPERIENCE_TYPE_LABEL } from '@/lib/constants'
import type { ExperienceItem } from '@/data/experience'

interface Props {
	item: ExperienceItem
	accentColor: string
}

export default function ExperienceHero({ item, accentColor }: Props) {
	return (
		<section
			className="rounded-xl border p-6"
			style={{
				backgroundColor: 'var(--bg-surface)',
				borderColor: 'var(--overlay)',
				borderLeftWidth: '4px',
				borderLeftColor: accentColor,
			}}
		>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
				<CompanyLogo
					logoUrl={item.logoUrl}
					logoAlt={item.logoAlt}
					company={item.company}
					size="lg"
					color={accentColor}
				/>

				{/* Info */}
				<div className="flex-1 min-w-0">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div>
							<h1
								className="text-xl font-bold sm:text-2xl"
								style={{ color: 'var(--text)' }}
							>
								{item.role}
							</h1>
							{isValidHttpUrl(item.companyUrl) ? (
								<a
									href={item.companyUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-base transition-colors duration-150 mt-0.5"
									style={{ color: 'var(--subtext)' }}
									onMouseEnter={(e) =>
										(e.currentTarget.style.color = accentColor)
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = 'var(--subtext)')
									}
								>
									{item.company}
									<IconExternalLink size={13} />
								</a>
							) : (
								<span
									className="text-base mt-0.5 block"
									style={{ color: 'var(--subtext)' }}
								>
									{item.company}
								</span>
							)}
						</div>
						<span
							className="text-xs px-2 py-1 rounded font-mono flex-shrink-0"
							style={{
								backgroundColor: `${accentColor}18`,
								color: accentColor,
							}}
						>
							{EXPERIENCE_TYPE_LABEL[item.type]}
						</span>
					</div>

					{/* Meta row */}
					<div className="flex flex-wrap gap-4 mt-3">
						<div
							className="flex items-center gap-1.5 text-xs"
							style={{ color: 'var(--subtext)' }}
						>
							<IconCalendarEvent size={13} />
							<span>
								{formatDate(item.startDate, { yearMonthOnly: true })} —{' '}
								{item.endDate
									? formatDate(item.endDate, { yearMonthOnly: true })
									: 'Present'}
							</span>
							<span
								className="px-1.5 py-0.5 rounded font-mono ml-1"
								style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
							>
								{getDuration(item.startDate, item.endDate)}
							</span>
						</div>
						{item.location && (
							<div
								className="flex items-center gap-1.5 text-xs"
								style={{ color: 'var(--subtext)' }}
							>
								<IconMapPin size={13} />
								<span>{item.location}</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Description */}
			<p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
				{item.description}
			</p>

			{/* Tags */}
			<div className="flex flex-wrap gap-1.5 mt-4">
				{item.tags.map((tag) => (
					<TagBadge key={tag} tag={tag} />
				))}
			</div>
		</section>
	)
}
