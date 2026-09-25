import { useState } from 'react'

const STORAGE_KEY = 'devnajib-visited-projects'

export function getVisitedProjects(): string[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		const parsed: unknown = raw ? JSON.parse(raw) : []
		return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
	} catch {
		return []
	}
}

export function markProjectVisited(slug: string) {
	try {
		const visited = getVisitedProjects()
		if (!visited.includes(slug)) {
			visited.push(slug)
			localStorage.setItem(STORAGE_KEY, JSON.stringify(visited))
		}
	} catch {
		// Storage unavailable, visited seals simply stay hidden
	}
}

export function useVisitedProjects(): Set<string> {
	const [visited] = useState<string[]>(() => getVisitedProjects())
	return new Set(visited)
}
