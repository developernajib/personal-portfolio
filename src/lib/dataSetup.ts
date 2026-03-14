// Vite's dataFallbackPlugin injects `__missing = true` into stub modules
// when the real data file doesn't exist in /data.
// We use namespace imports + a helper to safely read that flag without
// polluting the module types with ambient declarations.
import * as _projects from '@data/projects'
import * as _experience from '@data/experience'
import * as _certificates from '@data/certificates'
import * as _technologies from '@data/technologies'
import * as _education from '@data/education'
import * as _workingOn from '@data/currentlyWorkingOn'
import * as _config from '@data/config'

function isMissing(mod: unknown): boolean {
	return (mod as { __missing?: boolean }).__missing === true
}

interface MissingFile {
	file: string
	example: string
	description: string
}

const ALL_FILES: Array<{ missing: boolean } & MissingFile> = [
	{
		missing: isMissing(_config),
		file: 'data/config.ts',
		example: 'data/config.example.ts',
		description: 'Site configuration (name, title, links)',
	},
	{
		missing: isMissing(_projects),
		file: 'data/projects.ts',
		example: 'data/projects.example.ts',
		description: 'Portfolio projects',
	},
	{
		missing: isMissing(_experience),
		file: 'data/experience.ts',
		example: 'data/experience.example.ts',
		description: 'Work experience',
	},
	{
		missing: isMissing(_certificates),
		file: 'data/certificates.ts',
		example: 'data/certificates.example.ts',
		description: 'Certificates & achievements',
	},
	{
		missing: isMissing(_technologies),
		file: 'data/technologies.ts',
		example: 'data/technologies.example.ts',
		description: 'Tech stack',
	},
	{
		missing: isMissing(_education),
		file: 'data/education.ts',
		example: 'data/education.example.ts',
		description: 'Education history',
	},
	{
		missing: isMissing(_workingOn),
		file: 'data/currentlyWorkingOn.ts',
		example: 'data/currentlyWorkingOn.example.ts',
		description: 'Currently working on & learning',
	},
]

export const missingDataFiles: MissingFile[] = ALL_FILES.filter((f) => f.missing).map(
	({ file, example, description }) => ({ file, example, description })
)

export const setupRequired = missingDataFiles.length > 0
