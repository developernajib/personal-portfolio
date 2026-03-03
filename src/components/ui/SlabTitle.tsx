interface SlabTitleProps {
    title: string
    config?: string // e.g. "4c 3i" — size + c=colored i=italic per word
    href?: string
    as?: 'h1' | 'h2'
}

function hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

const grayColors = ['#e6edf3', '#8b949e', '#6e7681', '#484f58']

interface WordConfig {
    size: number
    colored: boolean
    italic: boolean
}

function parseConfig(config: string | undefined, wordCount: number): WordConfig[] {
    if (!config) {
        return Array(wordCount).fill({ size: 3, colored: false, italic: false })
    }
    return config
        .split(/\s+/)
        .filter(Boolean)
        .map((cfg) => {
            const sizeMatch = cfg.match(/^([\d.]+)/)
            const size = sizeMatch ? parseFloat(sizeMatch[1]) : 3
            const colored = cfg.includes('c')
            const italic = cfg.includes('i')
            return { size, colored, italic }
        })
}

export default function SlabTitle({ title, config, href, as: Tag = 'h1' }: SlabTitleProps) {
    const words = title.split(' ')
    const wordConfigs = parseConfig(config, words.length)

    const content = (
        <Tag className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3 sm:gap-y-2">
            {words.map((word, i) => {
                const wc = wordConfigs[i] ?? { size: 3, colored: false, italic: false }
                const h = hashCode(title + i)
                const color = wc.colored ? 'var(--primary)' : grayColors[h % grayColors.length]
                const fontWeight = wc.italic ? 300 : 900

                return (
                    <span
                        key={i}
                        className="leading-none uppercase"
                        style={{
                            fontSize: `clamp(${(wc.size * 0.6 * 0.85).toFixed(2)}rem, ${(wc.size * 2.2 * 0.8).toFixed(2)}vw, ${wc.size * 0.75}rem)`,
                            fontWeight,
                            fontStyle: wc.italic ? 'italic' : 'normal',
                            color,
                            fontFamily: wc.italic ? 'serif' : "'JetBrains Mono', monospace",
                        }}
                    >
                        {word}
                    </span>
                )
            })}
        </Tag>
    )

    if (href) {
        return (
            <a href={href} className="block outline-none">
                {content}
            </a>
        )
    }

    return content
}
