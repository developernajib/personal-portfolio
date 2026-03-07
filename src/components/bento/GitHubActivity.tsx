import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import {
	IconBrandGithub,
	IconGitCommit,
	IconUsers,
	IconBook,
	IconCalendarStats,
	IconRefresh,
} from '@tabler/icons-react'
import Site from '@/lib/config'

interface GitHubStats {
	public_repos: number
	followers: number
	created_at: string
}

interface ContribDay {
	date: string
	count: number
}

interface YearData {
	contributions: ContribDay[]
	total: number
	today: number
	weeks: (ContribDay | null)[][]
}

interface CacheEntry<T> {
	data: T
	fetchedAt: number
}

const GITHUB_USERNAME = Site.socials.github.split('/').pop() ?? ''
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined
const GRAPHQL_URL = 'https://api.github.com/graphql'
const REST_URL = `https://api.github.com/users/${GITHUB_USERNAME}`
const STALE_MS = 5 * 60 * 1000
const TIMEOUT_MS = 15_000

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CURRENT_YEAR = new Date().getFullYear()
const DEFAULT_OPTION = 'last'

/* ── Module-level cache ──────────────────────────────────────────────────── */
const statsCache = { entry: null as CacheEntry<GitHubStats> | null }
const yearDataCache = new Map<string, CacheEntry<YearData>>()
const inFlight = new Map<string, Promise<void>>()
/* ─────────────────────────────────────────────────────────────────────────── */

function authHeaders(): HeadersInit {
	return GITHUB_TOKEN
		? { Authorization: `bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' }
		: { 'Content-Type': 'application/json' }
}

function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
	return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer))
}

/* Build from/to ISO strings for a given year selection */
function yearRange(year: number | 'last'): { from: string; to: string } {
	if (year === 'last') {
		const to = new Date()
		const from = new Date(to)
		from.setFullYear(from.getFullYear() - 1)
		return { from: from.toISOString(), to: to.toISOString() }
	}
	return {
		from: `${year}-01-01T00:00:00Z`,
		to: `${year}-12-31T23:59:59Z`,
	}
}

function buildWeeks(days: ContribDay[]): (ContribDay | null)[][] {
	if (days.length === 0) return []
	const firstDate = new Date(days[0].date + 'T00:00:00')
	const startPad = firstDate.getDay()
	const padded: (ContribDay | null)[] = [...Array(startPad).fill(null), ...days]
	const weeks: (ContribDay | null)[][] = []
	for (let i = 0; i < padded.length; i += 7) {
		const week = padded.slice(i, i + 7)
		while (week.length < 7) week.push(null)
		weeks.push(week)
	}
	return weeks
}

function processContribs(days: ContribDay[], year: number | 'last'): YearData {
	const todayStr = new Date().toISOString().slice(0, 10)
	let total = 0
	let today = 0
	for (const entry of days) {
		if (year === 'last' || entry.date.startsWith(year.toString())) {
			total += entry.count
		}
		if (entry.date === todayStr) today = entry.count
	}
	return { contributions: days, total, today, weeks: buildWeeks(days) }
}

function isStale(entry: CacheEntry<unknown>): boolean {
	return Date.now() - entry.fetchedAt > STALE_MS
}

/* Fetch stats via REST (public_repos, followers, created_at) */
async function fetchStats(): Promise<GitHubStats> {
	const res = await fetchWithTimeout(REST_URL, { headers: authHeaders() })
	if (!res.ok) throw new Error(`GitHub REST ${res.status}`)
	const data = await res.json()
	return {
		public_repos: data.public_repos,
		followers: data.followers,
		created_at: data.created_at,
	}
}

/* Fetch contribution days via GraphQL contributionsCollection */
async function fetchContributions(year: number | 'last'): Promise<ContribDay[]> {
	const { from, to } = yearRange(year)
	const query = `
		query($login: String!, $from: DateTime!, $to: DateTime!) {
			user(login: $login) {
				contributionsCollection(from: $from, to: $to) {
					contributionCalendar {
						weeks {
							contributionDays {
								date
								contributionCount
							}
						}
					}
				}
			}
		}
	`
	const res = await fetchWithTimeout(GRAPHQL_URL, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME, from, to } }),
	})
	if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`)
	const json = await res.json()
	const weeks: { contributionDays: { date: string; contributionCount: number }[] }[] =
		json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []
	const days: ContribDay[] = weeks.flatMap((week) =>
		week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount }))
	)
	return days
}

function getColor(count: number) {
	if (count === 0) return 'var(--bg-mantle)'
	if (count <= 3) return 'color-mix(in srgb, var(--primary) 20%, transparent)'
	if (count <= 7) return 'color-mix(in srgb, var(--primary) 45%, transparent)'
	if (count <= 14) return 'color-mix(in srgb, var(--primary) 70%, transparent)'
	return 'var(--primary)'
}

function ContribGraph({
	weeks,
	monthLabels,
	onHover,
	graphRef,
}: {
	weeks: (ContribDay | null)[][]
	monthLabels: { label: string; colIndex: number }[]
	onHover: (tip: { text: string; x: number; y: number } | null) => void
	graphRef: React.RefObject<HTMLDivElement | null>
}) {
	const LABEL_W = 28
	const GAP = 2
	const ROWS = 7
	const MONTH_H = 18
	const CELL = 11
	const numWeeks = weeks.length || 53
	const svgW = LABEL_W + numWeeks * (CELL + GAP) - GAP
	const svgH = MONTH_H + ROWS * (CELL + GAP) - GAP

	return (
		<svg
			viewBox={`0 0 ${svgW} ${svgH}`}
			width="100%"
			style={{ display: 'block', overflow: 'visible' }}
		>
			{['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, di) => (
				<text
					key={di}
					x={LABEL_W - 4}
					y={MONTH_H + di * (CELL + GAP) + CELL / 2 + 3}
					fontSize={8}
					fill="var(--subtext)"
					textAnchor="end"
				>
					{label}
				</text>
			))}

			{monthLabels.map(({ label, colIndex }) => (
				<text
					key={label + colIndex}
					x={LABEL_W + colIndex * (CELL + GAP)}
					y={MONTH_H - 5}
					fontSize={9}
					fill="var(--subtext)"
				>
					{label}
				</text>
			))}

			{weeks.map((week, wi) =>
				week.map((day, di) => {
					if (day === null) return null
					const x = LABEL_W + wi * (CELL + GAP)
					const y = MONTH_H + di * (CELL + GAP)
					return (
						<rect
							key={`${wi}-${di}`}
							x={x}
							y={y}
							width={CELL}
							height={CELL}
							rx={2}
							fill={getColor(day.count)}
							onMouseEnter={(e) => {
								const parentRect = graphRef.current?.getBoundingClientRect()
								const svgEl = e.currentTarget.closest('svg') as SVGSVGElement | null
								if (!parentRect || !svgEl) return
								const svgRect = svgEl.getBoundingClientRect()
								const scaleX = svgRect.width / svgW
								const scaleY = svgRect.height / svgH
								onHover({
									text: `${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`,
									x: svgRect.left - parentRect.left + x * scaleX + (CELL * scaleX) / 2,
									y: svgRect.top - parentRect.top + y * scaleY,
								})
							}}
							onMouseLeave={() => onHover(null)}
							style={{ cursor: 'default' }}
						/>
					)
				})
			)}
		</svg>
	)
}

export default function GitHubActivity() {
	const [stats, setStats] = useState<GitHubStats | null>(statsCache.entry?.data ?? null)
	const [statsError, setStatsError] = useState(false)
	const [selectedYear, setSelectedYear] = useState<number | 'last'>(DEFAULT_OPTION)

	const startYear = stats?.created_at ? new Date(stats.created_at).getFullYear() : CURRENT_YEAR
	const years = useMemo(
		() => Array.from({ length: CURRENT_YEAR - startYear + 1 }, (_, i) => CURRENT_YEAR - i),
		[startYear]
	)

	const [yearSnapshot, setYearSnapshot] = useState<Record<string, YearData>>(() => {
		const seed: Record<string, YearData> = {}
		yearDataCache.forEach((entry, key) => { seed[key] = entry.data })
		return seed
	})
	const [loading, setLoading] = useState(false)
	const [graphError, setGraphError] = useState(false)
	const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)
	const graphRef = useRef<HTMLDivElement>(null)

	const handleTooltip = useCallback(
		(tip: { text: string; x: number; y: number } | null) => setTooltip(tip),
		[]
	)

	/* Fetch stats */
	useEffect(() => {
		const cached = statsCache.entry
		if (cached && !isStale(cached)) return
		const key = 'stats'
		if (inFlight.has(key)) return
		const promise = fetchStats()
			.then((parsed) => {
				statsCache.entry = { data: parsed, fetchedAt: Date.now() }
				setStats(parsed)
			})
			.catch(() => { if (!cached) setStatsError(true) })
			.finally(() => inFlight.delete(key))
		inFlight.set(key, promise)
	}, [])

	/* Fetch contributions for selected year */
	useEffect(() => {
		const cacheKey = selectedYear.toString()
		const cached = yearDataCache.get(cacheKey)

		if (cached) {
			setYearSnapshot((prev) => ({ ...prev, [cacheKey]: cached.data }))
			if (!isStale(cached)) return
		} else {
			setLoading(true)
			setGraphError(false)
		}

		if (inFlight.has(cacheKey)) return
		const promise = fetchContributions(selectedYear)
			.then((days) => {
				const processed = processContribs(days, selectedYear)
				yearDataCache.set(cacheKey, { data: processed, fetchedAt: Date.now() })
				setYearSnapshot((prev) => ({ ...prev, [cacheKey]: processed }))
			})
			.catch(() => { if (!cached) setGraphError(true) })
			.finally(() => {
				setLoading(false)
				inFlight.delete(cacheKey)
			})
		inFlight.set(cacheKey, promise)
	}, [selectedYear])

	/* Pre-warm current year for the stats row */
	useEffect(() => {
		const cacheKey = CURRENT_YEAR.toString()
		if (yearDataCache.has(cacheKey) && !isStale(yearDataCache.get(cacheKey)!)) return
		if (inFlight.has(cacheKey)) return
		const promise = fetchContributions(CURRENT_YEAR)
			.then((days) => {
				const processed = processContribs(days, CURRENT_YEAR)
				yearDataCache.set(cacheKey, { data: processed, fetchedAt: Date.now() })
				setYearSnapshot((prev) => ({ ...prev, [cacheKey]: processed }))
			})
			.catch(() => {})
			.finally(() => inFlight.delete(cacheKey))
		inFlight.set(cacheKey, promise)
	}, [])

	const yearData = yearSnapshot[selectedYear.toString()]

	const monthLabels = useMemo(() => {
		const labels: { label: string; colIndex: number }[] = []
		if (!yearData?.weeks) return labels
		let lastMonth = -1
		yearData.weeks.forEach((week, wi) => {
			const firstReal = week.find((d) => d !== null) as ContribDay | undefined
			if (firstReal) {
				const m = new Date(firstReal.date + 'T00:00:00').getMonth()
				if (m !== lastMonth) {
					labels.push({ label: MONTHS[m], colIndex: wi })
					lastMonth = m
				}
			}
		})
		return labels
	}, [yearData?.weeks])

	const yearOptions = useMemo(() => ['last', ...years] as (number | 'last')[], [years])

	return (
		<section>
			{/* Header */}
			<div className="mb-4 flex items-center justify-between">
				<h2
					className="flex items-center gap-2 text-xl font-bold"
					style={{ color: 'var(--text)' }}
				>
					<IconBrandGithub size={22} color="var(--primary)" />
					GitHub Activity
				</h2>
				<a
					href={Site.socials.github}
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs hover-primary"
					style={{ color: 'var(--subtext)' }}
				>
					@{GITHUB_USERNAME} ↗
				</a>
			</div>

			{/* Graph card */}
			<div
				className="rounded-xl border p-4 mb-4"
				style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
			>
				{/* Graph header */}
				<div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs" style={{ color: 'var(--subtext)' }}>
						{yearData
							? selectedYear === 'last'
								? `${yearData.total.toLocaleString()} contributions in the last year`
								: `${yearData.total.toLocaleString()} contributions in ${selectedYear}`
							: selectedYear === 'last'
								? 'Contributions in the last year'
								: `Contributions in ${selectedYear}`}
					</p>
					{/* Year pills */}
					<div className="flex gap-0.5 overflow-x-auto scrollbar-none sm:gap-1 sm:justify-end sm:max-w-[60%]">
						{yearOptions.map((opt) => {
							const isActive = selectedYear === opt
							const label = opt === 'last' ? 'Last 1 Year' : opt.toString()
							return (
								<button
									key={opt}
									onClick={() => setSelectedYear(opt)}
									className="text-xs px-2 py-0.5 rounded font-mono transition-colors duration-150 flex-shrink-0"
									style={{
										backgroundColor: isActive
											? 'rgba(var(--primary-rgb, 0,213,217),0.15)'
											: 'transparent',
										color: isActive ? 'var(--primary)' : 'var(--subtext)',
										border: isActive
											? '1px solid rgba(var(--primary-rgb, 0,213,217),0.4)'
											: '1px solid var(--overlay)',
									}}
									onMouseEnter={(e) => {
										if (!isActive) {
											e.currentTarget.style.color = 'var(--text)'
											e.currentTarget.style.borderColor = 'var(--subtext)'
										}
									}}
									onMouseLeave={(e) => {
										if (!isActive) {
											e.currentTarget.style.color = 'var(--subtext)'
											e.currentTarget.style.borderColor = 'var(--overlay)'
										}
									}}
								>
									{label}
								</button>
							)
						})}
					</div>
				</div>

				{/* Graph */}
				{graphError ? (
					<div
						className="flex flex-col items-center justify-center gap-3"
						style={{ minHeight: '96px' }}
					>
						<p className="text-xs font-mono" style={{ color: 'var(--subtext)' }}>
							Could not load contributions. Check your GitHub token or try again.
						</p>
						<button
							onClick={() => window.location.reload()}
							className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-colors duration-150"
							style={{
								color: 'var(--primary)',
								backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.1)',
								border: '1px solid rgba(var(--primary-rgb, 0,213,217),0.3)',
								cursor: 'pointer',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor =
									'rgba(var(--primary-rgb, 0,213,217),0.2)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor =
									'rgba(var(--primary-rgb, 0,213,217),0.1)'
							}}
						>
							<IconRefresh size={14} />
							Reload to try again
						</button>
					</div>
				) : loading || !yearData ? (
					<div
						className="flex flex-col items-center justify-center gap-2"
						style={{ minHeight: '96px' }}
					>
						<svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="12" r="10" stroke="var(--overlay)" strokeWidth="3" />
							<path
								d="M12 2a10 10 0 0 1 10 10"
								stroke="var(--primary)"
								strokeWidth="3"
								strokeLinecap="round"
							/>
						</svg>
						<span className="text-xs font-mono" style={{ color: 'var(--subtext)' }}>
							Fetching GitHub activity...
						</span>
					</div>
				) : (
					<div className="w-full overflow-x-auto scrollbar-none" ref={graphRef}>
						<div className="relative" style={{ minWidth: '600px' }}>
							<ContribGraph
								weeks={yearData.weeks}
								monthLabels={monthLabels}
								onHover={handleTooltip}
								graphRef={graphRef}
							/>

							{/* Tooltip */}
							{tooltip && (
								<div
									style={{
										position: 'absolute',
										left: tooltip.x,
										top: tooltip.y - 32,
										transform: 'translateX(-50%)',
										backgroundColor: 'var(--bg-crust)',
										border: '1px solid var(--overlay)',
										borderRadius: '6px',
										padding: '3px 8px',
										fontSize: '11px',
										color: 'var(--text)',
										whiteSpace: 'nowrap',
										pointerEvents: 'none',
										zIndex: 10,
									}}
								>
									{tooltip.text}
								</div>
							)}

							{/* Legend */}
							<div
								className="mt-3 flex items-center justify-end gap-2 text-xs"
								style={{ color: 'var(--subtext)' }}
							>
								<span>Less</span>
								<span className="flex gap-0.5">
									{[
										'var(--bg-mantle)',
										'color-mix(in srgb, var(--primary) 20%, transparent)',
										'color-mix(in srgb, var(--primary) 45%, transparent)',
										'color-mix(in srgb, var(--primary) 70%, transparent)',
										'var(--primary)',
									].map((c, i) => (
										<span
											key={i}
											className="inline-block w-3 h-3 rounded-sm"
											style={{ backgroundColor: c, border: '1px solid var(--overlay)' }}
										/>
									))}
								</span>
								<span>More</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Stats row */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				{[
					{
						icon: <IconCalendarStats size={16} color="var(--primary)" />,
						label: 'Contributions This Year',
						value: yearSnapshot[CURRENT_YEAR.toString()]?.total ?? (statsError ? '—' : '...'),
					},
					{
						icon: <IconGitCommit size={16} color="var(--primary)" />,
						label: 'Contributions Today',
						value: yearSnapshot[CURRENT_YEAR.toString()]?.today ?? (statsError ? '—' : '...'),
					},
					{
						icon: <IconBook size={16} color="var(--primary)" />,
						label: 'Public Repos',
						value: stats?.public_repos ?? (statsError ? '—' : '...'),
					},
					{
						icon: <IconUsers size={16} color="var(--primary)" />,
						label: 'Followers',
						value: stats?.followers ?? (statsError ? '—' : '...'),
					},
				].map((stat) => (
					<div
						key={stat.label}
						className="rounded-xl border p-3 flex flex-col items-center justify-center gap-2 text-center"
						style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
					>
						<div className="flex items-center gap-2">
							{stat.icon}
							<span className="text-lg font-bold font-mono" style={{ color: 'var(--text)' }}>
								{stat.value}
							</span>
						</div>
						<span className="text-xs leading-tight" style={{ color: 'var(--subtext)' }}>
							{stat.label}
						</span>
					</div>
				))}
			</div>
		</section>
	)
}
