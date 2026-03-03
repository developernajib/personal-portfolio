import { useEffect, useState } from 'react'
import type { Theme } from '@/lib/useTheme'

export function useDocumentTheme(): Theme {
	const [theme, setTheme] = useState<Theme>(
		() => (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark'
	)

	useEffect(() => {
		const observer = new MutationObserver(() => {
			const t = (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark'
			setTheme(t)
		})
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme'],
		})
		return () => observer.disconnect()
	}, [])

	return theme
}
