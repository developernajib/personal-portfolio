import type { Certificate } from '@/data/certificates'

export const certificates: Certificate[] = [
	{
		id: 'my-certificate',
		title: 'Certificate Title',
		issuer: 'Issuing Organization',
		date: '2023-01-01',
		image: '/certificates/my-cert.webp',
		credentialUrl: 'https://verify.example.com/cert-id',
		description: 'What this certificate covers.',
		skills: ['Skill 1', 'Skill 2'],
	},
	{
		id: 'another-certificate',
		title: 'Another Certificate',
		issuer: 'Udemy',
		date: '2022-06-15',
		image: '/certificates/another-cert.webp',
		credentialUrl: 'https://udemy.com/certificate',
		description: 'Deep dive into a specific technology.',
		skills: ['TypeScript', 'React', 'Node.js'],
	},
]
