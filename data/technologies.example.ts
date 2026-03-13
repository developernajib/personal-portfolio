import type { Technology } from '@/data/technologies'

// NOTE: usage[] only lists notable job/project entries for context.
// Most technologies here have been used across many personal projects —
// listing all of them would add noise without adding value.

export const technologies: Technology[] = [
	// First 7 items appear on the home page preview
	{
		id: 'react',
		name: 'React',
		desc: 'JavaScript library for UIs',
		category: 'Frontend',
		icon: 'https://cdn.simpleicons.org/react/61DAFB',
		iconBg: '#61DAFB20',
		startDate: '2022-01-01',
		featured: true,
		usage: [
			{
				context: 'job',
				company: 'Your Company',
				role: 'Frontend Developer',
				from: '2022-01-01',
				to: '2024-01-01',
			},
			{ context: 'personal', label: 'Side Project', from: '2023-06-01' },
		],
	},
	{
		id: 'typescript',
		name: 'TypeScript',
		desc: 'Typed JavaScript',
		category: 'Language',
		icon: 'https://cdn.simpleicons.org/typescript/3178C6',
		iconBg: '#3178C620',
		startDate: '2022-06-01',
		featured: true,
		usage: [{ context: 'job', company: 'Your Company', from: '2022-06-01' }],
	},
	{
		id: 'nodejs',
		name: 'Node.js',
		desc: 'JS backend runtime',
		category: 'Backend',
		icon: 'https://cdn.simpleicons.org/nodedotjs/339933',
		iconBg: '#33993320',
		startDate: '2021-05-01',
		endDate: '2023-12-31', // set endDate if no longer using
		usage: [],
	},
]
