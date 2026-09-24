import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
	IconArrowLeft,
	IconCheck,
	IconPlus,
	IconX,
	IconTrophy,
	IconAlertTriangle,
	IconTrash,
	IconStack2,
} from '@tabler/icons-react'
import BackgroundEffect from '@/components/ui/BackgroundEffect'
import Container from '@/components/ui/Container'
import SlabTitle from '@/components/ui/SlabTitle'
import TagBadge from '@/components/ui/TagBadge'
import { technologies } from '@/data/technologies'
import { useSelectedTech } from '@/lib/selectedTech'
import { getDuration } from '@/lib/utils'
import useDocTitle from '@/lib/hooks/useDocTitle'

const REQUIRED_KEY = 'devnajib-required-stack'

const ALIASES: Record<string, string> = {
	golang: 'go',
	postgres: 'postgresql',
	k8s: 'kubernetes',
	js: 'javascript',
	ts: 'typescript',
	node: 'nodedotjs',
	vuejs: 'vuedotjs',
	socketio: 'socketdotio',
}

function normalize(raw: string): string {
	const clean = raw.toLowerCase().replace(/[^a-z0-9+#.]/g, '')
	return ALIASES[clean] ?? clean
}

function isMatch(required: string, candidate: string): boolean {
	const req = normalize(required)
	const sel = normalize(candidate)
	if (!req || !sel) return false
	if (req === sel) return true
	if (req.length < 3) return false
	return (
		sel.startsWith(req) || sel.endsWith(req) || req.startsWith(sel) || req.endsWith(sel)
	)
}

function readRequired(): string[] {
	try {
		const raw = localStorage.getItem(REQUIRED_KEY)
		const parsed: unknown = raw ? JSON.parse(raw) : []
		return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
	} catch {
		return []
	}
}

function verdict(score: number, total: number): string {
	if (total === 0) return 'Add your required technologies to see the match score.'
	if (score === 100) return 'Perfect match - every requirement is covered.'
	if (score >= 70) return 'Strong match - most requirements are covered.'
	if (score >= 40) return 'Partial match - some gaps to be aware of.'
	if (score > 0) return 'Low match - considerable gaps here.'
	return 'No overlap yet - none of the requirements match.'
}

export default function CompareTechnologies() {
	useDocTitle('Compare Technologies')
	const [selectedIds, setSelectedIds] = useSelectedTech()
	const [required, setRequired] = useState<string[]>(readRequired)
	const [draft, setDraft] = useState('')

	useEffect(() => {
		try {
			localStorage.setItem(REQUIRED_KEY, JSON.stringify(required))
		} catch {
			// Storage unavailable, requirements simply reset on reload
		}
	}, [required])

	const selected = useMemo(
		() => selectedIds.flatMap((id) => technologies.find((t) => t.id === id) ?? []),
		[selectedIds]
	)

	function removeSelected(id: string) {
		setSelectedIds(selectedIds.filter((v) => v !== id))
	}

	function removeRequirement(name: string) {
		setRequired((prev) => prev.filter((v) => v !== name))
	}

	function addRequirement() {
		const name = draft.trim()
		if (!name) return
		if (!required.some((r) => normalize(r) === normalize(name))) {
			setRequired((prev) => [...prev, name])
		}
		setDraft('')
	}

	const matches = useMemo(
		() =>
			required.map((req) => ({
				req,
				tech: technologies.find((t) => isMatch(req, t.name)),
			})),
		[required]
	)
	const matchedCount = matches.filter((m) => m.tech).length
	const score = required.length === 0 ? 0 : Math.round((matchedCount / required.length) * 100)

	return (
		<div className="relative">
			<BackgroundEffect />
			<Container className="relative z-10 space-y-10 py-8 md:py-10">
				<Link
					to="/technologies"
					className="hover-primary inline-flex items-center gap-1.5 text-sm"
					style={{ color: 'var(--subtext)' }}
				>
					<IconArrowLeft size={16} />
					All Technologies
				</Link>

				<section className="space-y-3">
					<SlabTitle title="Stack Compare" config="4c" as="h1" />
					<p className="max-w-prose text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
						List the stack your role or project needs and see how it lines up against
						the full skill set. Everything is stored in your browser only.
					</p>
				</section>

				{/* Score */}
				<section
					className="relative overflow-hidden rounded-2xl border p-6 sm:p-7"
					style={{
						backgroundColor: 'var(--bg-surface)',
						borderColor: 'var(--overlay)',
						backgroundImage:
							'radial-gradient(ellipse 70% 100% at 50% -30%, rgba(var(--primary-rgb, 0,213,217),0.12), transparent)',
					}}
				>
					<span
						className="pointer-events-none absolute inset-x-12 top-0 h-px"
						style={{
							background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
							opacity: 0.6,
						}}
					/>
					<div className="flex items-center gap-3 mb-4">
						<span
							className="flex h-10 w-10 items-center justify-center rounded-full"
							style={{
								backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.1)',
								border: '1px solid rgba(var(--primary-rgb, 0,213,217),0.3)',
							}}
						>
							<IconTrophy size={18} color="var(--primary)" />
						</span>
						<div>
							<h2 className="text-base font-bold leading-tight" style={{ color: 'var(--text)' }}>
								Match score
							</h2>
							<p className="text-xs" style={{ color: 'var(--subtext)' }}>
								{matchedCount} of {required.length} requirements covered
							</p>
						</div>
						<span
							className="ml-auto font-mono font-bold"
							style={{ color: 'var(--primary)', fontSize: '1.75rem', lineHeight: 1 }}
						>
							{score}
							<span style={{ fontSize: '1rem' }}>%</span>
						</span>
					</div>
					<div
						className="h-2.5 rounded-full overflow-hidden mb-2"
						style={{ backgroundColor: 'var(--bg-mantle)' }}
					>
						<div
							className="h-full rounded-full transition-all duration-500"
							style={{
								width: `${score}%`,
								background: 'linear-gradient(90deg, var(--primary-dim), var(--primary))',
								boxShadow: '0 0 12px rgba(var(--primary-rgb, 0,213,217),0.5)',
							}}
						/>
					</div>
					<p className="text-xs" style={{ color: 'var(--subtext)' }}>
						{verdict(score, required.length)}
					</p>
				</section>

				{/* Required stack input */}
				<section>
					<div className="flex items-center gap-3 mb-3">
						<h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
							Your required stack ({required.length})
						</h2>
						{required.length > 0 && (
							<button
								onClick={() => setRequired([])}
								className="hover-primary ml-auto inline-flex items-center gap-1 text-xs"
								style={{ color: 'var(--subtext)' }}
							>
								<IconTrash size={13} />
								Clear all
							</button>
						)}
					</div>
					<div className="flex gap-2 mb-3">
						<input
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') addRequirement()
							}}
							list="tech-suggestions"
							placeholder="Type a technology, press Enter"
							className="flex-1 min-w-0 rounded-lg border px-3 py-2 text-sm outline-none"
							style={{
								backgroundColor: 'var(--bg-surface)',
								borderColor: 'var(--overlay)',
								color: 'var(--text)',
							}}
						/>
						<datalist id="tech-suggestions">
							{technologies.map((t) => (
								<option key={t.id} value={t.name} />
							))}
						</datalist>
						<button
							onClick={addRequirement}
							className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-transform duration-150 hover:scale-105 active:scale-95"
							style={{ color: '#06281f', backgroundColor: 'var(--primary)' }}
						>
							<IconPlus size={15} stroke={2.5} />
							Add
						</button>
					</div>
					{required.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{required.map((r) => (
								<span
									key={r}
									className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-lg text-xs font-medium border"
									style={{
										color: 'var(--text)',
										borderColor: 'var(--overlay)',
										backgroundColor: 'var(--bg-mantle)',
									}}
								>
									{r}
									<button
										onClick={() => removeRequirement(r)}
										className="hover-primary rounded p-0.5"
										style={{ color: 'var(--subtext)' }}
										aria-label={`Remove ${r} from requirements`}
									>
										<IconX size={13} />
									</button>
								</span>
							))}
						</div>
					)}
				</section>

				{/* Results */}
				{required.length > 0 && (
					<section className="space-y-6">
						<div>
							<h3
								className="flex items-center gap-1.5 text-sm font-bold mb-3"
								style={{ color: 'var(--text)' }}
							>
								<IconCheck size={15} color="var(--primary)" />
								Matched ({matchedCount})
							</h3>
							{matches
								.filter((m) => m.tech)
								.map(({ req, tech }) => (
									<div
										key={req}
										className="hover-border-primary rounded-xl border p-3.5 mb-2 flex items-center gap-3 transition-colors duration-150"
										style={{
											backgroundColor: 'var(--bg-surface)',
											borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.3)',
										}}
									>
										{tech?.icon ? (
											<span
												className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
												style={{ backgroundColor: tech.iconBg }}
											>
												<img
													src={tech.icon}
													alt={tech.name}
													className="w-6 h-6 object-contain"
													loading="lazy"
													decoding="async"
												/>
											</span>
										) : null}
										<div className="flex-1 min-w-0">
											<p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
												{tech?.name}
												{tech && tech.name.toLowerCase() !== req.toLowerCase() && (
													<span
														className="ml-2 text-xs font-normal"
														style={{ color: 'var(--subtext)' }}
													>
														matched "{req}"
													</span>
												)}
											</p>
											<p className="text-xs" style={{ color: 'var(--subtext)' }}>
												{tech?.desc} · {tech ? getDuration(tech.startDate, tech.endDate) : ''} experience
											</p>
										</div>
										<TagBadge tag={tech?.category ?? ''} />
										<button
											onClick={() => removeRequirement(req)}
											className="hover-primary rounded p-1 flex-shrink-0"
											style={{ color: 'var(--subtext)' }}
											aria-label={`Remove ${req} from requirements`}
										>
											<IconX size={14} />
										</button>
									</div>
								))}
							{matchedCount === 0 && (
								<p className="text-xs" style={{ color: 'var(--subtext)' }}>
									Nothing matched yet - check the spelling or add more requirements.
								</p>
							)}
						</div>

						<div>
							<h3
								className="flex items-center gap-1.5 text-sm font-bold mb-3"
								style={{ color: 'var(--text)' }}
							>
								<IconAlertTriangle size={15} color="#f0b429" />
								Missing ({required.length - matchedCount})
							</h3>
							{matches
								.filter((m) => !m.tech)
								.map(({ req }) => (
									<div
										key={req}
										className="rounded-xl border p-3.5 mb-2 flex items-center gap-3"
										style={{
											backgroundColor: 'var(--bg-surface)',
											borderColor: 'var(--overlay)',
											borderLeftWidth: '3px',
											borderLeftColor: '#f0b429',
										}}
									>
										<p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
											{req}
										</p>
										<p className="text-xs ml-auto hidden sm:block" style={{ color: 'var(--subtext)' }}>
											Not in the stack
										</p>
										<button
											onClick={() => removeRequirement(req)}
											className="hover-primary rounded p-1 flex-shrink-0"
											style={{ color: 'var(--subtext)' }}
											aria-label={`Remove ${req} from requirements`}
										>
											<IconX size={14} />
										</button>
									</div>
								))}
							{matchedCount === required.length && (
								<p className="text-xs" style={{ color: 'var(--subtext)' }}>
									No gaps - every requirement is covered.
								</p>
							)}
						</div>
					</section>
				)}

				{/* Your picks from the Technologies page */}
				<section>
					<div className="flex items-center gap-2 mb-3">
						<IconStack2 size={16} color="var(--primary)" />
						<h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
							Your picks ({selected.length})
						</h2>
						<Link to="/technologies" className="link text-xs ml-auto">
							Edit on Technologies page
						</Link>
					</div>
					{selected.length === 0 ? (
						<div
							className="rounded-xl border p-5 text-sm"
							style={{
								backgroundColor: 'var(--bg-surface)',
								borderColor: 'var(--overlay)',
								color: 'var(--subtext)',
							}}
						>
							Nothing picked yet.{' '}
							<Link to="/technologies" className="link">
								Go tap some cards
							</Link>{' '}
							and your picks will appear here.
						</div>
					) : (
						<div className="flex flex-wrap gap-2">
							{selected.map((t) => (
								<span
									key={t.id}
									className="inline-flex items-center gap-1.5 pl-1 pr-1 py-1 rounded-lg text-xs font-medium border"
									style={{
										color: 'var(--primary)',
										borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.35)',
										backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.08)',
									}}
								>
									{t.icon ? (
										<img
											src={t.icon}
											alt=""
											className="w-4 h-4 object-contain"
											loading="lazy"
											decoding="async"
										/>
									) : null}
									{t.name}
									<button
										onClick={() => removeSelected(t.id)}
										className="hover-primary rounded p-0.5"
										style={{ color: 'var(--subtext)' }}
										aria-label={`Remove ${t.name} from picks`}
									>
										<IconX size={13} />
									</button>
								</span>
							))}
						</div>
					)}
				</section>
			</Container>
		</div>
	)
}
