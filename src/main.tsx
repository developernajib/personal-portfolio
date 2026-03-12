import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Defer SW registration fully off the critical path — dynamic import keeps
// workbox-window out of the main bundle parse entirely
window.addEventListener('load', () => {
	import('virtual:pwa-register').then(({ registerSW }) => registerSW())
})

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
