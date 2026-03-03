import type { TechUsage } from '@/data/technologies'

// Experience type metadata
export const EXPERIENCE_TYPE_LABEL: Record<string, string> = {
	fulltime: 'Full-time',
	freelance: 'Freelance',
	contract: 'Contract',
	parttime: 'Part-time',
}

export const EXPERIENCE_TYPE_COLOR: Record<string, string> = {
	fulltime: '#00D5D9',
	freelance: '#a855f7',
	contract: '#fb923c',
	parttime: '#34d399',
}

export const EXPERIENCE_TYPE_BG: Record<string, string> = {
	fulltime: 'rgba(0,213,217,0.12)',
	freelance: 'rgba(168,85,247,0.12)',
	contract: 'rgba(251,146,60,0.12)',
	parttime: 'rgba(52,211,153,0.12)',
}

// Tech context metadata
export const TECH_CONTEXT_COLOR: Record<string, string> = {
	job: '#00D5D9',
	freelance: '#a855f7',
	personal: '#f59e0b',
}

export function TECH_CONTEXT_LABEL_FN(u: TechUsage): string {
	if (u.context === 'job') return u.company ?? ''
	if (u.context === 'freelance') return u.company ?? 'Freelance'
	return u.label ?? 'Personal Projects'
}

// Home tech preview count
export const HOME_TECH_PREVIEW_COUNT = 7
