import { test, expect, type Page } from '@playwright/test';
import { CursorNavigator } from '../cursor-ai-navigator/src/core/CursorNavigator';
import { SvelteKitAdapter } from '../cursor-ai-navigator/src/adapters/SvelteKitAdapter';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * E2E Integration Tests for Cursor AI Navigator
 * These tests verify the complete visual mapping functionality
 */
test.describe('Cursor AI Navigator E2E', () => {
  let navigator: CursorNavigator;
  const outputDir = 'cursor-app-map';

  test.beforeEach(async ({ page }) => {
    const adapter = new SvelteKitAdapter(process.cwd());
    navigator = new CursorNavigator(page, adapter, {
      baseUrl: process.env.BASE_URL || 'http://localhost:5174',
      outputDir,
      parallel: false,
      headless: true,
      screenshotOptions: {
        type: 'png',
        fullPage: true,
        animations: 'disabled'
      },
      performanceThresholds: {
        loadTime: 10000, // More lenient for CI
        firstContentfulPaint: 5000,
        largestContentfulPaint: 8000,
        cumulativeLayoutShift: 0.2
      }
    });
    
    await navigator.initialize();
  });

  test('should discover and map all application routes', async () => {
    console.log('🧪 Testing complete app mapping...');

    const appMap = await navigator.generateAppMap();

    // Verify app map structure
    expect(appMap.routes).toBeDefined();
    expect(appMap.routes.length).toBeGreaterThan(0);
    expect(appMap.framework).toBe('sveltekit');
    expect(appMap.summary.totalRoutes).toBeGreaterThan(0);
    expect(appMap.summary.successfulCaptures).toBeGreaterThan(0);

    // Verify each route has complete data
    for (const route of appMap.routes) {
      expect(route.url).toBeDefined();
      expect(route.title).toBeDefined();
      expect(route.screenshot).toBeDefined();
      expect(route.elements).toBeDefined();
      expect(route.performance).toBeDefined();
      expect(route.performance.loadTime).toBeGreaterThan(0);
      expect(Array.isArray(route.elements)).toBe(true);
      expect(Array.isArray(route.errors)).toBe(true);
    }

    console.log(`✅ Successfully mapped ${appMap.routes.length} routes`);
    console.log(`📊 Performance Score: ${appMap.summary.performanceScore}/100`);
    console.log(`🎯 Total Elements: ${appMap.summary.totalElements}`);
  });

  test('should capture interactive elements with proper metadata', async () => {
    const routes = await navigator.discoverRoutes();
    expect(routes.length).toBeGreaterThan(0);

    const homeRoute = await navigator.captureRoute('/');
    
    // Verify element capture
    expect(homeRoute.elements).toBeDefined();
    expect(homeRoute.elements.length).toBeGreaterThan(0);

    // Check element structure
    const interactiveElements = homeRoute.elements.filter(el => 
      ['button', 'a', 'input', 'select', 'textarea'].includes(el.type)
    );
    
    expect(interactiveElements.length).toBeGreaterThan(0);

    // Verify element properties
    interactiveElements.forEach(element => {
      expect(element.selector).toBeDefined();
      expect(element.type).toBeDefined();
      expect(element.visible).toBeDefined();
      expect(element.position).toBeDefined();
      expect(element.position.x).toBeGreaterThanOrEqual(0);
      expect(element.position.y).toBeGreaterThanOrEqual(0);
    });
  });

  test('should generate comprehensive reports and files', async () => {
    await navigator.generateAppMap();
    
    // Verify all expected files are created
    const expectedFiles = [
      path.join(outputDir, 'app-map.json'),
      path.join(outputDir, 'README.md'),
      path.join(outputDir, 'quick-map.json')
    ];
    
    for (const filePath of expectedFiles) {
      const exists = await fs.access(filePath).then(() => true, () => false);
      expect(exists).toBe(true);
    }

    // Verify content quality
    const appMapContent = await fs.readFile(path.join(outputDir, 'app-map.json'), 'utf-8');
    const appMap = JSON.parse(appMapContent);
    
    expect(appMap.version).toBeDefined();
    expect(appMap.framework).toBe('sveltekit');
    expect(appMap.generatedAt).toBeDefined();
    expect(appMap.summary).toBeDefined();

    const readmeContent = await fs.readFile(path.join(outputDir, 'README.md'), 'utf-8');
    expect(readmeContent).toContain('# 📱 App Visual Map for Cursor AI');
    expect(readmeContent).toContain('## 🗺️ Route Overview');
    expect(readmeContent).toContain('## 🧠 Cursor AI Integration Notes');
  });

  test('should handle errors gracefully and report performance issues', async () => {
    // Test with invalid route to check error handling
    try {
      await navigator.captureRoute('/nonexistent-route-12345');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Generate map and check for performance monitoring
    const appMap = await navigator.generateAppMap();
    
    // Performance score should be calculated
    expect(appMap.summary.performanceScore).toBeDefined();
    expect(appMap.summary.performanceScore).toBeGreaterThanOrEqual(0);
    expect(appMap.summary.performanceScore).toBeLessThanOrEqual(100);
  });
}); 