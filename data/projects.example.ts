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
		githubUrl: 'https://github.com/yourusername/my-project',
		featured: true,
	},
	{
		slug: 'another-project',
		title: 'Another Project',
		description: 'Another project description.',
		image: '/projects/another-project.webp',
		date: '2023-06-15',
		tags: ['Laravel', 'Vue.js', 'MySQL'],
		githubUrl: 'https://github.com/yourusername/another-project',
	},
]
