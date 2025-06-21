import { promises as fs } from 'fs';
import path from 'path';
import type { FrameworkType } from '../types';

export async function detectFramework(projectRoot: string): Promise<FrameworkType> {
  try {
    // Read package.json
    const packagePath = path.join(projectRoot, 'package.json');
    const packageContent = await fs.readFile(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    // Check for framework-specific dependencies and files
    
    // SvelteKit
    if (dependencies['@sveltejs/kit'] || await fileExists(path.join(projectRoot, 'svelte.config.js'))) {
      return 'sveltekit';
    }
    
    // Next.js
    if (dependencies['next'] || await fileExists(path.join(projectRoot, 'next.config.js'))) {
      return 'nextjs';
    }
    
    // Nuxt
    if (dependencies['nuxt'] || dependencies['@nuxt/core'] || await fileExists(path.join(projectRoot, 'nuxt.config.js')) || await fileExists(path.join(projectRoot, 'nuxt.config.ts'))) {
      return 'nuxt';
    }
    
    // Vue (but not Nuxt)
    if (dependencies['vue'] && !dependencies['nuxt']) {
      return 'vue';
    }
    
    // Angular
    if (dependencies['@angular/core'] || await fileExists(path.join(projectRoot, 'angular.json'))) {
      return 'angular';
    }
    
    // Remix
    if (dependencies['@remix-run/node'] || dependencies['@remix-run/react'] || await fileExists(path.join(projectRoot, 'remix.config.js'))) {
      return 'remix';
    }
    
    // Gatsby
    if (dependencies['gatsby'] || await fileExists(path.join(projectRoot, 'gatsby-config.js'))) {
      return 'gatsby';
    }
    
    // React (but not Next.js, Remix, or Gatsby)
    if (dependencies['react'] && !dependencies['next'] && !dependencies['@remix-run/react'] && !dependencies['gatsby']) {
      return 'react';
    }
    
    return 'generic';
    
  } catch (error) {
    console.warn('Could not detect framework:', error instanceof Error ? error.message : 'Unknown error');
    return 'generic';
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function detectDevPort(projectRoot: string): Promise<number> {
  try {
    const packagePath = path.join(projectRoot, 'package.json');
    const packageContent = await fs.readFile(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    if (packageJson.scripts?.dev) {
      const portMatch = packageJson.scripts.dev.match(/-p\s+(\d+)|--port\s+(\d+)|port[=:]\s*(\d+)/i);
      if (portMatch) {
        return parseInt(portMatch[1] || portMatch[2] || portMatch[3]);
      }
    }
    
    // Framework-specific defaults
    const framework = await detectFramework(projectRoot);
    switch (framework) {
      case 'sveltekit':
        return 5173;
      case 'nextjs':
        return 3000;
      case 'nuxt':
        return 3000;
      case 'vue':
        return 8080;
      case 'angular':
        return 4200;
      case 'react':
        return 3000;
      default:
        return 3000;
    }
    
  } catch {
    return 3000;
  }
}

export async function detectProjectInfo(projectRoot: string): Promise<{
  framework: FrameworkType;
  devPort: number;
  devCommand: string;
  buildCommand: string;
  name?: string;
  version?: string;
}> {
  const framework = await detectFramework(projectRoot);
  const devPort = await detectDevPort(projectRoot);
  
  let devCommand = 'npm run dev';
  let buildCommand = 'npm run build';
  let name: string | undefined;
  let version: string | undefined;
  
  try {
    const packagePath = path.join(projectRoot, 'package.json');
    const packageContent = await fs.readFile(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    name = packageJson.name;
    version = packageJson.version;
    
    if (packageJson.scripts?.dev) {
      devCommand = `npm run dev`;
    } else if (packageJson.scripts?.start) {
      devCommand = `npm run start`;
    } else if (packageJson.scripts?.serve) {
      devCommand = `npm run serve`;
    }
    
    if (packageJson.scripts?.build) {
      buildCommand = `npm run build`;
    }
    
  } catch {
    // Use defaults
  }
  
  return {
    framework,
    devPort,
    devCommand,
    buildCommand,
    name,
    version
  };
} 