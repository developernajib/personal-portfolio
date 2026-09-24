// Copy this file to education.ts and fill in your own entries.
// Only degree, field, institution and startYear are required.
export interface EducationItem {
	degree: string
	field: string
	institution: string
	location?: string
	startYear: number
	endYear?: number
	cgpa?: number
	cgpaMax?: number
}

export const education: EducationItem[] = [
	{
		degree: 'Bachelor of Science',
		field: 'Computer Science',
		institution: 'Your University Name',
		location: 'Your City, Country',
		startYear: 2020,
		endYear: 2024,
		cgpa: 3.8,
		cgpaMax: 4.0,
	},
]
