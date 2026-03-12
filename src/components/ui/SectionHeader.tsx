import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowRight } from '@tabler/icons-react'

interface Props {
	icon: ReactNode
	title: string
	seeAllHref?: string
	seeAllLabel?: string
}

export default function SectionHeader({ icon, title, seeAllHref, seeAllLabel = 'See all' }: Props) {
	return (
		<div className="mb-5 flex items-center justify-between">
			<h2
				className="flex items-center gap-2 text-xl font-bold"
				style={{ color: 'var(--text)' }}
			>
				{icon}
				{title}
			</h2>
			{seeAllHref && (
				<Link
					to={seeAllHref}
					className="flex items-center gap-1 text-sm hover-primary"
					style={{ color: 'var(--subtext)' }}
				>
					{seeAllLabel} <IconArrowRight size={14} />
				</Link>
			)}
		</div>
	)
}
