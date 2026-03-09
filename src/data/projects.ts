export interface ProjectGalleryItem {
	src: string
	caption?: string
}

export interface Project {
	slug: string
	title: string
	description: string
	longDescription?: string
	image?: string
	gallery?: ProjectGalleryItem[]
	date: string
	tags: string[]
	liveUrl?: string
	githubUrl?: string
	featured?: boolean
}

export { projects } from '@data/projects'
