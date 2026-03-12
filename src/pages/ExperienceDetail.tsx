import { useParams, Link, Navigate } from 'react-router-dom'
import { IconArrowLeft, IconCode } from '@tabler/icons-react'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import TagBadge from '@/components/ui/TagBadge'
import Container from '@/components/ui/Container'
import ExperienceHero from '@/components/experience/ExperienceHero'
import WorkedOnSection from '@/components/experience/WorkedOnSection'
import TeamSection from '@/components/experience/TeamSection'
import GallerySection from '@/components/experience/GallerySection'
import { experience } from '@/data/experience'
import { EXPERIENCE_TYPE_COLOR } from '@/lib/constants'
import useDocTitle from '@/lib/hooks/useDocTitle'

export default function ExperienceDetail() {
	const { id } = useParams<{ id: string }>()
	const item = experience.find((e) => e.id === id)
	useDocTitle(item ? `${item.role} at ${item.company}` : undefined)

	if (!item) return <Navigate to="/experience" replace />

	const accentColor = EXPERIENCE_TYPE_COLOR[item.type] ?? 'var(--primary)'
	const gallery = item.gallery ?? []

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10 space-y-10">
				{/* Back */}
				<Link
					to="/experience"
					className="inline-flex items-center gap-1.5 text-sm transition-colors duration-150"
					style={{ color: 'var(--subtext)' }}
					onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
					onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--subtext)')}
				>
					<IconArrowLeft size={15} /> Back to Experience
				</Link>

				<ExperienceHero item={item} accentColor={accentColor} />

				{item.projects && item.projects.length > 0 && (
					<WorkedOnSection projects={item.projects} accentColor={accentColor} />
				)}

				{/* Skills used */}
				<section>
					<h2
						className="flex items-center gap-2 text-lg font-bold mb-4"
						style={{ color: 'var(--text)' }}
					>
						<IconCode size={18} color={accentColor} />
						Skills Used
					</h2>
					<div
						className="rounded-xl border p-4"
						style={{
							backgroundColor: 'var(--bg-surface)',
							borderColor: 'var(--overlay)',
						}}
					>
						<div className="flex flex-wrap gap-2">
							{item.tags.map((tag) => (
								<TagBadge key={tag} tag={tag} />
							))}
						</div>
					</div>
				</section>

				<TeamSection manager={item.manager} team={item.team} accentColor={accentColor} />

				<GallerySection gallery={gallery} accentColor={accentColor} />
			</Container>
		</div>
	)
}
