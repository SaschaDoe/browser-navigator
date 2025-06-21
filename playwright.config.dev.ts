import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run dev',
		port: 5174,
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
	testDir: 'e2e',
	use: {
		baseURL: 'http://localhost:5174',
	},
	timeout: 30000,
	// Run only the auto-navigator test when using this config
	testMatch: '**/auto-navigator.spec.ts'
}); 