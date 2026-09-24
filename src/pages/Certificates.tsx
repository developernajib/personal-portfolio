import { useMemo } from 'react'
import Container from '@/components/ui/Container'
import { IconCertificate } from '@tabler/icons-react'
import SlabTitle from '@/components/ui/SlabTitle'
import CertificateCard from '@/components/ui/CertificateCard'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import { certificates } from '@/data/certificates'
import { sortByOrder } from '@/lib/sort'
import useDocTitle from '@/lib/hooks/useDocTitle'

export default function Certificates() {
	useDocTitle('Certificates')

	const ordered = useMemo(() => sortByOrder(certificates), [])

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10">
				<div className="mb-8 flex items-center gap-3">
					<IconCertificate size={28} color="var(--primary)" />
					<SlabTitle title="Certificates" config="4c" as="h1" />
				</div>

				<p className="mb-8 text-sm" style={{ color: 'var(--subtext)' }}>
					Certifications and professional development courses I've completed.
				</p>

				{ordered.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{ordered.map((cert) => (
							<CertificateCard key={cert.id} certificate={cert} />
						))}
					</div>
				) : (
					<p style={{ color: 'var(--subtext)' }}>No certificates yet.</p>
				)}
			</Container>
		</div>
	)
}
