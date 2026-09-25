import {
	cloneElement,
	isValidElement,
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type ReactElement,
	type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

type Placement = 'top' | 'bottom' | 'left' | 'right'

interface Coords {
	x: number
	y: number
	placement: Placement
	arrowOffset: number
	ready: boolean
}

interface TooltipProps {
	content: ReactNode
	children: ReactNode
	position?: Placement
	offset?: number
	delay?: number
	disabled?: boolean
	contentClassName?: string
}

const MARGIN = 8

function getTriggerRef(
	el: unknown
): { current: Element | null } | ((instance: Element | null) => void) | null {
	if (!isValidElement(el)) return null
	const props = el.props as { ref?: unknown }
	const ref = props.ref
	if (typeof ref === 'function' || (typeof ref === 'object' && ref !== null))
		return ref as
			| { current: Element | null }
			| ((instance: Element | null) => void)
	return null
}

function setTriggerRef(
	target: unknown,
	instance: Element | null
) {
	if (typeof target === 'function') {
		;(target as (instance: Element | null) => void)(instance)
	} else if (typeof target === 'object' && target !== null) {
		;(target as { current: Element | null }).current = instance
	}
}

export default function Tooltip({
	content,
	children,
	position = 'top',
	offset = 8,
	delay = 120,
	disabled = false,
	contentClassName = '',
}: TooltipProps) {
	const id = useId()
	const triggerRef = useRef<Element | null>(null)
	const tipRef = useRef<HTMLDivElement | null>(null)
	const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [open, setOpen] = useState(false)
	const [coords, setCoords] = useState<Coords>({
		x: -9999,
		y: -9999,
		placement: position,
		arrowOffset: 0,
		ready: false,
	})

	const hasContent =
		!disabled && content !== null && content !== undefined && content !== ''

	const compute = useCallback(() => {
		const trigger = triggerRef.current
		const tip = tipRef.current
		if (!trigger || !tip) return
		const rect = trigger.getBoundingClientRect()
		if (rect.width === 0 && rect.height === 0) return
		const tipW = tip.offsetWidth
		const tipH = tip.offsetHeight
		if (tipW === 0 || tipH === 0) return

		const space = {
			top: rect.top - MARGIN,
			bottom: window.innerHeight - rect.bottom - MARGIN,
			left: rect.left - MARGIN,
			right: window.innerWidth - rect.right - MARGIN,
		}
		const need = {
			top: tipH + offset,
			bottom: tipH + offset,
			left: tipW + offset,
			right: tipW + offset,
		}

		const order: Placement[] = [
			position,
			...(['top', 'bottom', 'left', 'right'] as Placement[]).filter(
				(p) => p !== position
			),
		]
		let place =
			order.find((p) => space[p] >= need[p]) ??
			(orderBySpace(space)[0] as Placement)

		let x = 0
		let y = 0
		if (place === 'top') {
			x = rect.left + rect.width / 2 - tipW / 2
			y = rect.top - tipH - offset
		} else if (place === 'bottom') {
			x = rect.left + rect.width / 2 - tipW / 2
			y = rect.bottom + offset
		} else if (place === 'left') {
			x = rect.left - tipW - offset
			y = rect.top + rect.height / 2 - tipH / 2
		} else {
			x = rect.right + offset
			y = rect.top + rect.height / 2 - tipH / 2
		}

		const clampedX = Math.min(
			Math.max(MARGIN, x),
			Math.max(MARGIN, window.innerWidth - tipW - MARGIN)
		)
		const clampedY = Math.min(
			Math.max(MARGIN, y),
			Math.max(MARGIN, window.innerHeight - tipH - MARGIN)
		)

		let arrowOffset: number
		if (place === 'top' || place === 'bottom') {
			const center = rect.left + rect.width / 2
			arrowOffset = Math.min(
				Math.max(12, center - clampedX),
				Math.max(12, tipW - 12)
			)
		} else {
			const center = rect.top + rect.height / 2
			arrowOffset = Math.min(
				Math.max(12, center - clampedY),
				Math.max(12, tipH - 12)
			)
		}

		if (
			(place === 'top' && clampedY !== y) ||
			(place === 'bottom' && clampedY !== y)
		) {
			const flipped: Placement = place === 'top' ? 'bottom' : 'top'
			if (space[flipped] >= need[flipped]) {
				place = flipped
				y =
					flipped === 'top'
						? rect.top - tipH - offset
						: rect.bottom + offset
				const cy = Math.min(
					Math.max(MARGIN, y),
					Math.max(MARGIN, window.innerHeight - tipH - MARGIN)
				)
				const center = rect.left + rect.width / 2
				arrowOffset = Math.min(
					Math.max(12, center - clampedX),
					Math.max(12, tipW - 12)
				)
				setCoords({ x: clampedX, y: cy, placement: place, arrowOffset, ready: true })
				return
			}
		}

		setCoords({ x: clampedX, y: clampedY, placement: place, arrowOffset, ready: true })
	}, [offset, position])

	function orderBySpace(space: Record<Placement, number>): Placement[] {
		return (Object.keys(space) as Placement[]).sort(
			(a, b) => space[b] - space[a]
		)
	}

	useLayoutEffect(() => {
		if (open && hasContent) compute()
	}, [open, hasContent, content, compute])

	useEffect(() => {
		if (!open) return
		const onReposition = () => compute()
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') hide()
		}
		window.addEventListener('scroll', onReposition, true)
		window.addEventListener('resize', onReposition)
		if (window.visualViewport) {
			window.visualViewport.addEventListener('resize', onReposition)
		}
		document.addEventListener('keydown', onKey)
		return () => {
			window.removeEventListener('scroll', onReposition, true)
			window.removeEventListener('resize', onReposition)
			if (window.visualViewport) {
				window.visualViewport.removeEventListener('resize', onReposition)
			}
			document.removeEventListener('keydown', onKey)
		}
	}, [open, compute])

	useEffect(() => {
		return () => {
			if (showTimer.current) clearTimeout(showTimer.current)
		}
	}, [])

	function show() {
		if (!hasContent) return
		if (showTimer.current) clearTimeout(showTimer.current)
		if (delay <= 0) {
			setCoords((c) => ({ ...c, ready: false }))
			setOpen(true)
			return
		}
		showTimer.current = setTimeout(() => {
			setCoords((c) => ({ ...c, ready: false }))
			setOpen(true)
		}, delay)
	}

	function hide() {
		if (showTimer.current) {
			clearTimeout(showTimer.current)
			showTimer.current = null
		}
		setOpen(false)
	}

	const trigger = isValidElement(children) ? (
		children as ReactElement<Record<string, unknown>>
	) : (
		<span style={{ display: 'inline-flex' }}>{children}</span>
	)
	const childProps = isValidElement(children)
		? ((children as ReactElement<Record<string, unknown>>).props as Record<
				string,
				unknown
			>)
		: {}
	const originalRef = getTriggerRef(trigger)

	const cloned = isValidElement(trigger)
		? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
				ref: (instance: Element | null) => {
					triggerRef.current = instance
					setTriggerRef(originalRef, instance)
				},
				'aria-describedby': open ? id : (childProps['aria-describedby'] as string | undefined),
				onMouseEnter: (e: unknown) => {
					;(childProps.onMouseEnter as ((e: unknown) => void) | undefined)?.(e)
					show()
				},
				onMouseLeave: (e: unknown) => {
					;(childProps.onMouseLeave as ((e: unknown) => void) | undefined)?.(e)
					hide()
				},
				onFocus: (e: unknown) => {
					;(childProps.onFocus as ((e: unknown) => void) | undefined)?.(e)
					show()
				},
				onBlur: (e: unknown) => {
					;(childProps.onBlur as ((e: unknown) => void) | undefined)?.(e)
					hide()
				},
				onTouchStart: (e: unknown) => {
					;(childProps.onTouchStart as ((e: unknown) => void) | undefined)?.(e)
					show()
				},
				onClick: (e: unknown) => {
					;(childProps.onClick as ((e: unknown) => void) | undefined)?.(e)
					hide()
				},
			})
		: trigger

	const arrowStyle = ((): React.CSSProperties => {
		const size = 8
		const base: React.CSSProperties = {
			position: 'absolute',
			width: size,
			height: size,
			transform: 'rotate(45deg)',
			backgroundColor: 'var(--bg-mantle)',
			borderColor: 'var(--overlay)',
		}
		if (coords.placement === 'top') {
			return {
				...base,
				left: coords.arrowOffset - size / 2,
				bottom: -size / 2 - 0.5,
				borderRight: '1px solid var(--overlay)',
				borderBottom: '1px solid var(--overlay)',
			}
		}
		if (coords.placement === 'bottom') {
			return {
				...base,
				left: coords.arrowOffset - size / 2,
				top: -size / 2 - 0.5,
				borderLeft: '1px solid var(--overlay)',
				borderTop: '1px solid var(--overlay)',
			}
		}
		if (coords.placement === 'left') {
			return {
				...base,
				top: coords.arrowOffset - size / 2,
				right: -size / 2 - 0.5,
				borderRight: '1px solid var(--overlay)',
				borderTop: '1px solid var(--overlay)',
			}
		}
		return {
			...base,
			top: coords.arrowOffset - size / 2,
			left: -size / 2 - 0.5,
			borderLeft: '1px solid var(--overlay)',
			borderBottom: '1px solid var(--overlay)',
		}
	})()

	return (
		<>
			{cloned}
			{open &&
				hasContent &&
				typeof document !== 'undefined' &&
				createPortal(
					<div
						ref={tipRef}
						id={id}
						role="tooltip"
						className={contentClassName}
						style={{
							position: 'fixed',
							left: coords.x,
							top: coords.y,
							zIndex: 9999,
							maxWidth: 'min(240px, calc(100vw - 16px))',
							padding: '6px 10px',
							fontSize: 12,
							lineHeight: 1.4,
							textAlign: 'center',
							wordBreak: 'break-word',
							whiteSpace: 'normal',
							color: 'var(--text)',
							backgroundColor: 'var(--bg-mantle)',
							border: '1px solid var(--overlay)',
							borderRadius: 8,
							boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
							pointerEvents: 'none',
							opacity: coords.ready ? 1 : 0,
							transition: 'opacity 120ms ease-out',
						}}
					>
						{content}
						<span style={arrowStyle} aria-hidden="true" />
					</div>,
					document.body
				)}
		</>
	)
}
