import { Page } from '@playwright/test';
import type { ComponentInfo, FrameworkType } from '../types';

export abstract class FrameworkAdapter {
  protected frameworkType: FrameworkType;

  constructor(frameworkType: FrameworkType) {
    this.frameworkType = frameworkType;
  }

  abstract discoverRoutes(page: Page, baseUrl: string): Promise<string[]>;
  abstract navigateToRoute(page: Page, route: string, baseUrl: string): Promise<void>;
  abstract analyzeComponents(): Promise<ComponentInfo[]>;
  abstract getDevCommand(): string;
  abstract getDevPort(): number;
  abstract getBuildCommand(): string;

  getFrameworkType(): FrameworkType {
    return this.frameworkType;
  }

  // Common route discovery logic that can be used by subclasses
  protected async discoverRoutesFromLinks(page: Page, baseUrl: string): Promise<string[]> {
    console.log('🔍 Discovering routes from page links...');
    
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      
      // Get all internal links
      const links = await page.evaluate((base) => {
        const baseUrl = new URL(base);
        const linkElements = Array.from(document.querySelectorAll('a[href]'));
        
        return linkElements
          .map(link => link.getAttribute('href'))
          .filter((href): href is string => {
            if (!href) return false;
            
            try {
              const url = new URL(href, base);
              // Only include same-origin links
              return url.origin === baseUrl.origin;
            } catch {
              // Relative URLs
              return href.startsWith('/') && !href.startsWith('//');
            }
          })
          .map(href => {
            try {
              return new URL(href, base).pathname;
            } catch {
              return href;
            }
          });
      }, baseUrl);
      
      // Deduplicate and clean up
      const uniqueRoutes = [...new Set(['/', ...links])].sort();
      
      console.log(`📍 Discovered ${uniqueRoutes.length} routes from links:`, uniqueRoutes);
      return uniqueRoutes;
      
    } catch (error) {
      console.error('❌ Error discovering routes from links:', error);
      return ['/'];
    }
  }

  // Common navigation logic
  protected async navigateToRouteDefault(page: Page, route: string, baseUrl: string): Promise<void> {
    const fullUrl = new URL(route, baseUrl).toString();
    console.log(`  🧭 Navigating to: ${fullUrl}`);
    
    await page.goto(fullUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for any dynamic content to load
    await page.waitForTimeout(1000);
  }

  // Helper to check if dev server is running
  protected async isServerRunning(port: number): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:${port}`);
      return response.ok;
    } catch {
      return false;
    }
  }
} 