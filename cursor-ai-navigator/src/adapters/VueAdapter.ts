import { GenericAdapter } from './GenericAdapter';

export class VueAdapter extends GenericAdapter {
  constructor(projectRoot: string = process.cwd()) {
    super(projectRoot, {
      devCommand: 'npm run serve',
      devPort: 8080,
      buildCommand: 'npm run build',
      componentPatterns: [
        'src/**/*.vue',
        'components/**/*.vue',
        'pages/**/*.vue',
        'layouts/**/*.vue'
      ]
    });
    
    // Override framework type
    (this as any).frameworkType = 'vue';
  }
} 