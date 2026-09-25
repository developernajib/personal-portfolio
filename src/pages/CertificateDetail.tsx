import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
	IconArrowLeft,
	IconArrowRight,
	IconAward,
	IconBuilding,
	IconCalendarEvent,
	IconCertificate,
	IconCheck,
	IconExternalLink,
	IconFileDescription,
	IconId,
	IconLink,
	IconListCheck,
	IconPhoto,
	IconSparkles,
} from '@tabler/icons-react'
import Container from '@/components/ui/Container'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import TagBadge from '@/components/ui/TagBadge'
import Tooltip from '@/components/ui/Tooltip'
import ProjectHeroImage from '@/components/project/ProjectHeroImage'
import ProjectGallery from '@/components/project/ProjectGallery'
import { certificates } from '@/data/certificates'
import { formatDate, isValidHttpUrl } from '@/lib/utils'
import { sortByOrder } from '@/lib/sort'
import { toast } from '@/components/ui/Toast'
import useDocTitle from '@/lib/hooks/useDocTitle'
import type { Certificate } from '@/data/certificates'

function extractCredentialId(description?: string): string | null {
	if (!description) return null
	const match = description.match(
		/(certificate ID|certificate code|certificate number|registration no|certificate no)\s*[:#-]?\s*([A-Za-z0-9-]+)/i
	)
	return match?.[2] ?? null
}

function extractDuration(description?: string): string | null {
	if (!description) return null
	const range = description.match(/\(([^)]*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[^)]*)\)/i)
	if (range?.[1]) return range[1].trim()
	const length = description.match(/(\d+(?:\.\d+)?\s*(?:hour|hours|month|months|week|weeks)[^,.]*)/i)
	return length?.[1]?.trim() ?? null
}

function extractGrade(description?: string): string | null {
	if (!description) return null
	const match = description.match(/grade\s*:\s*([A-Z][+-]?)/i)
	return match?.[1] ?? null
}

function extractDistinctions(description?: string): string[] {
	if (!description) return []
	const notes: string[] = []
	const text = description.toLowerCase()
	if (text.includes('batch topper')) notes.push('Finished as batch topper for strong overall performance')
	if (text.includes('exceptional performance')) notes.push('Recognized for exceptional performance during the program')
	if (text.includes('spectacular performance')) notes.push('Recognized for spectacular performance across the full program')
	if (text.includes('final test')) notes.push('Cleared the final assessment to earn this credential')
	if (text.includes('dedication')) notes.push('Completed the program with consistent effort and dedication')
	if (text.includes('appreciation')) notes.push('Received formal appreciation from the issuing team')
	return [...new Set(notes)]
}

function getRelated(current: Certificate, all: Certificate[]): Certificate[] {
	const others = all.filter((c) => c.id !== current.id)
	const sameIssuer = others.filter((c) => c.issuer === current.issuer)
	const currentSkills = new Set(current.skills ?? [])
	const sharedSkills = others
		.filter((c) => c.issuer !== current.issuer)
		.map((c) => ({
			cert: c,
			overlap: (c.skills ?? []).filter((s) => currentSkills.has(s)).length,
		}))
		.filter((entry) => entry.overlap > 0)
		.sort((a, b) => b.overlap - a.overlap)
		.map((entry) => entry.cert)
	const merged = [...sameIssuer, ...sharedSkills]
	const seen = new Set<string>()
	return merged.filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true))).slice(0, 3)
}

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

	const ordered = useMemo(() => sortByOrder(certificates), [])
	const currentIndex = ordered.findIndex((c) => c.id === id)
	const prev = currentIndex > 0 ? ordered[currentIndex - 1] : null
	const next =
		currentIndex >= 0 && currentIndex < ordered.length - 1
			? ordered[currentIndex + 1]
			: null
	const related = useMemo(
		() => (certificate ? getRelated(certificate, ordered) : []),
		[certificate, ordered]
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
	const credentialId = extractCredentialId(certificate.description)
	const skills = certificate.skills ?? []
	const issuedLabel = certificate.date ? formatDate(certificate.date) : 'Date not listed'
	const duration = extractDuration(certificate.description)
	const grade = extractGrade(certificate.description)
	const distinctions = extractDistinctions(certificate.description)
	const focusSkills = skills.slice(0, 3).join(', ')
	const facts = [
		{ label: 'Program', value: certificate.title },
		{ label: 'Issuer', value: certificate.issuer },
		{ label: 'Issued', value: issuedLabel },
		...(duration ? [{ label: 'Duration', value: duration }] : []),
		...(grade ? [{ label: 'Grade', value: `Grade ${grade}` }] : []),
		...(credentialId ? [{ label: 'Credential ID', value: credentialId }] : []),
	]

	function copyLink() {
		const url = `${window.location.origin}/certificates/${certificate?.id}`
		navigator.clipboard
			.writeText(url)
			.then(() => toast('Certificate link copied', 'success'))
			.catch(() => toast('Failed to copy link', 'error'))
	}

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 py-8 md:py-10">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
					<Link
						to="/certificates"
						className="hover-primary inline-flex items-center gap-1.5 text-sm"
						style={{ color: 'var(--subtext)' }}
					>
						<IconArrowLeft size={16} />
						All Certificates
					</Link>
					<div className="flex items-center gap-2">
						{prev ? (
							<Tooltip content={prev.title} position="bottom">
								<Link
									to={`/certificates/${prev.id}`}
									className="hover-border-primary inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs"
									style={{
										color: 'var(--subtext)',
										borderColor: 'var(--overlay)',
										backgroundColor: 'var(--bg-surface)',
									}}
									aria-label={`Previous certificate ${prev.title}`}
								>
									<IconArrowLeft size={13} />
									Prev
								</Link>
							</Tooltip>
						) : null}
						{next ? (
							<Tooltip content={next.title} position="bottom">
								<Link
									to={`/certificates/${next.id}`}
									className="hover-border-primary inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs"
									style={{
										color: 'var(--subtext)',
										borderColor: 'var(--overlay)',
										backgroundColor: 'var(--bg-surface)',
									}}
									aria-label={`Next certificate ${next.title}`}
								>
									Next
									<IconArrowRight size={13} />
								</Link>
							</Tooltip>
						) : null}
					</div>
				</div>

				<section
					className="rounded-xl border p-6 sm:p-7 mb-6"
					style={{
						backgroundColor: 'var(--bg-surface)',
						borderColor: 'var(--overlay)',
						borderLeftWidth: '4px',
						borderLeftColor: 'var(--primary)',
					}}
				>
					<div className="flex flex-col gap-5 sm:flex-row sm:items-start">
						<div
							className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border"
							style={{
								backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.1)',
								borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.3)',
							}}
						>
							<IconCertificate size={26} color="var(--primary)" />
						</div>
						<div className="min-w-0 flex-1">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div className="min-w-0">
									<h1
										className="text-xl font-bold leading-tight sm:text-2xl"
										style={{ color: 'var(--text)' }}
									>
										{certificate.title}
									</h1>
									<div
										className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
										style={{ color: 'var(--subtext)' }}
									>
										<span
											className="inline-flex items-center gap-1.5 font-medium"
											style={{ color: 'var(--primary)' }}
										>
											<IconBuilding size={14} />
											{certificate.issuer}
										</span>
										<span className="inline-flex items-center gap-1.5 text-xs">
											<IconCalendarEvent size={13} />
											Issued {issuedLabel}
										</span>
									</div>
								</div>
								<span
									className="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-mono text-xs"
									style={{
										backgroundColor: credential
											? 'rgba(var(--primary-rgb, 0,213,217),0.12)'
											: 'var(--bg-mantle)',
										color: credential ? 'var(--primary)' : 'var(--subtext)',
										border: '1px solid var(--overlay)',
									}}
								>
									<IconCheck size={12} />
									{credential ? 'Verifiable' : 'Completed'}
								</span>
							</div>
							{certificate.description && (
								<p
									className="mt-4 text-sm leading-relaxed"
									style={{ color: 'var(--subtext)' }}
								>
									{certificate.description}
								</p>
							)}
						</div>
					</div>
				</section>

				<div className="grid gap-6 lg:grid-cols-3">
					<div className="min-w-0 space-y-6 lg:col-span-2">
						{certificate.image && (
							<div
								className="overflow-hidden rounded-xl border"
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
										gallery.length > 0
											? () => setLightboxIndex(heroIndex)
											: undefined
									}
								/>
								<div
									className="flex items-center justify-between gap-2 border-t px-4 py-2.5 text-xs"
									style={{
										borderColor: 'var(--overlay)',
										color: 'var(--subtext)',
									}}
								>
									<span className="inline-flex items-center gap-1.5 truncate">
										<IconPhoto size={13} />
										Official certificate document
									</span>
									<span className="flex-shrink-0 font-mono">
										{gallery.length > 0
											? `${gallery.length} image${gallery.length === 1 ? '' : 's'}`
											: '1 image'}
									</span>
								</div>
							</div>
						)}

						{certificate.description && (
							<section
								className="rounded-xl border p-6 sm:p-7"
								style={{
									backgroundColor: 'var(--bg-surface)',
									borderColor: 'var(--overlay)',
								}}
							>
								<h2
									className="flex items-center gap-2 text-base font-bold mb-3"
									style={{ color: 'var(--text)' }}
								>
									<IconFileDescription size={17} color="var(--primary)" />
									About this credential
								</h2>
								<p
									className="text-sm leading-relaxed"
									style={{ color: 'var(--subtext)' }}
								>
									{certificate.description}
								</p>
								<p
									className="mt-3 text-sm leading-relaxed"
									style={{ color: 'var(--subtext)' }}
								>
									This credential was issued by {certificate.issuer} and it records
									completed coursework, assessed skills, and proof of completion.
									{focusSkills
										? ` Core focus areas include ${focusSkills}.`
										: ' Core focus areas are listed below.'}
								</p>

								<div className="mt-5 grid gap-2 sm:grid-cols-2">
									{facts.map((fact) => (
										<div
											key={fact.label}
											className="rounded-lg border px-3.5 py-3"
											style={{
												borderColor: 'var(--overlay)',
												backgroundColor: 'var(--bg-mantle)',
											}}
										>
											<div
												className="text-xs font-medium uppercase tracking-wide"
												style={{ color: 'var(--subtext)' }}
											>
												{fact.label}
											</div>
											<div
												className="mt-1 text-sm font-semibold leading-snug break-words"
												style={{ color: 'var(--text)' }}
											>
												{fact.value}
											</div>
										</div>
									))}
								</div>

								{distinctions.length > 0 && (
									<div className="mt-5">
										<h3
											className="flex items-center gap-1.5 text-sm font-bold mb-2.5"
											style={{ color: 'var(--text)' }}
										>
											<IconAward size={15} color="var(--primary)" />
											Recognition and highlights
										</h3>
										<ul className="space-y-2">
											{distinctions.map((note) => (
												<li
													key={note}
													className="flex items-start gap-2 text-sm leading-relaxed"
													style={{ color: 'var(--subtext)' }}
												>
													<IconCheck
														size={15}
														color="var(--primary)"
														className="mt-0.5 flex-shrink-0"
													/>
													<span>{note}.</span>
												</li>
											))}
										</ul>
									</div>
								)}

								<div className="mt-5">
									<h3
										className="flex items-center gap-1.5 text-sm font-bold mb-2.5"
										style={{ color: 'var(--text)' }}
									>
										<IconListCheck size={15} color="var(--primary)" />
										What was validated
									</h3>
									{skills.length > 0 ? (
										<ul className="space-y-2">
											{skills.map((skill) => (
												<li
													key={skill}
													className="flex items-start gap-2 text-sm leading-relaxed"
													style={{ color: 'var(--subtext)' }}
												>
													<IconCheck
														size={15}
														color="var(--primary)"
														className="mt-0.5 flex-shrink-0"
													/>
													<span>
														Practical understanding of {skill} through lessons,
														exercises, and assessment.
													</span>
												</li>
											))}
										</ul>
									) : (
										<p
											className="text-sm leading-relaxed"
											style={{ color: 'var(--subtext)' }}
										>
											The issuer assessed the full program and confirmed successful
											completion.
										</p>
									)}
								</div>

								<div
									className="mt-5 rounded-lg border px-3.5 py-3 text-sm leading-relaxed"
									style={{
										borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.3)',
										backgroundColor:
											'rgba(var(--primary-rgb, 0,213,217),0.07)',
										color: 'var(--subtext)',
									}}
								>
									I apply this foundation when I build, review, and ship production
									work. The certificate image above serves as proof, and credential
									details are listed in the sidebar for verification.
								</div>
							</section>
						)}

						{skills.length > 0 && (
							<section
								className="rounded-xl border p-6 sm:p-7"
								style={{
									backgroundColor: 'var(--bg-surface)',
									borderColor: 'var(--overlay)',
								}}
							>
								<h2
									className="flex items-center gap-2 text-base font-bold mb-2"
									style={{ color: 'var(--text)' }}
								>
									<IconSparkles size={17} color="var(--primary)" />
									What this credential covers
								</h2>
								<p
									className="mb-4 text-sm leading-relaxed"
									style={{ color: 'var(--subtext)' }}
								>
									Key topics and tools validated by {certificate.issuer} in this
									program.
								</p>
								<div className="flex flex-wrap gap-1.5">
									{skills.map((skill) => (
										<TagBadge key={skill} tag={skill} />
									))}
								</div>
							</section>
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
					</div>

					<aside className="min-w-0 space-y-6">
						<section
							className="rounded-xl border p-5"
							style={{
								backgroundColor: 'var(--bg-surface)',
								borderColor: 'var(--overlay)',
							}}
						>
							<h2
								className="text-sm font-bold mb-4"
								style={{ color: 'var(--text)' }}
							>
								Credential facts
							</h2>
							<dl className="space-y-3 text-sm">
								<div className="flex items-start justify-between gap-3">
									<dt
										className="inline-flex items-center gap-1.5 text-xs"
										style={{ color: 'var(--subtext)' }}
									>
										<IconBuilding size={13} />
										Issuer
									</dt>
									<dd
										className="text-right text-xs font-medium"
										style={{ color: 'var(--text)' }}
									>
										{certificate.issuer}
									</dd>
								</div>
								<div className="flex items-start justify-between gap-3">
									<dt
										className="inline-flex items-center gap-1.5 text-xs"
										style={{ color: 'var(--subtext)' }}
									>
										<IconCalendarEvent size={13} />
										Issued
									</dt>
									<dd
										className="text-right text-xs font-medium"
										style={{ color: 'var(--text)' }}
									>
										{issuedLabel}
									</dd>
								</div>
								{credentialId && (
									<div className="flex items-start justify-between gap-3">
										<dt
											className="inline-flex items-center gap-1.5 text-xs"
											style={{ color: 'var(--subtext)' }}
										>
											<IconId size={13} />
											Credential ID
										</dt>
										<dd
											className="text-right font-mono text-xs break-all"
											style={{ color: 'var(--text)' }}
										>
											{credentialId}
										</dd>
									</div>
								)}
								<div className="flex items-start justify-between gap-3">
									<dt
										className="inline-flex items-center gap-1.5 text-xs"
										style={{ color: 'var(--subtext)' }}
									>
										<IconCheck size={13} />
										Status
									</dt>
									<dd
										className="text-right text-xs font-medium"
										style={{ color: 'var(--primary)' }}
									>
										{credential ? 'Verified issuer' : 'Completed'}
									</dd>
								</div>
							</dl>
							<div className="mt-5 space-y-2">
								{credential && (
									<a
										href={credential}
										target="_blank"
										rel="noopener noreferrer"
										className="flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-medium border hover-bg-primary-up"
										style={{
											color: 'var(--primary)',
											borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.3)',
											backgroundColor:
												'rgba(var(--primary-rgb, 0,213,217),0.08)',
										}}
									>
										<IconExternalLink size={13} />
										Verify Credential
									</a>
								)}
								<Tooltip content="Copy link to this certificate" position="top">
									<button
										onClick={copyLink}
										className="hover-border-primary flex w-full items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-xs font-medium"
										style={{
											color: 'var(--subtext)',
											borderColor: 'var(--overlay)',
											backgroundColor: 'var(--bg-mantle)',
										}}
									>
										<IconLink size={13} />
										Copy certificate link
									</button>
								</Tooltip>
							</div>
						</section>

						<section
							className="rounded-xl border p-5"
							style={{
								backgroundColor: 'var(--bg-surface)',
								borderColor: 'var(--overlay)',
							}}
						>
							<h2
								className="text-sm font-bold mb-1"
								style={{ color: 'var(--text)' }}
							>
								At a glance
							</h2>
							<p
								className="mb-4 text-xs leading-relaxed"
								style={{ color: 'var(--subtext)' }}
							>
								A quick summary of proof and coverage.
							</p>
							<div className="grid grid-cols-2 gap-2">
								<div
									className="rounded-lg border p-3 text-center"
									style={{
										borderColor: 'var(--overlay)',
										backgroundColor: 'var(--bg-mantle)',
									}}
								>
									<div
										className="text-lg font-bold"
										style={{ color: 'var(--text)' }}
									>
										{skills.length}
									</div>
									<div
										className="text-xs"
										style={{ color: 'var(--subtext)' }}
									>
										Skills
									</div>
								</div>
								<div
									className="rounded-lg border p-3 text-center"
									style={{
										borderColor: 'var(--overlay)',
										backgroundColor: 'var(--bg-mantle)',
									}}
								>
									<div
										className="text-lg font-bold"
										style={{ color: 'var(--text)' }}
									>
										{gallery.length > 0 ? gallery.length : certificate.image ? 1 : 0}
									</div>
									<div
										className="text-xs"
										style={{ color: 'var(--subtext)' }}
									>
										Images
									</div>
								</div>
							</div>
						</section>

						{related.length > 0 && (
							<section
								className="rounded-xl border p-5"
								style={{
									backgroundColor: 'var(--bg-surface)',
									borderColor: 'var(--overlay)',
								}}
							>
								<h2
									className="text-sm font-bold mb-1"
									style={{ color: 'var(--text)' }}
								>
									Related credentials
								</h2>
								<p
									className="mb-4 text-xs leading-relaxed"
									style={{ color: 'var(--subtext)' }}
								>
									More proof from the same issuer or skill area.
								</p>
								<div className="space-y-2">
									{related.map((item) => (
										<Link
											key={item.id}
											to={`/certificates/${item.id}`}
											className="hover-border-primary flex items-center gap-3 rounded-lg border p-3"
											style={{
												borderColor: 'var(--overlay)',
												backgroundColor: 'var(--bg-mantle)',
											}}
										>
											<span
												className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
												style={{
													backgroundColor:
														'rgba(var(--primary-rgb, 0,213,217),0.1)',
												}}
											>
												<IconCertificate size={16} color="var(--primary)" />
											</span>
											<span className="min-w-0">
												<span
													className="block truncate text-xs font-semibold"
													style={{ color: 'var(--text)' }}
												>
													{item.title}
												</span>
												<span
													className="block truncate text-xs"
													style={{ color: 'var(--subtext)' }}
												>
													{item.issuer}
												</span>
											</span>
										</Link>
									))}
								</div>
							</section>
						)}
					</aside>
				</div>

				<div className="mt-8 flex flex-wrap items-center justify-between gap-3">
					<Link
						to="/certificates"
						className="hover-primary inline-flex items-center gap-1.5 text-sm"
						style={{ color: 'var(--subtext)' }}
					>
						<IconArrowLeft size={16} />
						Back to all certificates
					</Link>
					<div className="flex items-center gap-2">
						{prev && (
							<Link
								to={`/certificates/${prev.id}`}
								className="hover-border-primary inline-flex max-w-45 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs"
								style={{
									color: 'var(--subtext)',
									borderColor: 'var(--overlay)',
									backgroundColor: 'var(--bg-surface)',
								}}
							>
								<IconArrowLeft size={13} />
								<span className="truncate">{prev.title}</span>
							</Link>
						)}
						{next && (
							<Link
								to={`/certificates/${next.id}`}
								className="hover-border-primary inline-flex max-w-45 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs"
								style={{
									color: 'var(--subtext)',
									borderColor: 'var(--overlay)',
									backgroundColor: 'var(--bg-surface)',
								}}
							>
								<span className="truncate">{next.title}</span>
								<IconArrowRight size={13} />
							</Link>
						)}
					</div>
				</div>
			</Container>
		</div>
	)
}
