import { chromium, Browser, Page } from '@playwright/test';
import { CursorNavigator } from '../core/CursorNavigator';
import { SvelteKitAdapter } from '../adapters/SvelteKitAdapter';
import { NextJSAdapter } from '../adapters/NextJSAdapter';
import { GenericAdapter } from '../adapters/GenericAdapter';
import type { FrameworkType, NavigatorOptions } from '../types';

export async function createNavigator(
  frameworkType: FrameworkType,
  projectRoot: string = process.cwd(),
  options: NavigatorOptions = {}
): Promise<CursorNavigator> {
  // Create appropriate adapter
  const adapter = createAdapter(frameworkType, projectRoot);
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: options.headless ?? true 
  });
  
  const context = await browser.newContext({
    viewport: options.viewport || { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Create navigator
  const navigator = new CursorNavigator(page, adapter, options);
  
  // Initialize navigator
  await navigator.initialize();
  
  // Store browser reference for cleanup
  (navigator as any).browser = browser;
  (navigator as any).context = context;
  
  return navigator;
}

function createAdapter(frameworkType: FrameworkType, projectRoot: string) {
  switch (frameworkType) {
    case 'sveltekit':
      return new SvelteKitAdapter(projectRoot);
      
    case 'nextjs':
      return new NextJSAdapter(projectRoot);
      
    case 'vue':
    case 'nuxt':
    case 'react':
    case 'angular':
    case 'remix':
    case 'gatsby':
    case 'generic':
    default:
      // Use generic adapter for unsupported frameworks
      return new GenericAdapter(projectRoot);
  }
}

// Helper to cleanup resources
export async function closeNavigator(navigator: CursorNavigator): Promise<void> {
  const browser = (navigator as any).browser as Browser;
  const context = (navigator as any).context;
  
  if (context) {
    await context.close();
  }
  
  if (browser) {
    await browser.close();
  }
} 