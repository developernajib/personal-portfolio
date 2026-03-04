import React from 'react'
import { Link } from 'react-router-dom'
import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandTelegram,
    IconArrowRight,
    IconFileText,
} from '@tabler/icons-react'
import Site from '@/lib/config'

const socialLinks = [
    { href: Site.socials.github, label: 'GitHub', Icon: IconBrandGithub },
    { href: Site.socials.linkedin, label: 'LinkedIn', Icon: IconBrandLinkedin },
    { href: Site.socials.telegram, label: 'Telegram', Icon: IconBrandTelegram },
]

interface InlineLink {
    href: string
    label: string
    ariaLabel?: string
}

function HeroLink({ href, label, ariaLabel }: InlineLink) {
    const isInternal = href.startsWith('/')
    return (
        <a
            href={href}
            {...(!isInternal && { target: '_blank', rel: 'noopener noreferrer' })}
            className="link"
            aria-label={ariaLabel}
        >
            {label}
        </a>
    )
}

export default function HeroSection() {
    return (
        <section className="space-y-6">
            <h1
                className="text-2xl font-bold md:text-4xl leading-tight"
                style={{ color: 'var(--text)' }}
            >
                Hey! I'm <span style={{ color: 'var(--primary)' }}>{Site.fullName}</span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed" style={{ color: 'var(--subtext)' }}>
                I'm a Software Engineer II with 3 years of full-stack experience, now channeling
                that into building scalable, high-performance distributed systems with{' '}
                <HeroLink href="https://go.dev" label="Go" ariaLabel="Go programming language" />.
                {' '}I've designed and shipped{' '}
                <HeroLink href="/projects/lyncafe" label="Multi-Tenant SaaS" ariaLabel="LynCafe multi-tenant SaaS project" />{' '}
                platforms — applying clean architecture, Domain-Driven Design, and event-driven
                patterns to real production problems. I believe the best engineers never stop
                questioning their assumptions, and that mindset drives everything{' '}
                <HeroLink href="/projects" label="I build" ariaLabel="View my projects" />.
            </p>

            {/* Actions row */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Resume button — styled pill, only shown when VITE_RESUME_URL is set */}
                {Site.resume && (
                    <a
                        href={Site.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 hover-bg-primary-up"
                        style={{
                            color: 'var(--primary)',
                            backgroundColor: 'rgba(var(--primary-rgb, 0,213,217), 0.1)',
                            border: '1px solid rgba(var(--primary-rgb, 0,213,217), 0.3)',
                        }}
                    >
                        <IconFileText size={15} stroke={1.5} className="pointer-events-none" />
                        View Resume
                    </a>
                )}

                {/* Divider */}
                <span className="select-none text-sm" style={{ color: 'var(--overlay)' }}>|</span>

                {/* Social links */}
                {socialLinks.map(({ href, label, Icon }, i) => (
                    <React.Fragment key={label}>
                        {i > 0 && (
                            <span className="select-none text-sm" style={{ color: 'var(--overlay)' }}>
                                |
                            </span>
                        )}
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm hover-primary"
                            style={{ color: 'var(--subtext)' }}
                        >
                            <Icon size={15} stroke={1.5} className="pointer-events-none" />
                            {label}
                        </a>
                    </React.Fragment>
                ))}

                <span className="select-none text-sm" style={{ color: 'var(--overlay)' }}>|</span>
                <Link
                    to="/about"
                    className="flex items-center gap-1 text-sm hover-primary"
                    style={{ color: 'var(--subtext)' }}
                >
                    More about me <IconArrowRight size={13} className="pointer-events-none" />
                </Link>
            </div>
        </section>
    )
}
