import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import Container from '@/components/ui/Container'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import ProjectDetailHeader from '@/components/project/ProjectDetailHeader'
import ProjectHeroImage from '@/components/project/ProjectHeroImage'
import ProjectDescription from '@/components/project/ProjectDescription'
import ProjectGallery from '@/components/project/ProjectGallery'
import { projects } from '@/data/projects'
import useDocTitle from '@/lib/hooks/useDocTitle'

export default function ProjectDetail() {
	const { slug } = useParams<{ slug: string }>()
	const project = projects.find((p) => p.slug === slug)
	useDocTitle(project?.title)

	if (!project) {
		return (
			<Container className="py-16 text-center">
				<p className="text-lg mb-4" style={{ color: 'var(--subtext)' }}>
					Project not found.
				</p>
				<Link
					to="/projects"
					className="flex items-center justify-center gap-1.5 text-sm transition-colors duration-150"
					style={{ color: 'var(--primary)' }}
				>
					<IconArrowLeft size={16} />
					Back to Projects
				</Link>
			</Container>
		)
	}

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10">
				<ProjectDetailHeader project={project} />

				{project.image && (
					<div
						className="mb-8 overflow-hidden rounded-xl border"
						style={{ borderColor: 'var(--overlay)' }}
					>
						<ProjectHeroImage src={project.image} alt={project.title} />
					</div>
				)}

				<ProjectDescription
					description={project.description}
					longDescription={project.longDescription}
				/>

				{project.gallery && project.gallery.length > 0 && (
					<ProjectGallery gallery={project.gallery} projectTitle={project.title} />
				)}
			</Container>
		</div>
	)
}
