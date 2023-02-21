import { defineConfig } from 'cypress'

export default defineConfig({
	defaultCommandTimeout: 10000,
	e2e: {
		specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
		baseUrl: 'http://localhost:4173'
	}
})
