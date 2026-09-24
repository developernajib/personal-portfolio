import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IconArrowLeft, IconCalendarEvent, IconExternalLink } from '@tabler/icons-react'
import Container from '@/components/ui/Container'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import TagBadge from '@/components/ui/TagBadge'
import ProjectHeroImage from '@/components/project/ProjectHeroImage'
import ProjectDescription from '@/components/project/ProjectDescription'
import ProjectGallery from '@/components/project/ProjectGallery'
import { certificates } from '@/data/certificates'
import { formatDate, isValidHttpUrl } from '@/lib/utils'
import useDocTitle from '@/lib/hooks/useDocTitle'

export default function CertificateDetail() {
	const { id } = useParams<{ id: string }>()
	const certificate = certificates.find((c) => c.id === id)
	useDocTitle(certificate?.title)
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
	const gallery = certificate?.gallery ?? []
	const heroIndex = Math.max(
		0,
		gallery.findIndex((g) => g.src === certificate?.image)
	)

	if (!certificate) {
		return (
			<Container className="py-16 text-center">
				<p className="text-lg mb-4" style={{ color: 'var(--subtext)' }}>
					Certificate not found.
				</p>
				<Link
					to="/certificates"
					className="flex items-center justify-center gap-1.5 text-sm transition-colors duration-150"
					style={{ color: 'var(--primary)' }}
				>
					<IconArrowLeft size={16} />
					Back to Certificates
				</Link>
			</Container>
		)
	}

	const credential =
		certificate.credentialUrl && isValidHttpUrl(certificate.credentialUrl)
			? certificate.credentialUrl
			: null

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10">
				<Link
					to="/certificates"
					className="hover-primary mb-6 inline-flex items-center gap-1.5 text-sm"
					style={{ color: 'var(--subtext)' }}
				>
					<IconArrowLeft size={16} />
					All Certificates
				</Link>

				<div className="mb-6">
					<h1
						className="text-xl font-bold mb-2 sm:text-2xl"
						style={{ color: 'var(--text)' }}
					>
						{certificate.title}
					</h1>

					<div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
						<span className="text-xs" style={{ color: 'var(--primary)' }}>
							{certificate.issuer}
						</span>
						{certificate.date && (
							<div
								className="flex items-center gap-1.5 text-xs"
								style={{ color: 'var(--subtext)' }}
							>
								<IconCalendarEvent size={13} />
								{formatDate(certificate.date)}
							</div>
						)}
					</div>

					{certificate.skills && certificate.skills.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{certificate.skills.map((skill) => (
								<TagBadge key={skill} tag={skill} />
							))}
						</div>
					)}
				</div>

				{certificate.image && (
					<div
						className="mx-auto mb-8 max-w-2xl overflow-hidden rounded-xl border"
						style={{
							borderColor: 'var(--overlay)',
							backgroundColor: 'var(--bg-surface)',
						}}
					>
						<ProjectHeroImage
							src={certificate.image}
							alt={certificate.title}
							contain
							onOpen={
								gallery.length > 0 ? () => setLightboxIndex(heroIndex) : undefined
							}
						/>
					</div>
				)}

				{certificate.description && (
					<ProjectDescription
						title="Certificate Details"
						description={certificate.description}
					/>
				)}

				{gallery.length > 0 && (
					<ProjectGallery
						title="Certificate Images"
						gallery={gallery}
						projectTitle={certificate.title}
						lightboxIndex={lightboxIndex}
						onLightboxChange={setLightboxIndex}
					/>
				)}

				{credential && (
					<div className="mt-8 flex flex-wrap gap-2">
						<a
							href={credential}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium border hover-bg-primary-up"
							style={{
								color: 'var(--primary)',
								borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.3)',
								backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.08)',
							}}
						>
							<IconExternalLink size={13} />
							Verify Credential
						</a>
					</div>
				)}
			</Container>
		</div>
	)
}
