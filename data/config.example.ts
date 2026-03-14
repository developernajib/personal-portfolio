const Site = {
	name: 'Your Name',
	fullName: 'Your Full Name',
	title: 'Your Job Title',
	image: 'your-photo.jpg',
	url: 'https://yourportfolio.com',
	description: 'A short description about yourself.',
	location: {
		city: 'Your City',
		country: 'Your Country',
		timezone: 'America/New_York', // e.g. Asia/Dhaka, Europe/London
		lat: 40.7128,
		lng: -74.006,
	},
	socials: {
		github: 'https://github.com/yourusername',
		linkedin: 'https://linkedin.com/in/yourusername',
		telegram: 'https://t.me/yourusername',
		email: 'you@example.com',
	},
	resume: import.meta.env.VITE_RESUME_URL as string | undefined,
}

export default Site
