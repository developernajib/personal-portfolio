import { Link } from 'react-router-dom'
import { IconCode, IconArrowRight } from '@tabler/icons-react'
import { technologies } from '@/data/technologies'
import { HOME_TECH_PREVIEW_COUNT } from '@/lib/constants'
import SectionHeader from '@/components/ui/SectionHeader'

export default function TechPreviewSection() {
	return (
		<section>
			<SectionHeader
				icon={<IconCode size={22} color="var(--primary)" />}
				title="Technologies"
				seeAllHref="/technologies"
			/>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
				{technologies.slice(0, HOME_TECH_PREVIEW_COUNT).map((tech) => (
					<div
						key={tech.id}
						className="flex items-center gap-3 rounded-xl border p-3 hover-border-primary"
						style={{
							backgroundColor: 'var(--bg-surface)',
							borderColor: 'var(--overlay)',
						}}
					>
						<div
							className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
							style={{ backgroundColor: tech.iconBg }}
						>
							<img
								src={tech.icon}
								alt={tech.name}
								className="w-6 h-6 object-contain"
								width="24"
								height="24"
								loading="lazy"
								decoding="async"
							/>
						</div>
						<div className="min-w-0">
							<p
								className="text-sm font-semibold truncate"
								style={{ color: 'var(--text)' }}
							>
								{tech.name}
							</p>
							<p className="text-xs truncate" style={{ color: 'var(--subtext)' }}>
								{tech.desc}
							</p>
						</div>
					</div>
				))}
				{/* See more slot */}
				<Link
					to="/technologies"
					className="flex items-center justify-center gap-2 rounded-xl border p-3 hover-primary hover-border-primary"
					style={{
						backgroundColor: 'var(--bg-surface)',
						borderColor: 'var(--overlay)',
						color: 'var(--subtext)',
					}}
				>
					<span className="text-sm font-medium">
						+{technologies.length - HOME_TECH_PREVIEW_COUNT} more
					</span>
					<IconArrowRight size={14} />
				</Link>
			</div>
		</section>
	)
}
