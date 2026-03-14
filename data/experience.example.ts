import type { ExperienceItem } from '@/data/experience'

export const experience: ExperienceItem[] = [
	{
		id: 'software-engineer-at-your-company',
		role: 'Software Engineer',
		company: 'Your Company',
		companyUrl: 'https://yourcompany.com',
		location: 'Your City, Country',
		logoUrl: '/logos/company.png',
		logoAlt: 'Company logo',
		startDate: '2022-01-01',
		// endDate: '2024-01-01', // omit if current job
		description: 'What you did at this company.',
		details: 'Longer description of your role and achievements.',
		tags: ['React', 'Node.js', 'TypeScript'],
		featured: true,
		type: 'fulltime',
		projects: [
			{
				name: 'Project Name',
				purpose: 'Internal tool',
				description: 'What this project does.',
				tags: ['React', 'Node.js'],
				url: 'https://project.com',
			},
		],
		manager: {
			name: 'Manager Name',
			title: 'Engineering Manager',
			email: 'manager@company.com',
			linkedin: 'https://linkedin.com/in/manager',
		},
		team: [
			{
				name: 'Colleague Name',
				position: 'Backend Developer',
				email: 'colleague@company.com',
				github: 'https://github.com/colleague',
				linkedin: 'https://linkedin.com/in/colleague',
			},
		],
		gallery: [{ src: '/gallery/photo1.webp', caption: 'Team photo' }],
	},
	{
		id: 'freelance-at-some-company',
		role: 'Freelance Developer',
		company: 'Some Company',
		companyUrl: '#',
		startDate: '2021-06-01',
		endDate: '2021-12-31',
		description: 'Freelance work description.',
		tags: ['PHP', 'Laravel'],
		type: 'freelance',
		noDetail: true, // set true to hide the detail page link
		projects: [],
		gallery: [],
	},
]
