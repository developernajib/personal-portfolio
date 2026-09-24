interface TagBadgeProps {
	tag: string
	onClick?: () => void
	active?: boolean
}

export default function TagBadge({ tag, onClick, active }: TagBadgeProps) {
	const base =
		'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border transition-colors duration-150 hover:border-[var(--primary)]'
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
				className={`${base} cursor-hand hover:-translate-y-px`}
				style={activeInlineStyle}
				onMouseEnter={(e) => {
					if (active) return
					e.currentTarget.style.backgroundColor =
						'rgba(var(--primary-rgb, 0,213,217),0.12)'
					e.currentTarget.style.color = 'var(--primary)'
					e.currentTarget.style.borderColor = 'var(--primary)'
				}}
				onMouseLeave={(e) => {
					if (active) return
					e.currentTarget.style.backgroundColor = 'var(--bg-mantle)'
					e.currentTarget.style.color = 'var(--subtext)'
					e.currentTarget.style.borderColor = 'var(--overlay)'
				}}
			>
				{tag}
			</button>
		)
	}

	return (
		<span className={`${base} ibeam`} style={activeInlineStyle}>
			{tag}
		</span>
	)
}
