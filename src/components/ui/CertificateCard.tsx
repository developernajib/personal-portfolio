import { useState } from 'react'
import { IconCertificate, IconExternalLink } from '@tabler/icons-react'
import { formatDate } from '@/lib/utils'
import TagBadge from './TagBadge'
import type { Certificate } from '@/data/certificates'

interface CertificateCardProps {
	certificate: Certificate
	onImageClick: (certificate: Certificate) => void
}

export default function CertificateCard({ certificate, onImageClick }: CertificateCardProps) {
	const [imgError, setImgError] = useState(false)

	return (
		<div
			className="hover-border-primary group rounded-xl border overflow-hidden"
			style={{
				backgroundColor: 'var(--bg-surface)',
				borderColor: 'var(--overlay)',
			}}
		>
			{/* Certificate Image / Badge */}
			<button
				onClick={() => onImageClick(certificate)}
				className="relative block w-full aspect-video overflow-hidden cursor-zoom-in"
				aria-label={`View ${certificate.title} certificate`}
			>
				{certificate.image && !imgError ? (
					<img
						src={certificate.image}
						alt={certificate.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
						decoding="async"
						onError={() => setImgError(true)}
					/>
				) : null}
				{/* Fallback — only shown when no image or load error */}
				{(!certificate.image || imgError) && (
					<div
						className="absolute inset-0 flex items-center justify-center"
						style={{ backgroundColor: 'var(--bg-mantle)' }}
					>
						<IconCertificate size={48} color="var(--primary)" opacity={0.4} />
					</div>
				)}
				{/* Hover overlay */}
				<div
					className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
					style={{ backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.1)' }}
				/>
			</button>

			{/* Content */}
			<div className="p-4 space-y-2">
				<h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--text)' }}>
					{certificate.title}
				</h3>

				<div className="flex items-center justify-between gap-2">
					<span className="text-xs" style={{ color: 'var(--primary)' }}>
						{certificate.issuer}
					</span>
					<span className="text-xs" style={{ color: 'var(--subtext)' }}>
						{formatDate(certificate.date, { yearMonthOnly: true })}
					</span>
				</div>

				{certificate.description && (
					<p className="text-xs line-clamp-2" style={{ color: 'var(--subtext)' }}>
						{certificate.description}
					</p>
				)}

				{certificate.skills && certificate.skills.length > 0 && (
					<div className="flex flex-wrap gap-1 pt-1">
						{certificate.skills.slice(0, 4).map((skill) => (
							<TagBadge key={skill} tag={skill} />
						))}
					</div>
				)}

				{certificate.credentialUrl && (
					<a
						href={certificate.credentialUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover-primary inline-flex items-center gap-1 text-xs pt-1"
						style={{ color: 'var(--subtext)' }}
						onClick={(e) => e.stopPropagation()}
					>
						<IconExternalLink size={12} />
						Verify credential
					</a>
				)}
			</div>
		</div>
	)
}
