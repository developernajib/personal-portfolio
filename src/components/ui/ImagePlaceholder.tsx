import { IconPhoto } from '@tabler/icons-react'

interface ImagePlaceholderProps {
	label?: string
	className?: string
}

export default function ImagePlaceholder({ label, className = '' }: ImagePlaceholderProps) {
	return (
		<div
			className={`flex h-full w-full flex-col items-center justify-center gap-2 ${className}`}
			style={{ backgroundColor: 'var(--bg-mantle)' }}
		>
			<IconPhoto size={28} style={{ color: 'var(--subtext)' }} />
			{label && (
				<span className="text-xs font-mono" style={{ color: 'var(--subtext)' }}>
					{label}
				</span>
			)}
		</div>
	)
}
