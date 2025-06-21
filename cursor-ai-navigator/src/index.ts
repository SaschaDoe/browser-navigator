export { CursorNavigator } from './core/CursorNavigator';
export { FrameworkAdapter } from './adapters/FrameworkAdapter';
export { SvelteKitAdapter } from './adapters/SvelteKitAdapter';
export { NextJSAdapter } from './adapters/NextJSAdapter';
export { VueAdapter } from './adapters/VueAdapter';
export { ReactAdapter } from './adapters/ReactAdapter';
export { GenericAdapter } from './adapters/GenericAdapter';

// Type exports
export type {
  NavigationResult,
  ElementInfo,
  PerformanceMetrics,
  AppMap,
  ComponentInfo,
  NavigatorOptions,
  FrameworkType
} from './types';

// Utility exports
export { createNavigator } from './utils/factory';
export { detectFramework } from './utils/detector';
export { installPlaywright } from './utils/installer'; 