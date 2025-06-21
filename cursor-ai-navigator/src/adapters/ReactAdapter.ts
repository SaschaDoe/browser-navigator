import { GenericAdapter } from './GenericAdapter';

export class ReactAdapter extends GenericAdapter {
  constructor(projectRoot: string = process.cwd()) {
    super(projectRoot, {
      devCommand: 'npm start',
      devPort: 3000,
      buildCommand: 'npm run build',
      componentPatterns: [
        'src/**/*.{js,jsx,ts,tsx}',
        'components/**/*.{js,jsx,ts,tsx}',
        'pages/**/*.{js,jsx,ts,tsx}'
      ]
    });
    
    // Override framework type
    (this as any).frameworkType = 'react';
  }
} 