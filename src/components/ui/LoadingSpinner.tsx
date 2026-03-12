export default function LoadingSpinner() {
	return (
		<div
			className="flex items-center justify-center min-h-screen"
			style={{ backgroundColor: 'var(--bg-base)' }}
		>
			<div className="flex flex-col items-center gap-3">
				<div
					className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
					style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
				/>
				<span className="text-xs font-mono" style={{ color: 'var(--subtext)' }}>
					Loading…
				</span>
			</div>
		</div>
	)
}
