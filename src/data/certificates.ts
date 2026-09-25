export interface CertificateGalleryItem {
	src: string
	caption?: string
}

export interface Certificate {
	id: string
	title: string
	issuer: string
	date: string
	image?: string
	gallery?: CertificateGalleryItem[]
	credentialUrl?: string
	description?: string
	skills?: string[]
	order?: number
}

export { certificates } from '@data/certificates'
