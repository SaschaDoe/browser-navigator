import { Page } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import type { 
  NavigationResult, 
  ElementInfo, 
  PerformanceMetrics, 
  AppMap, 
  NavigatorOptions,
} from '../types';
import { FrameworkAdapter } from '../adapters/FrameworkAdapter';

export class CursorNavigator {
  private page: Page;
  private adapter: FrameworkAdapter;
  private options: Required<NavigatorOptions>;
  private screenshotDir: string;
  private outputDir: string;

  constructor(
    page: Page, 
    adapter: FrameworkAdapter, 
    options: NavigatorOptions = {}
  ) {
    this.page = page;
    this.adapter = adapter;
    this.options = this.mergeWithDefaults(options);
    this.outputDir = path.resolve(this.options.outputDir);
    this.screenshotDir = path.join(this.outputDir, 'screenshots');
  }

  private mergeWithDefaults(options: NavigatorOptions): Required<NavigatorOptions> {
    return {
      baseUrl: options.baseUrl || 'http://localhost:3000',
      outputDir: options.outputDir || 'cursor-app-map',
      screenshotDir: options.screenshotDir || 'screenshots',
      timeout: options.timeout || 30000,
      retries: options.retries || 2,
      parallel: options.parallel || false,
      headless: options.headless ?? true,
      viewport: options.viewport || { width: 1280, height: 720 },
      customSelectors: options.customSelectors || [],
      excludeRoutes: options.excludeRoutes || [],
      includeRoutes: options.includeRoutes || [],
      screenshotOptions: {
        type: 'png',
        quality: 90,
        fullPage: true,
        animations: 'disabled',
        ...options.screenshotOptions
      },
      performanceThresholds: {
        loadTime: 5000,
        firstContentfulPaint: 2000,
        largestContentfulPaint: 4000,
        cumulativeLayoutShift: 0.1,
        ...options.performanceThresholds
      }
    };
  }

  async initialize(): Promise<void> {
    // Ensure output directories exist
    await fs.mkdir(this.screenshotDir, { recursive: true });
    
    // Setup page configuration
    await this.page.setViewportSize(this.options.viewport);
    
    // Setup error tracking
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('❌ Page error:', msg.text());
      }
    });

    this.page.on('pageerror', error => {
      console.error('❌ Page exception:', error.message);
    });

    console.log(`🚀 Initializing Cursor Navigator for ${this.options.baseUrl}`);
    console.log(`📁 Framework: ${this.adapter.getFrameworkType()}`);
  }

  async discoverRoutes(): Promise<string[]> {
    console.log('🔍 Discovering routes...');
    
    try {
      // Use adapter-specific route discovery
      const routes = await this.adapter.discoverRoutes(this.page, this.options.baseUrl);
      
      // Apply filters
      let filteredRoutes = routes;
      
      if (this.options.includeRoutes.length > 0) {
        filteredRoutes = routes.filter(route => 
          this.options.includeRoutes.some(pattern => 
            route.match(new RegExp(pattern))
          )
        );
      }
      
      if (this.options.excludeRoutes.length > 0) {
        filteredRoutes = filteredRoutes.filter(route => 
          !this.options.excludeRoutes.some(pattern => 
            route.match(new RegExp(pattern))
          )
        );
      }
      
      console.log(`📍 Found ${filteredRoutes.length} routes:`, filteredRoutes);
      return filteredRoutes;
      
    } catch (error) {
      console.error('❌ Error discovering routes:', error);
      return ['/'];
    }
  }

  async captureRoute(url: string): Promise<NavigationResult> {
    const startTime = Date.now();
    console.log(`📸 Capturing route: ${url}`);
    
    try {
      // Navigate using adapter-specific logic
      await this.adapter.navigateToRoute(this.page, url, this.options.baseUrl);
      
      // Wait for page to be ready
      await this.page.waitForTimeout(1000);
      
      // Get page title
      const title = await this.page.title();
      console.log(`  ✅ Title: ${title}`);
      
      // Take screenshot
      const screenshotName = `${url.replace(/\//g, '_') || 'home'}_${Date.now()}.${this.options.screenshotOptions.type}`;
      const screenshotPath = path.join(this.screenshotDir, screenshotName);
      
      await this.page.screenshot({
        path: screenshotPath,
        type: this.options.screenshotOptions.type === 'webp' ? 'png' : this.options.screenshotOptions.type,
        quality: this.options.screenshotOptions.quality,
        fullPage: this.options.screenshotOptions.fullPage,
        animations: this.options.screenshotOptions.animations,
        clip: this.options.screenshotOptions.clip
      });
      
      console.log(`  📸 Screenshot saved: ${screenshotName}`);
      
      // Capture elements
      const elements = await this.captureElements();
      console.log(`  🎯 Found ${elements.length} interactive elements`);
      
      // Get performance metrics
      const performance = await this.capturePerformanceMetrics(startTime);
      console.log(`  ⚡ Load time: ${performance.loadTime}ms`);
      
      // Check for performance violations
      const violations = this.checkPerformanceViolations(performance);
      
      return {
        url,
        title,
        screenshot: screenshotPath,
        elements,
        performance,
        errors: violations,
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error(`❌ Error capturing route ${url}:`, error);
      throw error;
    }
  }

  private async captureElements(): Promise<ElementInfo[]> {
    const defaultSelectors = [
      'button',
      'a',
      'input',
      'select', 
      'textarea',
      '[role="button"]',
      '[onclick]',
      'form'
    ];
    
    const selectors = [...defaultSelectors, ...this.options.customSelectors];
    const elements: ElementInfo[] = [];

    for (const selector of selectors) {
      try {
        const elementHandles = await this.page.$$(selector);
        
        for (let i = 0; i < elementHandles.length; i++) {
          const handle = elementHandles[i];
          const isVisible = await handle.isVisible();
          const boundingBox = await handle.boundingBox();
          
          if (boundingBox) {
            // Get element attributes
            const attributes = await handle.evaluate((el) => {
              const attrs: Record<string, string> = {};
              for (let i = 0; i < el.attributes.length; i++) {
                const attr = el.attributes[i];
                attrs[attr.name] = attr.value;
              }
              return attrs;
            });

            const element: ElementInfo = {
              selector: `${selector}:nth-of-type(${i + 1})`,
              type: await handle.evaluate(el => el.tagName.toLowerCase()),
              text: (await handle.textContent())?.trim() || undefined,
              href: await handle.getAttribute('href') || undefined,
              visible: isVisible,
              position: {
                x: Math.round(boundingBox.x),
                y: Math.round(boundingBox.y),
                width: Math.round(boundingBox.width),
                height: Math.round(boundingBox.height)
              },
              attributes
            };
            
            elements.push(element);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Warning capturing elements for selector ${selector}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return elements;
  }

  private async capturePerformanceMetrics(startTime: number): Promise<PerformanceMetrics> {
    const loadTime = Date.now() - startTime;
    
    try {
      const metrics = await this.page.evaluate(() => {
        return {
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
          largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime,
          cumulativeLayoutShift: (window as unknown as { CLS?: number }).CLS || 0,
          timeToInteractive: (window as unknown as { TTI?: number }).TTI,
          memoryUsage: (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize
        };
      });

      return {
        loadTime,
        ...metrics
      };
    } catch (error) {
      console.warn('Failed to capture performance metrics:', error);
      return { loadTime };
    }
  }

  private checkPerformanceViolations(performance: PerformanceMetrics): string[] {
    const violations: string[] = [];
    const thresholds = this.options.performanceThresholds;
    
    if (thresholds.loadTime && performance.loadTime > thresholds.loadTime) {
      violations.push(`Load time (${performance.loadTime}ms) exceeds threshold (${thresholds.loadTime}ms)`);
    }
    
    if (thresholds.firstContentfulPaint && performance.firstContentfulPaint && performance.firstContentfulPaint > thresholds.firstContentfulPaint) {
      violations.push(`FCP (${performance.firstContentfulPaint}ms) exceeds threshold (${thresholds.firstContentfulPaint}ms)`);
    }
    
    if (thresholds.largestContentfulPaint && performance.largestContentfulPaint && performance.largestContentfulPaint > thresholds.largestContentfulPaint) {
      violations.push(`LCP (${performance.largestContentfulPaint}ms) exceeds threshold (${thresholds.largestContentfulPaint}ms)`);
    }
    
    if (thresholds.cumulativeLayoutShift && performance.cumulativeLayoutShift && performance.cumulativeLayoutShift > thresholds.cumulativeLayoutShift) {
      violations.push(`CLS (${performance.cumulativeLayoutShift}) exceeds threshold (${thresholds.cumulativeLayoutShift})`);
    }
    
    return violations;
  }

  async generateAppMap(): Promise<AppMap> {
    console.log('🗺️ Generating complete app map...');
    
    const routes = await this.discoverRoutes();
    const results: NavigationResult[] = [];

    // Process routes (parallel or sequential based on options)
    if (this.options.parallel) {
      console.log('🚀 Processing routes in parallel...');
      const promises = routes.map(route => 
        this.captureRoute(route).catch(error => {
          console.error(`❌ Failed to capture route ${route}:`, error);
          return null;
        })
      );
      
      const settled = await Promise.allSettled(promises);
      settled.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value);
        }
      });
    } else {
      for (const route of routes) {
        try {
          const result = await this.captureRoute(route);
          results.push(result);
        } catch (error) {
          console.error(`❌ Failed to capture route ${route}:`, error);
        }
      }
    }

    // Get framework-specific component information
    const components = await this.adapter.analyzeComponents();

    const appMap: AppMap = {
      routes: results,
      components,
      generatedAt: Date.now(),
      version: '1.0.0',
      framework: this.adapter.getFrameworkType(),
      baseUrl: this.options.baseUrl,
      summary: {
        totalRoutes: routes.length,
        successfulCaptures: results.length,
        totalElements: results.reduce((sum, route) => sum + route.elements.length, 0),
        averageLoadTime: results.length > 0 ? 
          Math.round(results.reduce((sum, route) => sum + route.performance.loadTime, 0) / results.length) : 0,
        totalErrors: results.reduce((sum, route) => sum + route.errors.length, 0),
        performanceScore: this.calculatePerformanceScore(results)
      }
    };

    // Save app map
    await this.saveAppMap(appMap);
    
    // Generate reports
    await this.generateReports(appMap);

    return appMap;
  }

  private calculatePerformanceScore(results: NavigationResult[]): number {
    if (results.length === 0) return 0;
    
    let totalScore = 0;
    
    results.forEach(result => {
      let score = 100;
      const perf = result.performance;
      const thresholds = this.options.performanceThresholds;
      
      // Deduct points for performance violations
      if (thresholds.loadTime && perf.loadTime > thresholds.loadTime) {
        score -= Math.min(30, (perf.loadTime - thresholds.loadTime) / 1000 * 10);
      }
      
      if (thresholds.firstContentfulPaint && perf.firstContentfulPaint && perf.firstContentfulPaint > thresholds.firstContentfulPaint) {
        score -= Math.min(20, (perf.firstContentfulPaint - thresholds.firstContentfulPaint) / 1000 * 10);
      }
      
      if (thresholds.cumulativeLayoutShift && perf.cumulativeLayoutShift && perf.cumulativeLayoutShift > thresholds.cumulativeLayoutShift) {
        score -= Math.min(25, perf.cumulativeLayoutShift * 100);
      }
      
      totalScore += Math.max(0, score);
    });
    
    return Math.round(totalScore / results.length);
  }

  private async saveAppMap(appMap: AppMap): Promise<void> {
    const mapPath = path.join(this.outputDir, 'app-map.json');
    await fs.writeFile(mapPath, JSON.stringify(appMap, null, 2));
    console.log('💾 App map saved to:', mapPath);
  }

  private async generateReports(appMap: AppMap): Promise<void> {
    await this.generateMarkdownReport(appMap);
    await this.generateJSONReport(appMap);
  }

  private async generateMarkdownReport(appMap: AppMap): Promise<void> {
    console.log('📝 Generating markdown report...');
    
    let report = `# 📱 App Visual Map for Cursor AI\n\n`;
    report += `**Generated:** ${new Date(appMap.generatedAt).toISOString()}\n`;
    report += `**Framework:** ${appMap.framework}\n`;
    report += `**Base URL:** ${appMap.baseUrl}\n`;
    report += `**Total Routes:** ${appMap.summary.totalRoutes}\n`;
    report += `**Successful Captures:** ${appMap.summary.successfulCaptures}\n`;
    report += `**Total Interactive Elements:** ${appMap.summary.totalElements}\n`;
    report += `**Average Load Time:** ${appMap.summary.averageLoadTime}ms\n`;
    report += `**Performance Score:** ${appMap.summary.performanceScore}/100\n\n`;
    
    if (appMap.summary.totalErrors > 0) {
      report += `**⚠️ Total Performance Violations:** ${appMap.summary.totalErrors}\n\n`;
    }
    
    report += `## 🗺️ Route Overview\n\n`;
    
    for (const route of appMap.routes) {
      report += `### ${route.url === '/' ? 'Home Page' : route.url}\n`;
      report += `- **URL:** \`${route.url}\`\n`;
      report += `- **Title:** ${route.title}\n`;
      report += `- **Screenshot:** [View Screenshot](${path.relative(this.outputDir, route.screenshot)})\n`;
      report += `- **Load Time:** ${route.performance.loadTime}ms\n`;
      report += `- **Interactive Elements:** ${route.elements.length}\n`;
      
      if (route.performance.firstContentfulPaint) {
        report += `- **First Contentful Paint:** ${route.performance.firstContentfulPaint}ms\n`;
      }
      
      if (route.errors.length > 0) {
        report += `- **⚠️ Performance Issues:** ${route.errors.length}\n`;
        route.errors.forEach(error => {
          report += `  - ${error}\n`;
        });
      }
      
      // List key interactive elements
      const buttons = route.elements.filter(el => el.type === 'button' || el.selector.includes('button'));
      const links = route.elements.filter(el => el.type === 'a');
      const forms = route.elements.filter(el => el.type === 'form');
      
      if (buttons.length > 0) {
        report += `- **Buttons:** ${buttons.length} (${buttons.filter(b => b.visible).length} visible)\n`;
      }
      if (links.length > 0) {
        report += `- **Links:** ${links.length} (${links.filter(l => l.visible).length} visible)\n`;
      }
      if (forms.length > 0) {
        report += `- **Forms:** ${forms.length}\n`;
      }
      
      report += `\n`;
    }

    // Add component analysis if available
    if (appMap.components.length > 0) {
      report += `## 🧩 Component Analysis\n\n`;
      appMap.components.forEach(component => {
        report += `### ${component.name}\n`;
        report += `- **Type:** ${component.type}\n`;
        report += `- **Path:** \`${component.path}\`\n`;
        if (component.usedIn.length > 0) {
          report += `- **Used In:** ${component.usedIn.join(', ')}\n`;
        }
        report += `\n`;
      });
    }

    report += `## 🧠 Cursor AI Integration Notes\n\n`;
    report += `This app map provides Cursor with:\n`;
    report += `- Visual screenshots of each page state\n`;
    report += `- Interactive element locations and properties\n`;
    report += `- Performance characteristics and violations\n`;
    report += `- ${appMap.framework} framework-specific insights\n`;
    report += `- Component structure and usage patterns\n\n`;

    const reportPath = path.join(this.outputDir, 'README.md');
    await fs.writeFile(reportPath, report);
    
    console.log('📋 Markdown report saved to:', reportPath);
  }

  private async generateJSONReport(appMap: AppMap): Promise<void> {
    // Generate a simplified JSON for quick AI consumption
    const quickMap = {
      framework: appMap.framework,
      routes: appMap.routes.map(route => ({
        url: route.url,
        title: route.title,
        elementCount: route.elements.length,
        loadTime: route.performance.loadTime,
        hasErrors: route.errors.length > 0
      })),
      summary: appMap.summary
    };

    const quickPath = path.join(this.outputDir, 'quick-map.json');
    await fs.writeFile(quickPath, JSON.stringify(quickMap, null, 2));
    
    console.log('⚡ Quick map saved to:', quickPath);
  }
}