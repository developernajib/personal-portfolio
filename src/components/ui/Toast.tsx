import { useEffect, useState, useCallback } from 'react'
import { IconCheck, IconX, IconInfoCircle, IconAlertTriangle } from '@tabler/icons-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
	id: string
	message: string
	type: ToastType
}

type Listener = (toast: ToastItem) => void
const listeners: Listener[] = []

let counter = 0

export function toast(message: string, type: ToastType = 'success') {
	const item: ToastItem = { id: `toast-${++counter}`, message, type }
	listeners.forEach((fn) => fn(item))
}

export function copyEmail(email: string) {
	navigator.clipboard
		.writeText(email)
		.then(() => {
			toast(`Copied: ${email}`, 'success')
		})
		.catch(() => {
			toast('Failed to copy email', 'error')
		})
}

const ICONS: Record<ToastType, React.ReactNode> = {
	success: <IconCheck size={15} />,
	error: <IconX size={15} />,
	info: <IconInfoCircle size={15} />,
	warning: <IconAlertTriangle size={15} />,
}

const COLORS: Record<ToastType, { bg: string; border: string; color: string }> = {
	success: {
		bg: 'rgba(var(--primary-rgb, 0,213,217),0.1)',
		border: 'rgba(var(--primary-rgb, 0,213,217),0.4)',
		color: 'var(--primary)',
	},
	error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.4)', color: '#ef4444' },
	info: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.4)', color: '#3b82f6' },
	warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.4)', color: '#f59e0b' },
}

function ToastNotification({
	item,
	onRemove,
}: {
	item: ToastItem
	onRemove: (id: string) => void
}) {
	const [visible, setVisible] = useState(false)
	const c = COLORS[item.type]

	useEffect(() => {
		// Trigger enter animation
		const t1 = setTimeout(() => setVisible(true), 10)
		// Auto dismiss after 3s
		const t2 = setTimeout(() => {
			setVisible(false)
			setTimeout(() => onRemove(item.id), 300)
		}, 3000)
		return () => {
			clearTimeout(t1)
			clearTimeout(t2)
		}
	}, [item.id, onRemove])

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '10px',
				padding: '10px 14px',
				borderRadius: '10px',
				border: `1px solid ${c.border}`,
				backgroundColor: c.bg,
				color: c.color,
				backdropFilter: 'blur(8px)',
				boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
				fontSize: '13px',
				fontFamily: 'JetBrains Mono, monospace',
				minWidth: '220px',
				maxWidth: '360px',
				transition: 'all 0.3s ease',
				opacity: visible ? 1 : 0,
				transform: visible ? 'translateY(0)' : 'translateY(12px)',
				cursor: 'pointer',
			}}
			onClick={() => {
				setVisible(false)
				setTimeout(() => onRemove(item.id), 300)
			}}
		>
			{ICONS[item.type]}
			<span style={{ flex: 1, color: 'var(--text)' }}>{item.message}</span>
		</div>
	)
}

export function ToastContainer() {
	const [toasts, setToasts] = useState<ToastItem[]>([])

	const addToast = useCallback((item: ToastItem) => {
		setToasts((prev) => [...prev, item])
	}, [])

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id))
	}, [])

	useEffect(() => {
		listeners.push(addToast)
		return () => {
			const idx = listeners.indexOf(addToast)
			if (idx > -1) listeners.splice(idx, 1)
		}
	}, [addToast])

	if (toasts.length === 0) return null

	return (
		<div
			aria-live="polite"
			aria-atomic="false"
			style={{
				position: 'fixed',
				bottom: '24px',
				right: '24px',
				zIndex: 9999,
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
				alignItems: 'flex-end',
			}}
		>
			{toasts.map((item) => (
				<ToastNotification key={item.id} item={item} onRemove={removeToast} />
			))}
		</div>
	)
}
