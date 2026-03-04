import { IconMail } from '@tabler/icons-react'
import { copyEmail } from './Toast'

interface Props {
	email: string
	label?: string
	size?: number
	style?: React.CSSProperties
	className?: string
}

export default function EmailCopyButton({ email, label, size = 15, style, className }: Props) {
	return (
		<button
			onClick={() => copyEmail(email)}
			className={`flex items-center gap-1.5 transition-colors duration-150 ${className ?? ''}`}
			style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...style }}
			aria-label={`Copy email: ${email}`}
		>
			<IconMail size={size} />
			{label && <span>{label}</span>}
		</button>
	)
}
