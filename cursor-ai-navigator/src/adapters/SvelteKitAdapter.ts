import { Page } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { FrameworkAdapter } from './FrameworkAdapter';
import type { ComponentInfo } from '../types';

export class SvelteKitAdapter extends FrameworkAdapter {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    super('sveltekit');
    this.projectRoot = projectRoot;
  }

  async discoverRoutes(page: Page, baseUrl: string): Promise<string[]> {
    console.log('🔍 Discovering SvelteKit routes...');
    
    // Try file-based route discovery first
    const fileRoutes = await this.discoverRoutesFromFiles();
    
    if (fileRoutes.length > 1) {
      console.log(`📁 Found ${fileRoutes.length} routes from file structure:`, fileRoutes);
      return fileRoutes;
    }
    
    // Fallback to link-based discovery
    console.log('🔗 Falling back to link-based route discovery...');
    return this.discoverRoutesFromLinks(page, baseUrl);
  }

  private async discoverRoutesFromFiles(): Promise<string[]> {
    try {
      const routesDir = path.join(this.projectRoot, 'src/routes');
      const routeFiles = await glob('**/+page.svelte', { cwd: routesDir });
      
      const routes = routeFiles.map(file => {
        // Convert file path to route
        const routePath = file
          .replace(/\/\+page\.svelte$/, '')
          .replace(/^\+page\.svelte$/, '')
          .replace(/\[([^\]]+)\]/g, ':$1'); // Convert [param] to :param
        
        return routePath === '' ? '/' : `/${routePath}`;
      });
      
      return ['/'].concat(routes.filter(route => route !== '/'));
    } catch (error) {
      console.warn('⚠️ Could not read routes from file system:', error instanceof Error ? error.message : 'Unknown error');
      return ['/'];
    }
  }

  async navigateToRoute(page: Page, route: string, baseUrl: string): Promise<void> {
    // SvelteKit uses client-side routing, so we need to handle it carefully
    return this.navigateToRouteDefault(page, route, baseUrl);
  }

  async analyzeComponents(): Promise<ComponentInfo[]> {
    console.log('🧩 Analyzing SvelteKit components...');
    
    try {
      const components: ComponentInfo[] = [];
      
      // Find all Svelte components
      const componentPattern = 'src/**/*.svelte';
      const componentFiles = await glob(componentPattern, { cwd: this.projectRoot });
      
      for (const file of componentFiles) {
        const filePath = path.join(this.projectRoot, file);
        const name = path.basename(file, '.svelte');
        
        // Determine component type
        let type: 'component' | 'page' | 'layout' = 'component';
        if (file.includes('+page.svelte')) {
          type = 'page';
        } else if (file.includes('+layout.svelte')) {
          type = 'layout';
        }
        
        // Analyze component props (basic analysis)
        const props = await this.analyzeComponentProps(filePath);
        
        // Find where this component is used (basic analysis)
        const usedIn = await this.findComponentUsage(name, componentFiles);
        
        components.push({
          name,
          path: file,
          usedIn,
          props,
          type
        });
      }
      
      console.log(`📊 Analyzed ${components.length} SvelteKit components`);
      return components;
      
    } catch (error) {
      console.error('❌ Error analyzing components:', error);
      return [];
    }
  }

  private async analyzeComponentProps(filePath: string): Promise<string[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const props: string[] = [];
      
      // Simple regex to find export let statements (props)
      const propMatches = content.match(/export\s+let\s+(\w+)/g);
      if (propMatches) {
        propMatches.forEach(match => {
          const propMatch = match.match(/export\s+let\s+(\w+)/);
          if (propMatch) {
            props.push(propMatch[1]);
          }
        });
      }
      
      return props;
    } catch {
      return [];
    }
  }

  private async findComponentUsage(componentName: string, allFiles: string[]): Promise<string[]> {
    const usedIn: string[] = [];
    
    for (const file of allFiles) {
      try {
        const filePath = path.join(this.projectRoot, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Check for component usage
        const usagePattern = new RegExp(`<${componentName}\\b`, 'g');
        if (usagePattern.test(content)) {
          usedIn.push(file);
        }
      } catch {
        // Skip files that can't be read
      }
    }
    
    return usedIn;
  }

  getDevCommand(): string {
    return 'npm run dev';
  }

  getDevPort(): number {
    // SvelteKit default dev port
    return 5173;
  }

  getBuildCommand(): string {
    return 'npm run build';
  }

  // SvelteKit-specific configuration detection
  async getActualDevPort(): Promise<number> {
    try {
      // Check vite.config.ts/js for custom port
      const configFiles = ['vite.config.ts', 'vite.config.js', 'svelte.config.js'];
      
      for (const configFile of configFiles) {
        const configPath = path.join(this.projectRoot, configFile);
        try {
          const content = await fs.readFile(configPath, 'utf-8');
          const portMatch = content.match(/port:\s*(\d+)/);
          if (portMatch) {
            return parseInt(portMatch[1]);
          }
        } catch {
          // File doesn't exist, continue
        }
      }
    } catch {
      // Fall back to default
    }
    
    return this.getDevPort();
  }
} 