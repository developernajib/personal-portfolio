import type { ReactNode } from 'react'

const sizeClasses = {
	'3xl': 'max-w-3xl',
	'4xl': 'max-w-4xl',
	'6xl': 'max-w-6xl',
} as const

export default function Container({
	children,
	className = '',
	size = '6xl',
}: {
	children: ReactNode
	className?: string
	size?: keyof typeof sizeClasses
}) {
	return (
		<div className={`mx-auto w-full px-4 md:px-6 ${sizeClasses[size]} ${className}`}>
			{children}
		</div>
	)
}
