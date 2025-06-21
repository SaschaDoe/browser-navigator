# 🚀 Usage Guide: Adding Cursor Navigator to Any Project

This guide shows you how to add Cursor Navigator to different types of web projects.

## 📦 Installation

### Option 1: NPM Package (Recommended)

```bash
# Install the package
npm install --save-dev @cursor-ai/navigator

# Initialize in your project
npx cursor-navigator init

# Install Playwright browsers
npm run cursor:install

# Generate app map
npm run cursor:map
```

### Option 2: Local Development

```bash
# Clone and build the framework
git clone https://github.com/cursor-ai/navigator.git
cd cursor-ai-navigator
npm install
npm run build
npm link

# In your project
npm link @cursor-ai/navigator
npx cursor-navigator init
```

## 🎯 Framework-Specific Setup

### SvelteKit Projects

```bash
# In your SvelteKit project
npx cursor-navigator init --framework sveltekit --port 5173

# Your config will be:
# framework: 'sveltekit'
# baseUrl: 'http://localhost:5173'
# Route discovery: File-based from src/routes
```

**Features:**
- ✅ Auto-discovers routes from `src/routes/+page.svelte` files
- ✅ Analyzes component props (`export let`)
- ✅ Detects page vs layout vs component types
- ✅ Handles dynamic routes `[param]`

### Next.js Projects

```bash
# In your Next.js project
npx cursor-navigator init --framework nextjs --port 3000

# Supports both App Router and Pages Router
```

**Features:**
- ✅ App Router (`app/page.tsx`) support
- ✅ Pages Router (`pages/index.tsx`) support
- ✅ Dynamic routes `[param]` and `[...param]`
- ✅ TypeScript prop analysis
- ✅ Auto-excludes API routes

### React Projects (CRA, Vite)

```bash
# In your React project
npx cursor-navigator init --framework react --port 3000

# Works with Create React App, Vite, etc.
```

**Features:**
- ✅ Link-based route discovery
- ✅ Component prop analysis
- ✅ JSX/TSX support

### Vue.js Projects

```bash
# In your Vue project
npx cursor-navigator init --framework vue --port 8080

# Works with Vue CLI, Vite, Nuxt
```

**Features:**
- ✅ Vue Router integration
- ✅ Component prop analysis (`defineProps`)
- ✅ SFC (Single File Component) support

### Generic/Other Frameworks

```bash
# For any other framework
npx cursor-navigator init --framework generic

# Works with Angular, Svelte, Solid, etc.
```

**Features:**
- ✅ Link-based route discovery
- ✅ Pattern-based component analysis
- ✅ Configurable selectors

## ⚙️ Configuration Examples

### Basic Configuration

```javascript
// cursor-navigator.config.js
module.exports = {
  framework: 'sveltekit',
  baseUrl: 'http://localhost:5173',
  outputDir: 'cursor-app-map',
  headless: true
};
```

### Advanced Configuration

```javascript
// cursor-navigator.config.js
module.exports = {
  framework: 'nextjs',
  baseUrl: 'http://localhost:3000',
  outputDir: 'ai-map',
  headless: true,
  parallel: true,
  
  // Browser settings
  viewport: { width: 1280, height: 720 },
  timeout: 30000,
  retries: 2,
  
  // Route filtering
  excludeRoutes: [
    '/admin.*',      // Exclude admin routes
    '/api/.*',       // Exclude API routes
    '.*private.*'    // Exclude private pages
  ],
  
  // Custom element selectors
  customSelectors: [
    '[data-testid]',
    '.clickable',
    'nav a'
  ],
  
  // Screenshot options
  screenshotOptions: {
    type: 'png',
    quality: 90,
    fullPage: true,
    animations: 'disabled'
  },
  
  // Performance monitoring
  performanceThresholds: {
    loadTime: 3000,
    firstContentfulPaint: 1500,
    largestContentfulPaint: 2500,
    cumulativeLayoutShift: 0.1
  }
};
```

## 📁 Directory Structure After Setup

```
your-project/
├── cursor-navigator.config.js    # Configuration
├── cursor-app-map/               # Generated output
│   ├── screenshots/              # Page screenshots
│   ├── app-map.json             # Complete data
│   ├── quick-map.json           # AI-friendly data
│   └── README.md                # Human report
├── package.json                 # Updated with scripts
└── ...
```

## 🔧 Commands

```bash
# Initialize (one-time setup)
npx cursor-navigator init

# Generate app map
npm run cursor:map
# or
npx cursor-navigator run

# Install browsers
npm run cursor:install
# or 
npx cursor-navigator install

# Detect framework
npx cursor-navigator detect

# Custom configurations
npx cursor-navigator run --port 5173 --no-headless
npx cursor-navigator run --parallel --output custom-dir
```

## 🔗 Integration with Existing Workflows

### GitHub Actions

```yaml
# .github/workflows/cursor-map.yml
name: Generate Cursor Map
on: [push, pull_request]

jobs:
  generate-map:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run cursor:install
      - run: npm run build
      - run: npm run dev &
      - run: sleep 10
      - run: npm run cursor:map
      - uses: actions/upload-artifact@v3
        with:
          name: cursor-app-map
          path: cursor-app-map/
```

### Pre-commit Hook

```bash
# Install husky
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run cursor:map"
```

### NPM Scripts

```json
{
  "scripts": {
    "dev": "your-dev-command",
    "build": "your-build-command",
    "cursor:map": "cursor-navigator run",
    "cursor:install": "cursor-navigator install",
    "cursor:visual": "cursor-navigator run --no-headless",
    "cursor:fast": "cursor-navigator run --parallel"
  }
}
```

## 🎨 Customization

### Custom Selectors

```javascript
// cursor-navigator.config.js
module.exports = {
  customSelectors: [
    '[data-cy]',           // Cypress test selectors
    '[data-testid]',       // Testing Library selectors
    '.interactive',        // Custom CSS classes
    'button:not(.disabled)', // Complex selectors
    '[role="button"]'      // ARIA roles
  ]
};
```

### Route Filtering

```javascript
// cursor-navigator.config.js
module.exports = {
  // Only include specific routes
  includeRoutes: [
    '/',
    '/products.*',
    '/about'
  ],
  
  // Exclude specific routes
  excludeRoutes: [
    '/admin.*',
    '/api/.*',
    '.*\\.json',
    '/debug.*'
  ]
};
```

### Framework-Specific Options

```javascript
// For SvelteKit
module.exports = {
  framework: 'sveltekit',
  sveltekit: {
    routesDir: 'src/routes',    // Custom routes directory
    analyzeStores: true,        // Analyze Svelte stores
    includeComponents: true     // Include component analysis
  }
};

// For Next.js
module.exports = {
  framework: 'nextjs',
  nextjs: {
    appDir: 'app',             // App router directory
    pagesDir: 'pages',         // Pages router directory
    analyzeApi: false,         // Skip API routes
    includeMiddleware: true    // Include middleware analysis
  }
};
```

## 🐛 Troubleshooting

### Common Issues

**1. "Framework not detected"**
```bash
# Force framework detection
npx cursor-navigator init --framework sveltekit
```

**2. "Port already in use"**
```bash
# Specify different port
npx cursor-navigator run --port 3001
```

**3. "Playwright browsers not found"**
```bash
# Install browsers manually
npx playwright install chromium
```

**4. "Routes not discovered"**
```bash
# Check if dev server is running
curl http://localhost:3000

# Use verbose mode for debugging
npx cursor-navigator run --verbose
```

**5. "Screenshots are blank"**
```bash
# Increase timeout
npx cursor-navigator run --timeout 10000

# Run in visible mode to debug
npx cursor-navigator run --no-headless
```

### Debug Mode

```bash
# Run with debugging
DEBUG=cursor-navigator npx cursor-navigator run

# Verbose logging
npx cursor-navigator run --verbose

# Save browser logs
npx cursor-navigator run --save-logs
```

## 📚 Examples

Check the `/examples` directory for complete project examples:

- [SvelteKit Example](examples/sveltekit/)
- [Next.js Example](examples/nextjs/)
- [React Example](examples/react/)
- [Vue Example](examples/vue/)

## 🆘 Getting Help

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/cursor-ai/navigator/issues)
- 💬 [Ask Questions](https://github.com/cursor-ai/navigator/discussions)
- 📧 [Email Support](mailto:support@cursor-ai.com) 