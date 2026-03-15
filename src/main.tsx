import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Only register service worker in production (deployed site).
// On localhost, unregister any existing SW so it doesn't interfere with
// other apps that may run on the same port.
window.addEventListener('load', () => {
	const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
	if (!isLocalhost) {
		import('virtual:pwa-register').then(({ registerSW }) => registerSW())
	} else if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			registrations.forEach((r) => r.unregister())
		})
	}
})

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
