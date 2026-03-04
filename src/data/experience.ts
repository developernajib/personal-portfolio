export interface ExperienceProject {
	name: string
	purpose: string
	description: string
	tags: string[]
	url?: string
}

export interface ExperienceManager {
	name: string
	title: string
	email?: string
	linkedin?: string
	github?: string
}

export interface TeamMember {
	name: string
	position: string
	photo?: string
	email?: string
	linkedin?: string
	github?: string
}

export interface ExperienceGalleryItem {
	src: string
	caption?: string
}

export interface ExperienceItem {
	id: string
	role: string
	company: string
	companyUrl: string
	location?: string
	logoUrl?: string
	logoAlt?: string
	startDate: string
	endDate?: string
	description: string
	details?: string
	tags: string[]
	featured?: boolean
	type: 'fulltime' | 'freelance' | 'contract' | 'parttime'
	projects?: ExperienceProject[]
	manager?: ExperienceManager
	team?: TeamMember[]
	gallery?: ExperienceGalleryItem[]
	noDetail?: boolean
}

export { experience } from '@data/experience'
