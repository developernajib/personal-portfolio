import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
	longDescription?: string
	description: string
}

export default function ProjectDescription({ longDescription, description }: Props) {
	return (
		<div
			className="rounded-xl border p-6"
			style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
		>
			{longDescription ? (
				<div className="prose prose-sm max-w-none" style={{ color: 'var(--subtext)' }}>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{longDescription}</ReactMarkdown>
				</div>
			) : (
				<p className="text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
					{description}
				</p>
			)}
		</div>
	)
}
