import type { Certificate } from '@/data/certificates'

export const certificates: Certificate[] = [
	{
		order: 1,
		id: 'my-certificate',
		title: 'Certificate Title',
		issuer: 'Issuing Organization',
		date: '2023-01-01',
		image: '/certificates/my-cert.webp',
		gallery: [
			{ src: '/certificates/my-cert.webp', caption: 'Front side' },
			{ src: '/certificates/my-cert-back.webp', caption: 'Back side' },
		],
		credentialUrl: 'https://verify.example.com/cert-id',
		description: 'What this certificate covers.',
		skills: ['Skill 1', 'Skill 2'],
	},
	{
		order: 2,
		id: 'another-certificate',
		title: 'Another Certificate',
		issuer: 'Udemy',
		date: '2022-06-15',
		image: '/certificates/another-cert.webp',
		credentialUrl: 'https://udemy.com/certificate',
		description: 'Deep dive into a specific technology.',
		skills: ['TypeScript', 'React', 'NodeJS'],
	},
]
