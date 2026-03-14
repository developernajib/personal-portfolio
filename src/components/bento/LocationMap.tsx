import { useEffect, useRef, useState } from 'react'
import { IconMapPin, IconSun, IconMoon } from '@tabler/icons-react'
import Site from '@/lib/config'
import { useDocumentTheme } from '@/lib/hooks/useDocumentTheme'
import type { Map as LeafletMap } from 'leaflet'

// ─── Module-level Leaflet singleton ──────────────────────────────────────────
// The dynamic import() resolves to the same cached module after the first call,
// but each component mount still triggers the async resolution overhead and a
// new Promise allocation. Hoisting it here makes it a true singleton: the import
// fires once for the lifetime of the JS bundle regardless of how many times the
// component mounts/unmounts (e.g. navigating away and back to Home).
let leafletPromise: Promise<typeof import('leaflet')> | null = null
function getLeaflet(): Promise<typeof import('leaflet')> {
	if (!leafletPromise) {
		// Inject Leaflet's CSS lazily via a <link> tag — keeps ~150 KB out of the main bundle.
		// Only runs once; subsequent calls return the cached promise.
		if (!document.getElementById('leaflet-css')) {
			const link = document.createElement('link')
			link.id = 'leaflet-css'
			link.rel = 'stylesheet'
			link.href = '/leaflet.css'
			document.head.appendChild(link)
		}
		leafletPromise = import('leaflet')
	}
	return leafletPromise
}
// ─────────────────────────────────────────────────────────────────────────────

export default function LocationMap() {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<LeafletMap | null>(null)
	const [leafletLoaded, setLeafletLoaded] = useState(false)
	const [currentTime, setCurrentTime] = useState('')
	const [currentDate, setCurrentDate] = useState('')
	const [isDaytime, setIsDaytime] = useState(true)
	const mapTheme = useDocumentTheme()

	function updateTime() {
		const now = new Date()
		const time = new Intl.DateTimeFormat('en-US', {
			timeZone: Site.location.timezone || 'UTC',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		}).format(now)
		const date = new Intl.DateTimeFormat('en-US', {
			timeZone: Site.location.timezone || 'UTC',
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(now)
		setCurrentTime(time)
		setCurrentDate(date)
		const hour24 = new Date().toLocaleString('en-US', {
			timeZone: Site.location.timezone || 'UTC',
			hour: 'numeric',
			hour12: false,
		})
		const hour = parseInt(hour24)
		setIsDaytime(hour >= 6 && hour < 21)
	}

	useEffect(() => {
		updateTime()
		let interval: ReturnType<typeof setInterval> | null = setInterval(updateTime, 60_000)

		function onVisibilityChange() {
			if (document.hidden) {
				if (interval) {
					clearInterval(interval)
					interval = null
				}
			} else {
				updateTime()
				interval = setInterval(updateTime, 60_000)
			}
		}
		document.addEventListener('visibilitychange', onVisibilityChange)
		return () => {
			if (interval) clearInterval(interval)
			document.removeEventListener('visibilitychange', onVisibilityChange)
		}
	}, [])

	useEffect(() => {
		let destroyed = false
		const container = mapRef.current
		if (!container) return

		const initMap = () => {
			getLeaflet()
				.then((mod) => {
					if (destroyed || !container) return
					const L =
						(mod as unknown as { default: typeof import('leaflet') }).default ?? mod

					const lat = Site.location.lat || 3.139
					const lng = Site.location.lng || 101.6869

					const map = L.map(container, {
						zoomControl: false,
						attributionControl: false,
						dragging: true,
						scrollWheelZoom: 'center',
						doubleClickZoom: true,
						boxZoom: false,
						keyboard: false,
						touchZoom: true,
					}).setView([lat, lng], 11)

					const tileUrl =
						mapTheme === 'light'
							? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
							: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

					L.tileLayer(tileUrl, { maxZoom: 19, attribution: '' }).addTo(map)

					mapInstanceRef.current = map
					setLeafletLoaded(true)
				})
				.catch((err) => {
					console.error('[LocationMap] Failed to load Leaflet:', err)
				})
		}

		// Only load Leaflet when the map scrolls into view — keeps it off the critical path
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					observer.disconnect()
					initMap()
				}
			},
			{ rootMargin: '200px' }
		)
		observer.observe(container)

		return () => {
			destroyed = true
			observer.disconnect()
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove()
				mapInstanceRef.current = null
			}
			setLeafletLoaded(false)
		}
	}, [mapTheme])

	function recenterMap() {
		if (mapInstanceRef.current) {
			const lat = Site.location.lat || 3.139
			const lng = Site.location.lng || 101.6869
			mapInstanceRef.current.setView([lat, lng], 11)
		}
	}

	return (
		<div
			className="flex flex-col rounded-xl border p-4 shadow-lg h-full"
			style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
		>
			<button
				onClick={recenterMap}
				className="hover-primary mb-3 flex w-full items-center gap-2 text-left text-sm font-semibold"
				style={{ color: 'var(--text)' }}
			>
				<IconMapPin size={16} color="var(--primary)" />
				Currently Based In 📍
			</button>

			<div
				className="relative w-full flex-1 overflow-hidden rounded-lg"
				style={{ backgroundColor: 'var(--bg-mantle)', minHeight: '140px' }}
			>
				<div ref={mapRef} className="h-full w-full" style={{ minHeight: '140px' }} />
				{/* Center pin marker */}
				{leafletLoaded && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<div
							className="relative flex flex-col items-center"
							style={{ transform: 'translateY(-50%)' }}
						>
							<div
								className="w-3 h-3 rounded-full border-2"
								style={{
									backgroundColor: 'var(--primary)',
									borderColor: '#fff',
									boxShadow: '0 0 0 3px rgba(var(--primary-rgb, 0,213,217),0.35)',
								}}
							/>
							<div
								className="w-0.5 h-3"
								style={{
									backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.6)',
								}}
							/>
						</div>
					</div>
				)}
				{!leafletLoaded && (
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-xs" style={{ color: 'var(--subtext)' }}>
							Loading map…
						</span>
					</div>
				)}
			</div>

			<div className="mt-3 flex items-center justify-between gap-2">
				<button
					onClick={recenterMap}
					className="hover-primary text-xs truncate cursor-pointer"
					style={{ color: 'var(--subtext)' }}
				>
					{Site.location.city}, {Site.location.country}
				</button>
				{currentTime && (
					<div className="relative flex items-center gap-1 group cursor-default px-2 py-1 -mx-2 -my-1 rounded">
						{isDaytime ? (
							<IconSun size={12} color="#facc15" />
						) : (
							<IconMoon size={12} color="#60a5fa" />
						)}
						<span
							className="font-mono text-xs whitespace-nowrap"
							style={{ color: 'var(--primary)' }}
						>
							{currentTime}
						</span>
						{/* Tooltip */}
						<div className="absolute top-full right-0 mt-1.5 hidden group-hover:block z-50">
							<div
								className="rounded px-2 py-1 text-xs whitespace-nowrap font-mono"
								style={{
									backgroundColor: 'var(--bg-mantle)',
									color: 'var(--text)',
									border: '1px solid var(--overlay)',
									boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
								}}
							>
								{currentDate}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
