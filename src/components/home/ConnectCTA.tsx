import { IconMessageCircle, IconMail, IconBrandLinkedin } from '@tabler/icons-react'
import Site from '@/lib/config'
import { copyEmail } from '@/components/ui/Toast'

export default function ConnectCTA() {
	return (
		<div
			className="flex flex-col rounded-xl border p-5 shadow-lg h-full"
			style={{
				backgroundColor: 'var(--bg-surface)',
				borderColor: 'var(--overlay)',
			}}
		>
			<div className="flex items-center gap-2 mb-4">
				<IconMessageCircle size={18} color="var(--primary)" />
				<span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
					Let's Connect
				</span>
			</div>

			<p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--subtext)' }}>
				If you want to discuss work or just say hello, send a message. My
				inbox stays open and I reply as soon as possible.
			</p>

			<div className="space-y-2">
				<a
					href={Site.socials.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border hover-bg-primary-up cursor-hand"
					style={{
						color: 'var(--primary)',
						borderColor: 'rgba(var(--primary-rgb, 0,213,217),0.3)',
						backgroundColor: 'rgba(var(--primary-rgb, 0,213,217),0.08)',
					}}
				>
					<IconBrandLinkedin size={15} />
					Message on LinkedIn
				</a>
				<button
					onClick={() => copyEmail(Site.socials.email)}
					className="hover-primary hover-border-primary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border w-full"
					style={{
						color: 'var(--subtext)',
						borderColor: 'var(--overlay)',
						backgroundColor: 'var(--bg-mantle)',
					}}
				>
					<IconMail size={15} />
					Send an email
				</button>
			</div>
		</div>
	)
}
