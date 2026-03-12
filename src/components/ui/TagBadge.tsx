interface TagBadgeProps {
	tag: string
	onClick?: () => void
	active?: boolean
}

export default function TagBadge({ tag, onClick, active }: TagBadgeProps) {
	const base =
		'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border transition-colors duration-150 cursor-default'
	const activeInlineStyle = active
		? {
				backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.15)',
				color: 'var(--primary)',
				borderColor: 'var(--primary)',
			}
		: {
				backgroundColor: 'var(--bg-mantle)',
				color: 'var(--subtext)',
				borderColor: 'var(--overlay)',
			}

	if (onClick) {
		return (
			<button
				onClick={onClick}
				className={`${base} cursor-pointer`}
				style={activeInlineStyle}
			>
				{tag}
			</button>
		)
	}

	return (
		<span className={base} style={activeInlineStyle}>
			{tag}
		</span>
	)
}
