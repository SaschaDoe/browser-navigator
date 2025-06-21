// place files you want to import through the `$lib` alias in this folder.

// Type-only re-exports for testing
export type { 
  NavigationResult, 
  ElementInfo, 
  PerformanceMetrics, 
  AppMap, 
  NavigatorOptions,
  FrameworkType 
} from '../../cursor-ai-navigator/src/types';

// Mock implementation for testing
export function createSvelteKitNavigator(page: any, options: any = {}) {
  // This is a mock for unit testing
  return {
    initialize: () => Promise.resolve(),
    discoverRoutes: () => Promise.resolve(['/']),
    captureRoute: () => Promise.resolve({
      url: '/',
      title: 'Test',
      screenshot: 'test.png',
      elements: [],
      performance: { loadTime: 100 },
      errors: [],
      timestamp: Date.now()
    }),
    generateAppMap: () => Promise.resolve({
      routes: [],
      components: [],
      generatedAt: Date.now(),
      version: '1.0.0',
      framework: 'sveltekit' as const,
      baseUrl: 'http://localhost:5173',
      summary: {
        totalRoutes: 1,
        successfulCaptures: 1,
        totalElements: 0,
        averageLoadTime: 100,
        totalErrors: 0,
        performanceScore: 100
      }
    })
  };
}
