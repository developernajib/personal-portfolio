import { useEffect } from 'react'
import Site from '@/lib/config'

export default function useDocTitle(page?: string) {
	useEffect(() => {
		document.title = page ? `${page} — ${Site.fullName}` : `${Site.fullName} — Portfolio`
		return () => {
			document.title = Site.fullName
		}
	}, [page])
}
