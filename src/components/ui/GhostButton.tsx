import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	as?: 'button'
	icon?: ReactNode
}

interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	as: 'a'
	icon?: ReactNode
}

type Props = ButtonProps | AnchorProps

export default function GhostButton({ icon, children, className = '', ...rest }: Props) {
	const sharedStyle = {
		color: 'var(--subtext)',
		borderColor: 'var(--overlay)',
		backgroundColor: 'var(--bg-mantle)',
	}

	const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
		e.currentTarget.style.color = 'var(--primary)'
		e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb, 0,213,217),0.3)'
	}

	const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
		e.currentTarget.style.color = 'var(--subtext)'
		e.currentTarget.style.borderColor = 'var(--overlay)'
	}

	const sharedClass = `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border transition-colors duration-150 ${className}`

	if (rest.as === 'a') {
		const { as: _, ...anchorRest } = rest as AnchorProps
		return (
			<a
				{...anchorRest}
				className={sharedClass}
				style={{ ...sharedStyle, ...anchorRest.style }}
				onMouseEnter={handleMouseEnter as React.MouseEventHandler<HTMLAnchorElement>}
				onMouseLeave={handleMouseLeave as React.MouseEventHandler<HTMLAnchorElement>}
			>
				{icon}
				{children}
			</a>
		)
	}

	const { as: _, ...buttonRest } = rest as ButtonProps
	return (
		<button
			{...buttonRest}
			className={sharedClass}
			style={{ ...sharedStyle, ...buttonRest.style }}
			onMouseEnter={handleMouseEnter as React.MouseEventHandler<HTMLButtonElement>}
			onMouseLeave={handleMouseLeave as React.MouseEventHandler<HTMLButtonElement>}
		>
			{icon}
			{children}
		</button>
	)
}
