export interface WorkingOnItem {
	title: string
	subtitle: string
	url?: string
}

export const currentlyWorkingOn: WorkingOnItem[] = [
	{
		title: 'My Project',
		subtitle: 'What stack / description',
		url: 'https://github.com/yourusername/my-project',
	},
]

export const currentlyLearning: WorkingOnItem[] = [
	{
		title: 'Learning',
		subtitle: 'What you are learning',
	},
]
