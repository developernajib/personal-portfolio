import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
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
						urlPattern: /\/(?:projects|certificates|logos)\/.*\.(?:png|jpe?g|webp|svg)$/i,
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
})
