export interface Photo {
	id: string
	src: string
	alt: string
	caption?: string
}

export const photos: Photo[] = [
	{ id: '1', src: '/pics/photo-1.webp', alt: 'Photo 1', caption: 'Caption for photo 1' },
	{ id: '2', src: '/pics/photo-2.webp', alt: 'Photo 2', caption: 'Caption for photo 2' },
	{ id: '3', src: '/pics/photo-3.webp', alt: 'Photo 3', caption: 'Caption for photo 3' },
	{ id: '4', src: '/pics/photo-4.webp', alt: 'Photo 4', caption: 'Caption for photo 4' },
	{ id: '5', src: '/pics/photo-5.webp', alt: 'Photo 5', caption: 'Caption for photo 5' },
	{ id: '6', src: '/pics/photo-6.webp', alt: 'Photo 6', caption: 'Caption for photo 6' },
]
