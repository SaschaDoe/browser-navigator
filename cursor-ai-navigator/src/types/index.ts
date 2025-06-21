export interface NavigationResult {
  url: string;
  title: string;
  screenshot: string;
  elements: ElementInfo[];
  performance: PerformanceMetrics;
  errors: string[];
  timestamp: number;
}

export interface ElementInfo {
  selector: string;
  type: string;
  text?: string;
  href?: string;
  visible: boolean;
  position: { x: number; y: number; width: number; height: number };
  attributes?: Record<string, string>;
}

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  timeToInteractive?: number;
  memoryUsage?: number;
}

export interface AppMap {
  routes: NavigationResult[];
  components: ComponentInfo[];
  generatedAt: number;
  version: string;
  framework: FrameworkType;
  baseUrl: string;
  summary: AppSummary;
}

export interface ComponentInfo {
  name: string;
  path: string;
  usedIn: string[];
  props?: string[];
  type: 'component' | 'page' | 'layout';
}

export interface AppSummary {
  totalRoutes: number;
  successfulCaptures: number;
  totalElements: number;
  averageLoadTime: number;
  totalErrors: number;
  performanceScore?: number;
}

export interface NavigatorOptions {
  baseUrl?: string;
  outputDir?: string;
  screenshotDir?: string;
  timeout?: number;
  retries?: number;
  parallel?: boolean;
  headless?: boolean;
  viewport?: { width: number; height: number };
  customSelectors?: string[];
  excludeRoutes?: string[];
  includeRoutes?: string[];
  screenshotOptions?: ScreenshotOptions;
  performanceThresholds?: PerformanceThresholds;
}

export interface ScreenshotOptions {
  type: 'png' | 'jpeg' | 'webp';
  quality?: number;
  fullPage?: boolean;
  animations?: 'disabled' | 'allow';
  clip?: { x: number; y: number; width: number; height: number };
}

export interface PerformanceThresholds {
  loadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
}

export type FrameworkType = 
  | 'sveltekit'
  | 'nextjs'
  | 'nuxt'
  | 'vue'
  | 'react'
  | 'angular'
  | 'remix'
  | 'gatsby'
  | 'generic';

export interface FrameworkConfig {
  type: FrameworkType;
  devCommand: string;
  buildCommand: string;
  devPort: number;
  buildDir: string;
  routesDir?: string;
  pagesDir?: string;
  publicDir?: string;
}

export interface PlaywrightConfig {
  timeout: number;
  retries: number;
  workers: number;
  reporter: string[];
  use: {
    baseURL: string;
    headless: boolean;
    viewport: { width: number; height: number };
    screenshot: 'only-on-failure' | 'off' | 'on';
    video: 'retain-on-failure' | 'off' | 'on';
  };
}

export interface CLIOptions {
  init?: boolean;
  run?: boolean;
  config?: string;
  framework?: FrameworkType;
  port?: number;
  output?: string;
  verbose?: boolean;
  headless?: boolean;
  parallel?: boolean;
} 