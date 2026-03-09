import { lazy, Suspense, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowRight, IconLayoutGrid } from '@tabler/icons-react'
import useDocTitle from '@/lib/hooks/useDocTitle'
import Container from '@/components/ui/Container'
import HeroSection from '@/components/home/HeroSection'
import TechPreviewSection from '@/components/home/TechPreviewSection'
import ExperienceSection from '@/components/home/ExperienceSection'
import EducationSection from '@/components/home/EducationSection'
import ProjectCard from '@/components/ui/ProjectCard'
import { projects } from '@/data/projects'

// Heavy below-the-fold components — lazy loaded
const BackgroundEffect = lazy(() => import('@/components/ui/BackgroundEffect'))
const GitHubActivity = lazy(() => import('@/components/bento/GitHubActivity'))
const LocationMap = lazy(() => import('@/components/bento/LocationMap'))
const CurrentlyWorkingOn = lazy(() => import('@/components/bento/CurrentlyWorkingOn'))
const ConnectCTA = lazy(() => import('@/components/home/ConnectCTA'))

function SectionSkeleton({ height = 200 }: { height?: number }) {
	return (
		<div
			className="rounded-xl animate-pulse"
			style={{ height, backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
		/>
	)
}

export default function Home() {
	useDocTitle()
	const featuredProjects = useMemo(() => projects.filter((p) => p.featured), [])

	return (
		<div className="relative">
			{/* Background is non-critical — load lazily */}
			<Suspense fallback={null}>
				<BackgroundEffect />
			</Suspense>

			<Container className="relative z-10 space-y-10 py-8 md:py-10">
				{/* Above the fold — eager, no Suspense wrapper needed */}
				<HeroSection />
				<TechPreviewSection />
				<ExperienceSection />

				{/* Featured Projects — data is local so renders fast, no skeleton needed */}
				<section>
					<div className="mb-5 flex items-center justify-between">
						<h2
							className="flex items-center gap-2 text-xl font-bold"
							style={{ color: 'var(--text)' }}
						>
							<IconLayoutGrid size={22} color="var(--primary)" />
							Featured Projects
						</h2>
						<Link
							to="/projects"
							className="flex items-center gap-1 text-sm hover-primary"
							style={{ color: 'var(--subtext)' }}
						>
							View all
							<IconArrowRight size={14} />
						</Link>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{featuredProjects.slice(0, 4).map((project) => (
							<ProjectCard key={project.slug} project={project} />
						))}
					</div>
				</section>

				{/* GitHub Activity — makes network requests, lazy load */}
				<Suspense fallback={<SectionSkeleton height={240} />}>
					<GitHubActivity />
				</Suspense>

				{/* Education */}
				<EducationSection />

				{/* Bento Grid — LocationMap loads Leaflet, lazy load the whole row */}
				<section>
					<h2 className="mb-5 text-xl font-bold" style={{ color: 'var(--text)' }}>
						More About Me
					</h2>

					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
						<div className="lg:col-span-1 flex flex-col">
							<Suspense fallback={<SectionSkeleton height={200} />}>
								<LocationMap />
							</Suspense>
						</div>
						<div className="lg:col-span-1 flex flex-col">
							<Suspense fallback={<SectionSkeleton height={200} />}>
								<CurrentlyWorkingOn />
							</Suspense>
						</div>
						<div className="lg:col-span-1 flex flex-col">
							<Suspense fallback={<SectionSkeleton height={200} />}>
								<ConnectCTA />
							</Suspense>
						</div>
					</div>
				</section>
			</Container>
		</div>
	)
}
