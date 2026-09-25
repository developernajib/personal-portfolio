import { IconFileDescription } from '@tabler/icons-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
	longDescription?: string
	description: string
	title?: string
}

export default function ProjectDescription({
	longDescription,
	description,
	title = 'Project Details',
}: Props) {
	return (
		<section
			className="rounded-xl border p-6 sm:p-7 mb-8"
			style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
		>
			<h2
				className="flex items-center gap-2 text-base font-bold mb-4"
				style={{ color: 'var(--text)' }}
			>
				<IconFileDescription size={17} color="var(--primary)" />
				{title}
			</h2>
			{longDescription ? (
				<div className="project-md text-sm" style={{ color: 'var(--subtext)' }}>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{longDescription}</ReactMarkdown>
				</div>
			) : (
				<p className="text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
					{description}
				</p>
			)}
		</section>
	)
}
