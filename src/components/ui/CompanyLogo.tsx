import { useState } from 'react'
import { useDocumentTheme } from '@/lib/hooks/useDocumentTheme'

interface Props {
	logoUrl?: string
	logoAlt?: string
	company: string
	size?: 'sm' | 'md' | 'lg'
	color?: string
}

const SIZE_MAP = {
	sm: { container: 'w-7 h-7 rounded-md', text: 'text-xs', padding: 'p-0.5' },
	md: { container: 'w-11 h-11 rounded-lg', text: 'text-lg', padding: 'p-1.5' },
	lg: { container: 'w-16 h-16 rounded-xl', text: 'text-2xl', padding: 'p-2' },
}

export default function CompanyLogo({ logoUrl, logoAlt, company, size = 'md', color }: Props) {
	const [imgError, setImgError] = useState(false)
	const theme = useDocumentTheme()
	const s = SIZE_MAP[size]
	const fallbackColor = color ?? 'var(--subtext)'

	const logoBg =
		logoUrl && !imgError ? (theme === 'dark' ? '#1e2127' : '#ffffff') : 'var(--bg-mantle)'

	return (
		<div
			className={`flex-shrink-0 ${s.container} overflow-hidden flex items-center justify-center border`}
			style={{ backgroundColor: logoBg, borderColor: 'var(--overlay)' }}
		>
			{logoUrl && !imgError ? (
				<img
					src={logoUrl}
					alt={logoAlt || company}
					className={`w-full h-full object-contain ${s.padding}`}
					onError={() => setImgError(true)}
				/>
			) : (
				<span className={`font-bold ${s.text}`} style={{ color: fallbackColor }}>
					{company.charAt(0)}
				</span>
			)}
		</div>
	)
}
