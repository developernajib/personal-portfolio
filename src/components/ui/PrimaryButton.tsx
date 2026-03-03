import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: ReactNode
}

export default function PrimaryButton({ icon, children, className = '', ...rest }: Props) {
	return (
		<button
			{...rest}
			className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border transition-colors duration-150 cursor-pointer ${className}`}
			style={{
				color: 'var(--primary)',
				borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.3)',
				backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.08)',
				...rest.style,
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.backgroundColor = 'rgba(var(--primary-rgb, 0,213,217),0.15)'
				rest.onMouseEnter?.(e)
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.backgroundColor = 'rgba(var(--primary-rgb, 0,213,217),0.08)'
				rest.onMouseLeave?.(e)
			}}
		>
			{icon}
			{children}
		</button>
	)
}
