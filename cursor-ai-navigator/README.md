# 🧭 Cursor AI Navigator

**Automated visual mapping and navigation system for AI assistants like Cursor**

Transform any web application into an AI-understandable visual map with screenshots, element positions, and performance metrics. Perfect for AI-assisted development workflows.

[![npm version](https://badge.fury.io/js/@cursor-ai%2Fnavigator.svg)](https://badge.fury.io/js/@cursor-ai%2Fnavigator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start (30 seconds)

```bash
# Install the framework
npm install --save-dev @cursor-ai/navigator

# Initialize in your project
npx cursor-navigator init

# Install browser dependencies
npm run cursor:install

# Generate your app map
npm run cursor:map
```

## ✨ Features

- 🔍 **Auto-Discovery**: Automatically finds all routes in your app
- 📸 **Visual Capture**: Takes full-page screenshots of every route
- 🎯 **Element Mapping**: Maps all interactive elements with pixel-perfect positioning
- ⚡ **Performance Monitoring**: Tracks load times and Core Web Vitals
- 🧠 **AI-Friendly Output**: Generates structured data for AI consumption
- 🌐 **Framework Agnostic**: Works with any web framework
- 🔧 **Zero Configuration**: Smart defaults with easy customization

## 🎯 Supported Frameworks

| Framework | Status | Route Discovery | Component Analysis |
|-----------|--------|-----------------|-------------------|
| **SvelteKit** | ✅ Full Support | File-based + Link-based | Props, Usage, Types |
| **Next.js** | ✅ Full Support | App/Pages Router | Props, Types, Imports |
| **Nuxt.js** | 🔄 In Progress | Link-based | Basic |
| **Vue.js** | 🔄 In Progress | Link-based | Basic |
| **React** | 🔄 In Progress | Link-based | Basic |  
| **Angular** | 🔄 In Progress | Link-based | Basic |
| **Any Framework** | ✅ Generic Support | Link-based | Pattern-based |

## 📖 Usage

### Basic Usage

```bash
# Initialize in your project
npx cursor-navigator init

# Run with your dev server
npm run dev &
npm run cursor:map
```

### Advanced Configuration

```javascript
// cursor-navigator.config.js
module.exports = {
  framework: 'sveltekit',
  baseUrl: 'http://localhost:5173',
  outputDir: 'cursor-app-map',
  headless: true,
  parallel: true,
  viewport: { width: 1280, height: 720 },
  excludeRoutes: ['/admin', '/api/*'],
  screenshotOptions: {
    type: 'png',
    quality: 90,
    fullPage: true
  },
  performanceThresholds: {
    loadTime: 5000,
    firstContentfulPaint: 2000,
    largestContentfulPaint: 4000
  }
};
```

### Programmatic Usage

```typescript
import { createNavigator, detectFramework } from '@cursor-ai/navigator';

// Auto-detect framework
const framework = await detectFramework('./');

// Create navigator
const navigator = await createNavigator(framework, './', {
  baseUrl: 'http://localhost:3000',
  headless: true
});

// Generate app map
const appMap = await navigator.generateAppMap();

console.log(`Mapped ${appMap.routes.length} routes!`);
```

## 🔧 CLI Commands

```bash
# Initialize configuration
cursor-navigator init

# Run navigation
cursor-navigator run

# Install Playwright browsers
cursor-navigator install

# Detect project framework
cursor-navigator detect

# Get help
cursor-navigator --help
```

## 📊 Output Structure

```
cursor-app-map/
├── screenshots/           # PNG screenshots of each route
│   ├── home_123456.png
│   ├── about_123456.png
│   └── contact_123456.png
├── app-map.json          # Complete structured data
├── quick-map.json        # Simplified for AI consumption
└── README.md             # Human-readable report
```

### Example Output Data

```json
{
  "routes": [
    {
      "url": "/",
      "title": "Home Page",
      "screenshot": "screenshots/home_123456.png",
      "elements": [
        {
          "selector": "button:nth-of-type(1)",
          "type": "button",
          "text": "Get Started",
          "visible": true,
          "position": { "x": 100, "y": 200, "width": 120, "height": 40 }
        }
      ],
      "performance": {
        "loadTime": 1234,
        "firstContentfulPaint": 890,
        "largestContentfulPaint": 1100
      }
    }
  ],
  "summary": {
    "totalRoutes": 3,
    "successfulCaptures": 3,
    "totalElements": 15,
    "averageLoadTime": 1456,
    "performanceScore": 92
  }
}
```

## 🧠 AI Integration

The generated app map provides Cursor AI with:

- **Visual Context**: Screenshots show exactly what each page looks like
- **Interactive Elements**: Precise positions for automated interactions
- **Performance Data**: Identify slow pages and optimization opportunities
- **Component Structure**: Understanding of your app's architecture
- **Navigation Paths**: Clear mapping of user journey flows

## 🔌 Framework Integration

### SvelteKit

```bash
# Auto-detects SvelteKit projects
cursor-navigator init --framework sveltekit
```

Features:
- File-based route discovery from `src/routes`
- Component prop analysis (`export let`)
- Layout and page type detection

### Next.js

```bash
# Supports both App and Pages Router
cursor-navigator init --framework nextjs
```

Features:
- App Router (`app/`) and Pages Router (`pages/`) support
- Dynamic route parameter handling
- TypeScript interface prop detection

### Generic/Other Frameworks

```bash
# Works with any web framework
cursor-navigator init --framework generic
```

Features:
- Link-based route discovery
- Pattern-based component analysis
- Configurable element selectors

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `framework` | string | 'generic' | Target framework type |
| `baseUrl` | string | 'http://localhost:3000' | Dev server URL |
| `outputDir` | string | 'cursor-app-map' | Output directory |
| `headless` | boolean | true | Run browser in headless mode |
| `parallel` | boolean | false | Process routes in parallel |
| `viewport` | object | {width: 1280, height: 720} | Browser viewport size |
| `timeout` | number | 30000 | Navigation timeout (ms) |
| `retries` | number | 2 | Retry failed navigations |
| `excludeRoutes` | string[] | [] | Routes to skip (regex patterns) |
| `includeRoutes` | string[] | [] | Routes to include only |
| `customSelectors` | string[] | [] | Additional element selectors |
| `screenshotOptions` | object | See config | Screenshot settings |
| `performanceThresholds` | object | See config | Performance limits |

## 🚨 Troubleshooting

### Common Issues

**Browser Installation Failed**
```bash
# Manual installation
npx playwright install chromium
```

**Port Detection Issues**
```bash
# Specify port manually
cursor-navigator run --port 3000
```

**Framework Not Detected**
```bash
# Force framework type
cursor-navigator init --framework nextjs
```

**Dev Server Not Running**
```bash
# Start dev server first
npm run dev &
cursor-navigator run
```

### Performance Tips

- Use `parallel: true` for faster execution
- Exclude unnecessary routes with `excludeRoutes`
- Use `headless: true` for better performance
- Consider viewport size for mobile testing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/cursor-ai/navigator.git
cd navigator
npm install
npm run build
npm link

# Test in another project
cd ../my-test-project
npm link @cursor-ai/navigator
```

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) for browser automation
- [Commander.js](https://github.com/tj/commander.js/) for CLI interface
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) for interactive prompts

---

**Made with ❤️ for the AI development community**

[Report Issues](https://github.com/cursor-ai/navigator/issues) • [Request Features](https://github.com/cursor-ai/navigator/discussions) • [Documentation](https://github.com/cursor-ai/navigator/wiki) 