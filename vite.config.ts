import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import fs from 'fs'

// Stubs for each data file — exported when the real file doesn't exist.
// Each stub exports empty data + __missing = true so the app can detect and show setup guide.
const DATA_STUBS: Record<string, string> = {
	projects: `export const projects = []; export const __missing = true;`,
	experience: `export const experience = []; export const __missing = true;`,
	certificates: `export const certificates = []; export const __missing = true;`,
	technologies: `export const technologies = []; export const __missing = true;`,
	education: `export const education = []; export const __missing = true;`,
	currentlyWorkingOn: `export const currentlyWorkingOn = []; export const currentlyLearning = []; export const __missing = true;`,
	config: `const Site = { name: '', fullName: '', title: '', image: '', email: '', github: '', linkedin: '', telegram: '', location: '', resume: '' }; export default Site; export const __missing = true;`,
}

/** Vite plugin: resolves @data/* imports with __missing flag support.
 *  - File exists  → wraps real file, adds `export const __missing = false`
 *  - File missing → serves stub with empty data + `export const __missing = true`
 */
function dataFallbackPlugin() {
	const VIRTUAL_PREFIX = '\0virtual:data:'
	return {
		name: 'data-fallback',
		resolveId(id: string) {
			if (!id.startsWith('@data/')) return
			const name = id.replace('@data/', '')
			if (DATA_STUBS[name]) return VIRTUAL_PREFIX + name
		},
		load(id: string) {
			if (!id.startsWith(VIRTUAL_PREFIX)) return
			const name = id.replace(VIRTUAL_PREFIX, '')
			const realPath = path.resolve(__dirname, 'data', `${name}.ts`)
			if (fs.existsSync(realPath)) {
				// Inline the real file's content and append __missing flag.
				// This correctly handles both named exports and default exports.
				const content = fs.readFileSync(realPath, 'utf-8')
				return `${content}\nexport const __missing = false;\n`
			}
			return DATA_STUBS[name] ?? ''
		},
	}
}

export default defineConfig(({ mode }) => ({
	plugins: [
		dataFallbackPlugin(),
		react(),
		tailwindcss(),
		// Pre-compress assets with Brotli + gzip so Netlify serves pre-built files
		viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
		viteCompression({ algorithm: 'gzip', ext: '.gz' }),
		// Bundle visualizer — only active when running build:analyze
		mode === 'analyze' &&
			visualizer({
				filename: 'dist/stats.html',
				open: true,
				gzipSize: true,
				brotliSize: true,
			}),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.png', 'fonts/*.woff2', 'cursors/*.cur'],
			manifest: {
				name: 'DevNajib — Portfolio',
				short_name: 'DevNajib',
				description:
					'Full-stack Software Engineer from Bangladesh crafting fast, scalable systems.',
				theme_color: '#0d1117',
				background_color: '#0d1117',
				display: 'standalone',
				start_url: '/',
				icons: [
					{
						src: '/icons/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/icons/icon-384x384.png',
						sizes: '384x384',
						type: 'image/png',
					},
					{
						src: '/icons/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: '/icons/maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,woff2}'],
				runtimeCaching: [
					{
						// GitHub API responses
						urlPattern: /^https:\/\/api\.github\.com\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'github-api',
							expiration: { maxEntries: 10, maxAgeSeconds: 300 },
							cacheableResponse: { statuses: [0, 200] },
						},
					},
					{
						// CDN images (SimpleIcons, GitHub avatars)
						urlPattern:
							/^https:\/\/(cdn\.simpleicons\.org|avatars\.githubusercontent\.com)\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'cdn-images',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 30,
							},
							cacheableResponse: { statuses: [0, 200] },
						},
					},
					{
						// Local portfolio images (projects, certificates, photos)
						urlPattern:
							/\/(?:projects|certificates|logos)\/.*\.(?:png|jpe?g|webp|svg)$/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'portfolio-images',
							expiration: {
								maxEntries: 300,
								maxAgeSeconds: 60 * 60 * 24 * 21,
							},
							cacheableResponse: { statuses: [0, 200] },
						},
					},
					{
						// Map tiles
						urlPattern: /^https:\/\/[abc]\.basemaps\.cartocdn\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'map-tiles',
							expiration: {
								maxEntries: 200,
								maxAgeSeconds: 60 * 60 * 24 * 30,
							},
							cacheableResponse: { statuses: [0, 200] },
						},
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@data': path.resolve(__dirname, './data'),
		},
	},
	build: {
		// Target modern browsers — smaller output, no legacy polyfills
		target: 'esnext',
		// Split CSS per chunk so Leaflet's CSS only loads when LocationMap is used
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				manualChunks: {
					// Core React runtime — cached across all page navigations
					vendor: ['react', 'react-dom', 'react-router-dom'],
					// Leaflet is ~150kb and only used in LocationMap
					leaflet: ['leaflet'],
					// Markdown renderer only needed in ProjectDetail
					markdown: ['react-markdown', 'remark-gfm'],
				},
			},
		},
	},
	// Drop console.* and debugger statements in production builds
	esbuild: {
		drop: mode === 'development' ? [] : ['console', 'debugger'],
	},
	// Pre-bundle core deps during dev server startup so first page load is fast
	optimizeDeps: {
		include: ['react', 'react-dom', 'react-router-dom'],
	},
	// Watch data/ directory (outside src/) for HMR
	server: {
		watch: {
			ignored: ['!**/data/**'],
		},
	},
}))
