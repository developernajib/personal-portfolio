export interface TechUsage {
	context: 'job' | 'freelance' | 'personal'
	company?: string
	role?: string
	label?: string
	from: string
	to?: string
}

export interface Technology {
	id: string
	name: string
	desc: string
	category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Language'
	icon: string
	iconBg: string
	startDate: string
	endDate?: string
	usage: TechUsage[]
	featured?: boolean
}

export { technologies } from '@data/technologies'
