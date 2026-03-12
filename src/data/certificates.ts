export interface Certificate {
	id: string
	title: string
	issuer: string
	date: string
	image?: string
	credentialUrl?: string
	description?: string
	skills?: string[]
}

export { certificates } from '@data/certificates'
