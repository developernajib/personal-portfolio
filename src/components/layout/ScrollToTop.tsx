import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
	const { pathname } = useLocation()
	const first = useRef(true)

	useEffect(() => {
		// Skip the initial mount so browser refresh keeps its restored position.
		// Only menu changes scroll back to the top.
		if (first.current) {
			first.current = false
			return
		}
		window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
	}, [pathname])

	return null
}
