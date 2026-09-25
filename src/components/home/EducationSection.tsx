import { IconSchool, IconCalendarEvent, IconAward } from '@tabler/icons-react'
import { education } from '@data/education'

const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
]

function formatDate(year: number, month?: number) {
	if (month && month >= 1 && month <= 12) return `${MONTHS[month - 1]} ${year}`
	return `${year}`
}

export default function EducationSection() {
	return (
		<section>
			<h2
				className="mb-5 flex items-center gap-2 text-xl font-bold"
				style={{ color: 'var(--text)' }}
			>
				<IconSchool size={22} color="var(--primary)" />
				Education
			</h2>

			<div className="space-y-3">
				{education.map((item) => (
					<div
						key={item.degree + item.institution}
						className="rounded-xl border p-5"
						style={{
							backgroundColor: 'var(--bg-surface)',
							borderColor: 'var(--overlay)',
						}}
					>
						<div className="flex items-start justify-between gap-4 flex-wrap">
							{/* Left - degree + institution */}
							<div className="flex items-start gap-3">
								<div
									className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
									style={{
										backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.1)',
									}}
								>
									<IconSchool size={18} color="var(--primary)" />
								</div>
								<div>
									<p
										className="font-bold text-base"
										style={{ color: 'var(--text)' }}
									>
										{item.degree}
									</p>
									<p
										className="text-sm mt-0.5"
										style={{ color: 'var(--primary)' }}
									>
										{item.field}
									</p>
									<p
										className="text-sm mt-0.5"
										style={{ color: 'var(--subtext)' }}
									>
										{item.institution}
										{item.location ? ` - ${item.location}` : ''}
									</p>
								</div>
							</div>

							{/* Right - year + CGPA */}
							<div className="flex flex-col items-end gap-2 flex-shrink-0">
								<div
									className="flex items-center gap-1.5 text-xs"
									style={{ color: 'var(--subtext)' }}
								>
									<IconCalendarEvent size={11} />
									<span>
										{formatDate(item.startYear, item.startMonth)} -{' '}
										{item.endYear
											? formatDate(item.endYear, item.endMonth)
											: 'Present'}
									</span>
								</div>
								{item.cgpa != null && item.cgpaMax != null && (
									<div
										className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded font-mono"
										style={{
											backgroundColor:
												'rgba(var(--primary-rgb, 0,213,217),0.12)',
											color: 'var(--primary)',
										}}
									>
										<IconAward size={11} />
										CGPA {item.cgpa.toFixed(2)} / {item.cgpaMax.toFixed(1)}
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}
