import type { Project } from '@/data/projects'

export const projects: Project[] = [
	{
		slug: 'my-project',
		title: 'My Project',
		description: 'A short description of the project.',
		longDescription: `Longer description with **markdown** support.

**Features:**
- Feature one
- Feature two
- Feature three`,
		image: '/projects/my-project.webp',
		gallery: [
			{ src: '/projects/my-project-1.webp', caption: 'Home page' },
			{ src: '/projects/my-project-2.webp', caption: 'Dashboard' },
		],
		date: '2024-01-01',
		tags: ['React', 'TypeScript'],
		liveUrl: 'https://myproject.com',
		extraLiveUrls: [
			{ label: 'Play Store', url: 'https://play.google.com/store/apps/details?id=example' },
		],
		githubUrl: 'https://github.com/yourusername/my-project',
		featured: true,
		order: 1,
	},
	{
		slug: 'another-project',
		title: 'Another Project',
		description: 'Another project description.',
		image: '/projects/another-project.webp',
		date: '2023-06-15',
		tags: ['Laravel', 'VueJS', 'MySQL'],
		githubUrl: 'https://github.com/yourusername/another-project',
		order: 2,
	},
]
