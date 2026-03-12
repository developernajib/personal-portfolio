/**
 * Preload functions for each route chunk.
 * Calling preload() on hover fires the dynamic import early so the JS bundle
 * is already in the browser cache by the time the user clicks.
 * Vite deduplicates chunks — the same import string here and in App.tsx
 * resolves to the same chunk, so no double download.
 */

export const preloadAbout = () => import('@/pages/About')
export const preloadProjects = () => import('@/pages/Projects')
export const preloadProjectDetail = () => import('@/pages/ProjectDetail')
export const preloadExperience = () => import('@/pages/ExperiencePage')
export const preloadExperienceDetail = () => import('@/pages/ExperienceDetail')
export const preloadCertificates = () => import('@/pages/Certificates')
export const preloadTechnologies = () => import('@/pages/Technologies')
