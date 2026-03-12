import type { ComponentType } from 'react'
import {
	IconHome,
	IconFolder,
	IconBriefcase,
	IconCode,
	IconCertificate,
	IconUser,
} from '@tabler/icons-react'
import {
	preloadAbout,
	preloadProjects,
	preloadExperience,
	preloadCertificates,
	preloadTechnologies,
} from '@/routes/preload'

export interface NavItem {
	title: string
	href: string
	external?: boolean
	preload?: () => Promise<unknown>
	icon?: ComponentType<{ size?: number; stroke?: number }>
}

export const mainNavItems: NavItem[] = [
	{ title: 'Home', href: '/', icon: IconHome },
	{ title: 'About', href: '/about', preload: preloadAbout, icon: IconUser },
	{ title: 'Projects', href: '/projects', preload: preloadProjects, icon: IconFolder },
	{ title: 'Experience', href: '/experience', preload: preloadExperience, icon: IconBriefcase },
	{ title: 'Technologies', href: '/technologies', preload: preloadTechnologies, icon: IconCode },
	{
		title: 'Certificates',
		href: '/certificates',
		preload: preloadCertificates,
		icon: IconCertificate,
	},
]

/** Primary items shown directly on the bottom nav bar (mobile): Home, About, Experience, Technologies */
export const bottomNavItems = mainNavItems.filter((item) =>
	['/', '/about', '/experience', '/technologies'].includes(item.href)
)

/** Secondary items shown in the "More" drawer (mobile): Projects, Certificates */
export const moreNavItems = mainNavItems.filter((item) =>
	['/projects', '/certificates'].includes(item.href)
)
