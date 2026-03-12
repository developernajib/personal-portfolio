import React, { type ReactNode } from 'react'

interface Props {
	children: ReactNode
	fallback?: ReactNode
}

interface State {
	hasError: boolean
	error?: Error
}

export default class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error('[ErrorBoundary]', error, info.componentStack)
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) return this.props.fallback
			return (
				<div
					className="flex flex-col items-center justify-center min-h-[200px] rounded-xl border p-8 text-center"
					style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
				>
					<p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
						Something went wrong
					</p>
					<p className="text-xs" style={{ color: 'var(--subtext)' }}>
						This section failed to render. Try refreshing the page.
					</p>
				</div>
			)
		}
		return this.props.children
	}
}
