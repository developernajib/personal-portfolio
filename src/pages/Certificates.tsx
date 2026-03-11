import { useState } from 'react'
import Container from '@/components/ui/Container'
import { IconCertificate } from '@tabler/icons-react'
import SlabTitle from '@/components/ui/SlabTitle'
import CertificateCard from '@/components/ui/CertificateCard'
import Lightbox from '@/components/ui/Lightbox'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import { certificates } from '@/data/certificates'
import type { Certificate } from '@/data/certificates'
import useDocTitle from '@/lib/hooks/useDocTitle'

export default function Certificates() {
	useDocTitle('Certificates')
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

	const lightboxItems = certificates.map((c) => ({
		src: c.image || '',
		alt: c.title,
		caption: `${c.title} — ${c.issuer}`,
	}))

	function openLightbox(cert: Certificate) {
		const idx = certificates.findIndex((c) => c.id === cert.id)
		if (idx !== -1 && cert.image) {
			setLightboxIndex(idx)
		}
	}

	function closeLightbox() {
		setLightboxIndex(null)
	}

	function prevImage() {
		setLightboxIndex((prev) =>
			prev !== null ? (prev - 1 + lightboxItems.length) % lightboxItems.length : null
		)
	}

	function nextImage() {
		setLightboxIndex((prev) => (prev !== null ? (prev + 1) % lightboxItems.length : null))
	}

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10">
				<div className="mb-8 flex items-center gap-3">
					<IconCertificate size={28} color="var(--primary)" />
					<SlabTitle title="Certificates" config="4c" as="h1" />
				</div>

				<p className="mb-8 text-sm" style={{ color: 'var(--subtext)' }}>
					Certifications and professional development courses I've completed.{' '}
					<span style={{ color: 'var(--overlay)' }}>
						Click a certificate image to view it full-screen.
					</span>
				</p>

				{certificates.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{certificates.map((cert) => (
							<CertificateCard
								key={cert.id}
								certificate={cert}
								onImageClick={openLightbox}
							/>
						))}
					</div>
				) : (
					<p style={{ color: 'var(--subtext)' }}>No certificates yet.</p>
				)}
			</Container>

			{/* Lightbox */}
			{lightboxIndex !== null && lightboxItems[lightboxIndex]?.src && (
				<Lightbox
					items={lightboxItems.filter((item) => item.src)}
					currentIndex={lightboxIndex}
					onClose={closeLightbox}
					onPrev={prevImage}
					onNext={nextImage}
				/>
			)}
		</div>
	)
}
