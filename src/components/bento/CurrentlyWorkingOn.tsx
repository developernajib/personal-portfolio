import { IconCode, IconArrowRight } from '@tabler/icons-react'
import { currentlyWorkingOn, currentlyLearning } from '@data/currentlyWorkingOn'

export default function CurrentlyWorkingOn() {
	return (
		<div
			className="flex flex-col rounded-xl border p-5 shadow-lg h-full"
			style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--overlay)' }}
		>
			<div className="flex items-center gap-2 mb-4">
				<IconCode size={18} color="var(--primary)" />
				<span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
					Currently Working On
				</span>
				<span className="ml-auto flex h-2 w-2 relative" title="Active">
					<span
						className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
						style={{ backgroundColor: 'var(--primary)' }}
					/>
					<span
						className="relative inline-flex h-2 w-2 rounded-full"
						style={{ backgroundColor: 'var(--primary)' }}
					/>
				</span>
			</div>

			<div className="space-y-3 flex-1">
				{currentlyWorkingOn.map((item) => (
					<div
						key={item.title}
						className="rounded-lg p-3 border"
						style={{
							backgroundColor: 'var(--bg-mantle)',
							borderColor: 'var(--overlay)',
						}}
					>
						{item.url ? (
							<a
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover-opacity text-sm font-medium mb-1 block"
								style={{ color: 'var(--primary)' }}
							>
								{item.title}
							</a>
						) : (
							<p
								className="text-sm font-medium mb-1"
								style={{ color: 'var(--primary)' }}
							>
								{item.title}
							</p>
						)}
						<p className="text-xs" style={{ color: 'var(--subtext)' }}>
							{item.subtitle}
						</p>
					</div>
				))}

				{currentlyLearning.map((item) => (
					<div
						key={item.title}
						className="rounded-lg p-3 border"
						style={{
							backgroundColor: 'var(--bg-mantle)',
							borderColor: 'var(--overlay)',
						}}
					>
						<p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
							{item.title}
						</p>
						<p className="text-xs" style={{ color: 'var(--subtext)' }}>
							{item.subtitle}
						</p>
					</div>
				))}
			</div>

			<a
				href="/projects"
				className="hover-primary mt-4 flex items-center gap-1 text-xs"
				style={{ color: 'var(--subtext)' }}
			>
				View all projects
				<IconArrowRight size={12} />
			</a>
		</div>
	)
}
