import { describe, it, expect, vi } from 'vitest';
import { createSvelteKitNavigator, type NavigationResult } from './lib/index';

describe('CursorNavigator Integration', () => {
	const mockBaseUrl = 'http://localhost:5173';

	describe('factory function', () => {
		it('should create navigator with SvelteKit adapter', () => {
			const mockPage = { goto: vi.fn(), title: vi.fn() };
			const navigator = createSvelteKitNavigator(mockPage, { baseUrl: mockBaseUrl });
			
			expect(navigator).toBeDefined();
		});

		it('should use default options when none provided', () => {
			const mockPage = { goto: vi.fn(), title: vi.fn() };
			const navigator = createSvelteKitNavigator(mockPage);
			
			expect(navigator).toBeDefined();
		});
	});

	describe('type checking', () => {
		it('should have proper NavigationResult type', () => {
			const mockResult: NavigationResult = {
				url: '/',
				title: 'Test Page',
				screenshot: '/path/to/screenshot.png',
				elements: [],
				performance: { loadTime: 1000 },
				errors: [],
				timestamp: Date.now()
			};

			expect(mockResult).toBeDefined();
			expect(mockResult.url).toBe('/');
			expect(mockResult.performance.loadTime).toBe(1000);
		});
	});
});
