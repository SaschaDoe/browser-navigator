import { Page } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { FrameworkAdapter } from './FrameworkAdapter';
import type { ComponentInfo } from '../types';

export class NextJSAdapter extends FrameworkAdapter {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    super('nextjs');
    this.projectRoot = projectRoot;
  }

  async discoverRoutes(page: Page, baseUrl: string): Promise<string[]> {
    console.log('🔍 Discovering Next.js routes...');
    
    // Try both pages and app directory structures
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
      const routes: string[] = ['/'];
      
      // Check for App Router (app directory)
      const appDir = path.join(this.projectRoot, 'app');
      if (await this.directoryExists(appDir)) {
        const appRoutes = await this.discoverAppRouterRoutes(appDir);
        routes.push(...appRoutes);
      }
      
      // Check for Pages Router (pages directory)
      const pagesDir = path.join(this.projectRoot, 'pages');
      if (await this.directoryExists(pagesDir)) {
        const pageRoutes = await this.discoverPagesRouterRoutes(pagesDir);
        routes.push(...pageRoutes);
      }
      
      // Check for src directory structure
      const srcAppDir = path.join(this.projectRoot, 'src/app');
      const srcPagesDir = path.join(this.projectRoot, 'src/pages');
      
      if (await this.directoryExists(srcAppDir)) {
        const appRoutes = await this.discoverAppRouterRoutes(srcAppDir);
        routes.push(...appRoutes);
      }
      
      if (await this.directoryExists(srcPagesDir)) {
        const pageRoutes = await this.discoverPagesRouterRoutes(srcPagesDir);
        routes.push(...pageRoutes);
      }
      
      return [...new Set(routes)].sort();
      
    } catch (error) {
      console.warn('⚠️ Could not read routes from file system:', error instanceof Error ? error.message : 'Unknown error');
      return ['/'];
    }
  }

  private async discoverAppRouterRoutes(appDir: string): Promise<string[]> {
    const pageFiles = await glob('**/page.{js,jsx,ts,tsx}', { cwd: appDir });
    
    return pageFiles.map(file => {
      const routePath = file
        .replace(/\/page\.(js|jsx|ts|tsx)$/, '')
        .replace(/^page\.(js|jsx|ts|tsx)$/, '')
        .replace(/\[([^\]]+)\]/g, ':$1') // Convert [param] to :param
        .replace(/\[\.\.\.([^\]]+)\]/g, '*$1'); // Convert [...param] to *param
      
      return routePath === '' ? '/' : `/${routePath}`;
    });
  }

  private async discoverPagesRouterRoutes(pagesDir: string): Promise<string[]> {
    const pageFiles = await glob('**/*.{js,jsx,ts,tsx}', { 
      cwd: pagesDir,
      ignore: ['_app.*', '_document.*', '_error.*', 'api/**/*']
    });
    
    return pageFiles.map(file => {
      const routePath = file
        .replace(/\.(js|jsx|ts|tsx)$/, '')
        .replace(/\/index$/, '')
        .replace(/^index$/, '')
        .replace(/\[([^\]]+)\]/g, ':$1') // Convert [param] to :param
        .replace(/\[\.\.\.([^\]]+)\]/g, '*$1'); // Convert [...param] to *param
      
      return routePath === '' ? '/' : `/${routePath}`;
    });
  }

  private async directoryExists(dir: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dir);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  async navigateToRoute(page: Page, route: string, baseUrl: string): Promise<void> {
    return this.navigateToRouteDefault(page, route, baseUrl);
  }

  async analyzeComponents(): Promise<ComponentInfo[]> {
    console.log('🧩 Analyzing Next.js components...');
    
    try {
      const components: ComponentInfo[] = [];
      
      // Find all React components
      const componentPatterns = [
        'components/**/*.{js,jsx,ts,tsx}',
        'src/components/**/*.{js,jsx,ts,tsx}',
        'app/**/*.{js,jsx,ts,tsx}',
        'src/app/**/*.{js,jsx,ts,tsx}',
        'pages/**/*.{js,jsx,ts,tsx}',
        'src/pages/**/*.{js,jsx,ts,tsx}'
      ];
      
      const allFiles: string[] = [];
      for (const pattern of componentPatterns) {
        const files = await glob(pattern, { cwd: this.projectRoot });
        allFiles.push(...files);
      }
      
      const uniqueFiles = [...new Set(allFiles)];
      
      for (const file of uniqueFiles) {
        const filePath = path.join(this.projectRoot, file);
        const name = path.basename(file, path.extname(file));
        
        // Determine component type
        let type: 'component' | 'page' | 'layout' = 'component';
        if (file.includes('/pages/') || file.includes('page.')) {
          type = 'page';
        } else if (file.includes('layout.') || file.includes('_app.')) {
          type = 'layout';
        }
        
        // Analyze component props (basic analysis)
        const props = await this.analyzeComponentProps(filePath);
        
        // Find where this component is used
        const usedIn = await this.findComponentUsage(name, uniqueFiles);
        
        components.push({
          name,
          path: file,
          usedIn,
          props,
          type
        });
      }
      
      console.log(`📊 Analyzed ${components.length} Next.js components`);
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
      
      // Look for TypeScript interface/type definitions
      const interfaceMatches = content.match(/interface\s+\w*Props\s*{([^}]*)}/gs);
      if (interfaceMatches) {
        interfaceMatches.forEach(match => {
          const propMatches = match.match(/(\w+):/g);
          if (propMatches) {
            propMatches.forEach(prop => {
              props.push(prop.replace(':', ''));
            });
          }
        });
      }
      
      // Look for destructured props in function parameters
      const funcPropMatches = content.match(/(?:function|const)\s+\w+\s*\(\s*{\s*([^}]+)\s*}/g);
      if (funcPropMatches) {
        funcPropMatches.forEach(match => {
          const propMatch = match.match(/{\s*([^}]+)\s*}/);
          if (propMatch) {
            const propNames = propMatch[1].split(',').map(p => p.trim().split(':')[0].trim());
            props.push(...propNames);
          }
        });
      }
      
      return [...new Set(props)];
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
        
        // Check for component import and usage
        const importPattern = new RegExp(`import.*${componentName}.*from`, 'g');
        const usagePattern = new RegExp(`<${componentName}\\b`, 'g');
        
        if (importPattern.test(content) || usagePattern.test(content)) {
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
    return 3000;
  }

  getBuildCommand(): string {
    return 'npm run build';
  }

  // Next.js-specific configuration detection
  async getActualDevPort(): Promise<number> {
    try {
      // Check next.config.js for custom port
      const configPath = path.join(this.projectRoot, 'next.config.js');
      try {
        const content = await fs.readFile(configPath, 'utf-8');
        const portMatch = content.match(/port:\s*(\d+)/);
        if (portMatch) {
          return parseInt(portMatch[1]);
        }
      } catch {
        // File doesn't exist, continue
      }
      
      // Check package.json scripts for custom port
      const packagePath = path.join(this.projectRoot, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      if (packageJson.scripts?.dev) {
        const portMatch = packageJson.scripts.dev.match(/-p\s+(\d+)|--port\s+(\d+)/);
        if (portMatch) {
          return parseInt(portMatch[1] || portMatch[2]);
        }
      }
    } catch {
      // Fall back to default
    }
    
    return this.getDevPort();
  }
} 