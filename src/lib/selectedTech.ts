import { useState, useEffect } from 'react'

const SELECTED_KEY = 'devnajib-selected-tech'

export function readSelectedTech(): string[] {
	try {
		const raw = localStorage.getItem(SELECTED_KEY)
		const parsed: unknown = raw ? JSON.parse(raw) : []
		return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
	} catch {
		return []
	}
}

export function writeSelectedTech(ids: string[]) {
	try {
		localStorage.setItem(SELECTED_KEY, JSON.stringify(ids))
	} catch {
		// Storage unavailable, selection simply resets on reload
	}
}

export function useSelectedTech(): [string[], (ids: string[]) => void] {
	const [ids, setIds] = useState<string[]>(readSelectedTech)

	useEffect(() => {
		writeSelectedTech(ids)
	}, [ids])

	return [ids, setIds]
}
