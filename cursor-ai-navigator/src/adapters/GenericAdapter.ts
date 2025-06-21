import { Page } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { FrameworkAdapter } from './FrameworkAdapter';
import type { ComponentInfo } from '../types';

export class GenericAdapter extends FrameworkAdapter {
  private projectRoot: string;
  private customConfig: {
    devCommand?: string;
    devPort?: number;
    buildCommand?: string;
    componentPatterns?: string[];
  };

  constructor(
    projectRoot: string = process.cwd(),
    customConfig: {
      devCommand?: string;
      devPort?: number;
      buildCommand?: string;
      componentPatterns?: string[];
    } = {}
  ) {
    super('generic');
    this.projectRoot = projectRoot;
    this.customConfig = customConfig;
  }

  async discoverRoutes(page: Page, baseUrl: string): Promise<string[]> {
    console.log('🔍 Discovering routes using generic link-based approach...');
    
    // For generic projects, we rely on link-based discovery
    return this.discoverRoutesFromLinks(page, baseUrl);
  }

  async navigateToRoute(page: Page, route: string, baseUrl: string): Promise<void> {
    return this.navigateToRouteDefault(page, route, baseUrl);
  }

  async analyzeComponents(): Promise<ComponentInfo[]> {
    console.log('🧩 Analyzing components using generic patterns...');
    
    try {
      const components: ComponentInfo[] = [];
      
      // Use custom patterns or default generic patterns
      const componentPatterns = this.customConfig.componentPatterns || [
        '**/*.{js,jsx,ts,tsx,vue,svelte}',
        'src/**/*.{js,jsx,ts,tsx,vue,svelte}',
        'components/**/*.{js,jsx,ts,tsx,vue,svelte}',
        'lib/**/*.{js,jsx,ts,tsx,vue,svelte}'
      ];
      
      const allFiles: string[] = [];
      for (const pattern of componentPatterns) {
        try {
          const files = await glob(pattern, { 
            cwd: this.projectRoot,
            ignore: [
              'node_modules/**',
              'dist/**',
              'build/**',
              '.next/**',
              '.nuxt/**',
              '*.test.*',
              '*.spec.*'
            ]
          });
          allFiles.push(...files);
        } catch (error) {
          console.warn(`⚠️ Could not read pattern ${pattern}:`, error instanceof Error ? error.message : 'Unknown error');
        }
      }
      
      const uniqueFiles = [...new Set(allFiles)];
      
      for (const file of uniqueFiles) {
        try {
          const filePath = path.join(this.projectRoot, file);
          const name = path.basename(file, path.extname(file));
          
          // Basic file type detection
          let type: 'component' | 'page' | 'layout' = 'component';
          const fileName = file.toLowerCase();
          
          if (fileName.includes('page') || fileName.includes('route')) {
            type = 'page';
          } else if (fileName.includes('layout') || fileName.includes('app')) {
            type = 'layout';
          }
          
          // Basic analysis (limited for generic approach)
          const props = await this.analyzeGenericFile(filePath);
          
          components.push({
            name,
            path: file,
            usedIn: [], // Generic approach doesn't analyze usage
            props,
            type
          });
        } catch (error) {
          console.warn(`⚠️ Could not analyze file ${file}:`, error instanceof Error ? error.message : 'Unknown error');
        }
      }
      
      console.log(`📊 Analyzed ${components.length} generic components`);
      return components;
      
    } catch (error) {
      console.error('❌ Error analyzing components:', error);
      return [];
    }
  }

  private async analyzeGenericFile(filePath: string): Promise<string[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const props: string[] = [];
      
      // Look for various prop patterns across different frameworks
      
      // React/Vue props
      const reactPropMatches = content.match(/props\.(\w+)/g);
      if (reactPropMatches) {
        reactPropMatches.forEach(match => {
          const prop = match.replace('props.', '');
          props.push(prop);
        });
      }
      
      // Svelte props (export let)
      const sveltePropMatches = content.match(/export\s+let\s+(\w+)/g);
      if (sveltePropMatches) {
        sveltePropMatches.forEach(match => {
          const propMatch = match.match(/export\s+let\s+(\w+)/);
          if (propMatch) {
            props.push(propMatch[1]);
          }
        });
      }
      
      // Vue 3 props
      const vuePropsMatches = content.match(/defineProps<[^>]*>|defineProps\(/g);
      if (vuePropsMatches) {
        // Basic Vue prop detection (would need more sophisticated parsing)
        const propsSection = content.match(/defineProps[^}]+}/s);
        if (propsSection) {
          const propNames = propsSection[0].match(/(\w+):/g);
          if (propNames) {
            propNames.forEach(prop => {
              props.push(prop.replace(':', ''));
            });
          }
        }
      }
      
      return [...new Set(props)];
    } catch {
      return [];
    }
  }

  getDevCommand(): string {
    return this.customConfig.devCommand || 'npm run dev';
  }

  getDevPort(): number {
    return this.customConfig.devPort || 3000;
  }

  getBuildCommand(): string {
    return this.customConfig.buildCommand || 'npm run build';
  }

  // Generic configuration detection
  async detectConfiguration(): Promise<{
    devCommand: string;
    devPort: number;
    buildCommand: string;
    framework?: string;
  }> {
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      // Detect framework from dependencies
      let detectedFramework = 'generic';
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (deps['next']) detectedFramework = 'nextjs';
      else if (deps['@sveltejs/kit']) detectedFramework = 'sveltekit';
      else if (deps['nuxt']) detectedFramework = 'nuxt';
      else if (deps['vue']) detectedFramework = 'vue';
      else if (deps['react']) detectedFramework = 'react';
      else if (deps['@angular/core']) detectedFramework = 'angular';
      
      // Detect port from scripts
      let detectedPort = 3000;
      if (packageJson.scripts?.dev) {
        const portMatch = packageJson.scripts.dev.match(/-p\s+(\d+)|--port\s+(\d+)|port[=:]\s*(\d+)/i);
        if (portMatch) {
          detectedPort = parseInt(portMatch[1] || portMatch[2] || portMatch[3]);
        }
      }
      
      return {
        devCommand: packageJson.scripts?.dev || 'npm run dev',
        devPort: detectedPort,
        buildCommand: packageJson.scripts?.build || 'npm run build',
        framework: detectedFramework
      };
      
    } catch (error) {
      console.warn('⚠️ Could not detect project configuration:', error instanceof Error ? error.message : 'Unknown error');
      return {
        devCommand: 'npm run dev',
        devPort: 3000,
        buildCommand: 'npm run build'
      };
    }
  }
} 