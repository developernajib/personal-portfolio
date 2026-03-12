import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

export interface AccentColor {
	name: string
	value: string
	dim: string
}

export const ACCENT_COLORS: AccentColor[] = [
	{ name: 'Cyan', value: '#00d5d9', dim: '#00b5b8' },
	{ name: 'Violet', value: '#a855f7', dim: '#9333ea' },
	{ name: 'Rose', value: '#f43f5e', dim: '#e11d48' },
	{ name: 'Amber', value: '#f59e0b', dim: '#d97706' },
	{ name: 'Emerald', value: '#10b981', dim: '#059669' },
	{ name: 'Blue', value: '#3b82f6', dim: '#2563eb' },
]

const DEFAULT_THEME: Theme = 'dark'
const DEFAULT_ACCENT = ACCENT_COLORS[0]

function applyAccent(accent: AccentColor) {
	const root = document.documentElement
	root.style.setProperty('--primary', accent.value)
	root.style.setProperty('--primary-dim', accent.dim)
}

interface ViewTransitionDocument extends Document {
	startViewTransition: (cb: () => void) => ViewTransition
}

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		const raw = localStorage.getItem('theme')
		return raw === 'dark' || raw === 'light' ? raw : DEFAULT_THEME
	})

	const [accent, setAccentState] = useState<AccentColor>(() => {
		const stored = localStorage.getItem('accent')
		return ACCENT_COLORS.find((c) => c.value === stored) ?? DEFAULT_ACCENT
	})

	// Apply theme attribute
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme)
	}, [theme])

	// Apply accent on mount and change
	useEffect(() => {
		applyAccent(accent)
		localStorage.setItem('accent', accent.value)
		localStorage.setItem('accentDim', accent.dim)
	}, [accent])

	const toggle = (e?: React.MouseEvent) => {
		const next = theme === 'dark' ? 'light' : 'dark'

		if ('startViewTransition' in document) {
			const x = e?.clientX ?? window.innerWidth / 2
			const y = e?.clientY ?? window.innerHeight / 2
			const maxR = Math.hypot(
				Math.max(x, window.innerWidth - x),
				Math.max(y, window.innerHeight - y)
			)
			const transition = (document as ViewTransitionDocument).startViewTransition(() => {
				setTheme(next)
			})
			transition.ready.then(() => {
				document.documentElement.animate(
					{
						clipPath: [
							`circle(0px at ${x}px ${y}px)`,
							`circle(${maxR}px at ${x}px ${y}px)`,
						],
					},
					{
						duration: 450,
						easing: 'ease-in-out',
						pseudoElement: '::view-transition-new(root)',
					}
				)
			})
		} else {
			setTheme(next)
		}
	}

	const setAccent = (a: AccentColor) => setAccentState(a)

	const resetToDefault = () => {
		localStorage.removeItem('theme')
		localStorage.removeItem('accent')
		localStorage.removeItem('accentDim')
		setTheme(DEFAULT_THEME)
		setAccentState(DEFAULT_ACCENT)
	}

	return { theme, toggle, accent, setAccent, resetToDefault }
}
