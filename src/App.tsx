import React, { lazy, Suspense, useState } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import BottomNav from './components/layout/BottomNav'
import MobileScrollbar from './components/ui/MobileScrollbar'
import { ToastContainer } from './components/ui/Toast'
import ErrorBoundary from './components/ui/ErrorBoundary'
import LoadingSpinner from './components/ui/LoadingSpinner'
import SetupModal from './components/ui/SetupModal'
import { setupRequired, missingDataFiles } from './lib/dataSetup'
// Home is the entry page — eager import so LCP renders without waiting for a lazy chunk
import Home from './pages/Home'
import {
	preloadAbout,
	preloadProjects,
	preloadProjectDetail,
	preloadExperience,
	preloadExperienceDetail,
	preloadCertificates,
	preloadTechnologies,
} from './routes/preload'

// Lazy-loaded page chunks — share the same import fn as preload.ts so Vite
// produces a single chunk per page (no duplication).
const About = lazy(preloadAbout)
const Projects = lazy(preloadProjects)
const ProjectDetail = lazy(preloadProjectDetail)
const Certificates = lazy(preloadCertificates)
const Technologies = lazy(preloadTechnologies)
const ExperiencePage = lazy(preloadExperience)
const ExperienceDetail = lazy(preloadExperienceDetail)

function Layout() {
	return (
		<div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
			<Header />
			<main className="flex-1 pb-22 lg:pb-0">
				<Outlet />
			</main>
			<Footer />
			<BottomNav />
			<MobileScrollbar />
			<ToastContainer />
		</div>
	)
}

function LazyPage({ children }: { children: React.ReactNode }) {
	return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
}

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'home', element: <Navigate to="/" replace /> },
			{
				path: 'about',
				element: (
					<LazyPage>
						<About />
					</LazyPage>
				),
			},
			{
				path: 'projects',
				element: (
					<LazyPage>
						<Projects />
					</LazyPage>
				),
			},
			{
				path: 'projects/:slug',
				element: (
					<LazyPage>
						<ProjectDetail />
					</LazyPage>
				),
			},
			{
				path: 'certificates',
				element: (
					<LazyPage>
						<Certificates />
					</LazyPage>
				),
			},
			{
				path: 'technologies',
				element: (
					<LazyPage>
						<Technologies />
					</LazyPage>
				),
			},
			{
				path: 'experience',
				element: (
					<LazyPage>
						<ExperiencePage />
					</LazyPage>
				),
			},
			{
				path: 'experience/:id',
				element: (
					<LazyPage>
						<ExperienceDetail />
					</LazyPage>
				),
			},
			{ path: '*', element: <Navigate to="/" replace /> },
		],
	},
])

export default function App() {
	const [modalDismissed, setModalDismissed] = useState(false)

	return (
		<ErrorBoundary>
			<RouterProvider router={router} />
			{setupRequired && !modalDismissed && (
				<SetupModal missing={missingDataFiles} onDismiss={() => setModalDismissed(true)} />
			)}
		</ErrorBoundary>
	)
}
