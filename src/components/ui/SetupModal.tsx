import { useState } from 'react'
import {
	IconAlertTriangle,
	IconTerminal2,
	IconCopy,
	IconCheck,
	IconX,
	IconFileDescription,
} from '@tabler/icons-react'
import type { missingDataFiles } from '@/lib/dataSetup'

interface Props {
	missing: typeof missingDataFiles
	onDismiss: () => void
}

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)

	function handleCopy() {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		})
	}

	return (
		<button
			onClick={handleCopy}
			className="flex-shrink-0 p-1.5 rounded transition-colors duration-150"
			style={{ color: copied ? 'var(--primary)' : 'var(--subtext)' }}
			aria-label="Copy command"
		>
			{copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
		</button>
	)
}

export default function SetupModal({ missing, onDismiss }: Props) {
	const commands = missing.map((f) => `cp ${f.example} ${f.file}`).join('\n')
	const singleCommand = missing.map((f) => `cp ${f.example} ${f.file}`).join(' && ')

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
			style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
		>
			<div
				className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
				style={{
					backgroundColor: 'var(--bg-surface)',
					borderColor: 'var(--overlay)',
				}}
			>
				{/* Header */}
				<div
					className="flex items-start gap-3 px-6 pt-6 pb-4 border-b"
					style={{ borderColor: 'var(--overlay)' }}
				>
					<div
						className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl"
						style={{ backgroundColor: 'rgba(var(--primary-rgb,0,213,217),0.12)' }}
					>
						<IconAlertTriangle size={20} style={{ color: 'var(--primary)' }} />
					</div>
					<div className="flex-1 min-w-0">
						<h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
							Data Setup Required
						</h2>
						<p className="text-xs mt-0.5" style={{ color: 'var(--subtext)' }}>
							{missing.length} data file{missing.length > 1 ? 's are' : ' is'}{' '}
							missing. Copy from the example templates to get started.
						</p>
					</div>
					<button
						onClick={onDismiss}
						className="flex-shrink-0 p-1.5 rounded-lg transition-colors duration-150 hover-primary"
						style={{ color: 'var(--subtext)' }}
						aria-label="Dismiss"
					>
						<IconX size={16} />
					</button>
				</div>

				{/* Missing files list */}
				<div className="px-6 py-4 space-y-2">
					{missing.map((f) => (
						<div
							key={f.file}
							className="flex items-center gap-3 rounded-lg px-3 py-2.5"
							style={{ backgroundColor: 'var(--bg-mantle)' }}
						>
							<IconFileDescription size={15} style={{ color: 'var(--primary)' }} />
							<div className="flex-1 min-w-0">
								<p
									className="text-xs font-mono font-medium truncate"
									style={{ color: 'var(--text)' }}
								>
									{f.file}
								</p>
								<p className="text-xs" style={{ color: 'var(--subtext)' }}>
									{f.description}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Commands */}
				<div
					className="mx-6 mb-4 rounded-xl overflow-hidden border"
					style={{ borderColor: 'var(--overlay)', backgroundColor: 'var(--bg-base)' }}
				>
					<div
						className="flex items-center justify-between px-3 py-2 border-b"
						style={{ borderColor: 'var(--overlay)' }}
					>
						<div className="flex items-center gap-2">
							<IconTerminal2 size={13} style={{ color: 'var(--primary)' }} />
							<span
								className="text-xs font-medium"
								style={{ color: 'var(--subtext)' }}
							>
								Run in your project root
							</span>
						</div>
						<CopyButton text={singleCommand} />
					</div>
					<pre
						className="px-4 py-3 text-xs font-mono overflow-x-auto"
						style={{ color: 'var(--text)', lineHeight: '1.7' }}
					>
						{commands}
					</pre>
				</div>

				{/* Footer */}
				<div className="px-6 pb-6 flex items-center justify-between gap-3">
					<p className="text-xs" style={{ color: 'var(--overlay)' }}>
						Edit the files to add your own data, then restart the dev server.
					</p>
					<button
						onClick={onDismiss}
						className="flex-shrink-0 text-xs px-4 py-2 rounded-lg border transition-colors duration-150 hover-primary"
						style={{
							color: 'var(--subtext)',
							borderColor: 'var(--overlay)',
						}}
					>
						Continue anyway
					</button>
				</div>
			</div>
		</div>
	)
}
