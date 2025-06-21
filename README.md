# 🧪 Cursor Navigator Testbed

> **Development and testing environment for the `@cursor-ai/navigator` npm package**

This repository contains a SvelteKit application used for developing, testing, and demonstrating the **Cursor AI Navigator** library. The actual npm package is located in the `cursor-ai-navigator/` directory.

## 📦 What Gets Published

**ONLY** the `cursor-ai-navigator/` directory gets published to npm as `@cursor-ai/navigator`.

The SvelteKit app in the root is just for:
- 🧪 **Testing** the navigator library
- 🔧 **Development** and debugging
- 📋 **Example** implementation
- ✅ **CI/CD** validation

## 🚀 Quick Start

### Development
```bash
npm run install:all  # Install all dependencies
npm run dev          # Start SvelteKit test app
npm run cursor:map   # Test the navigator on this app
```

### Publishing the Package
```bash
# Check what will be published
npm run publish:dry-run

# Test publish without actually publishing
npm run publish:check

# Actually publish to npm
npm run publish:navigator
```

## 📁 Project Structure

```
cursor-navigator-testbed/           # ← This testbed (NOT published)
├── src/routes/                    # SvelteKit test app
├── e2e/                          # Integration tests
├── cursor-app-map/               # Generated maps (for testing)
└── cursor-ai-navigator/          # ← THE ACTUAL NPM PACKAGE
    ├── src/                      # Library source code
    ├── dist/                     # Built JavaScript
    ├── package.json              # Package config
    └── README.md                 # Package documentation
```

## 🎯 The Actual Package: `@cursor-ai/navigator`

The published package is a **framework-agnostic TypeScript library** that works with:
- ✅ SvelteKit, Next.js, Nuxt, Vue, React, Angular
- ✅ Any web framework or plain HTML
- ✅ CLI tools for automation
- ✅ Playwright-powered browser automation

### Usage (after publication):
```bash
npm install --save-dev @cursor-ai/navigator
npx cursor-navigator init
```

```typescript
import { createNavigator } from '@cursor-ai/navigator';
const navigator = await createNavigator('sveltekit', './', options);
```

## ✨ Features

- 🗺️ **Automated Route Discovery** - Framework-aware route detection
- 📸 **Visual Screenshots** - Full-page captures with element mapping  
- 🎯 **Interactive Element Analysis** - Buttons, links, forms with precise positioning
- ⚡ **Performance Monitoring** - Load times, FCP, LCP, CLS tracking
- 🧩 **Component Analysis** - Framework-specific component discovery
- 📊 **AI-Optimized Reports** - JSON + Markdown outputs for AI consumption
- 🚀 **Multi-Framework Support** - SvelteKit, Next.js, Vue, React, and more

## 🚀 Quick Start

### Installation

```bash
npm install
npm run install:all  # Install all dependencies including cursor-navigator
```

### Basic Usage

```typescript
import { createSvelteKitNavigator } from '$lib';
import { test } from '@playwright/test';

test('Generate app map', async ({ page }) => {
  const navigator = createSvelteKitNavigator(page, {
    baseUrl: 'http://localhost:5173',
    outputDir: 'cursor-app-map'
  });
  
  await navigator.initialize();
  const appMap = await navigator.generateAppMap();
  
  console.log(`Mapped ${appMap.routes.length} routes!`);
});
```

## 📁 Project Structure

```
├── src/                          # SvelteKit demo application
│   ├── lib/index.ts             # Consolidated exports
│   └── routes/                  # Demo pages
├── cursor-ai-navigator/         # Core navigation library
│   ├── src/
│   │   ├── core/               # Main CursorNavigator class
│   │   ├── adapters/           # Framework-specific adapters
│   │   ├── types/              # TypeScript definitions
│   │   └── utils/              # Helper utilities
│   └── dist/                   # Built library
├── e2e/                        # Integration tests
└── cursor-app-map/             # Generated output
```

## 🛠️ Development Scripts

```bash
# Development
npm run dev                     # Start dev server
npm run build                   # Build everything (lib + app)
npm run build:lib              # Build navigator library only

# Testing
npm run test                    # Run all tests
npm run test:unit              # Unit tests only
npm run test:e2e               # E2E tests only  
npm run test:unit:ui           # Visual test runner

# Cursor AI Integration
npm run cursor:map             # Generate complete app map
npm run cursor:map:test        # Test map generation
```

## 🎯 Use Cases

### For AI Assistants (Cursor)
- **Visual Context**: Screenshots provide visual understanding of each page
- **Element Discovery**: Precise coordinates and properties of interactive elements
- **Performance Insights**: Identify slow pages and optimization opportunities
- **Component Mapping**: Understand app structure and component usage

### For Developers
- **Automated Testing**: Generate comprehensive test coverage maps
- **Performance Monitoring**: Track metrics across all routes
- **Documentation**: Auto-generated visual documentation
- **Debugging**: Visual debugging of complex applications

## 📊 Output Examples

### App Map JSON
```json
{
  "framework": "sveltekit",
  "routes": [
    {
      "url": "/",
      "title": "Home Page",
      "screenshot": "cursor-app-map/screenshots/home_1234567890.png",
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
        "loadTime": 856,
        "firstContentfulPaint": 234,
        "largestContentfulPaint": 456
      }
    }
  ],
  "summary": {
    "totalRoutes": 3,
    "successfulCaptures": 3,
    "totalElements": 24,
    "averageLoadTime": 1200,
    "performanceScore": 87
  }
}
```

### Generated README
The system generates a comprehensive Markdown report with:
- Visual screenshots of each page
- Interactive element inventory
- Performance analysis
- Framework-specific insights
- Cursor AI integration notes

## 🏗️ Architecture

### Adapter Pattern
Framework-specific adapters handle:
- Route discovery methods
- Navigation patterns
- Component analysis
- Build system integration

### Type Safety
Full TypeScript support with comprehensive interfaces:
- `NavigationResult` - Complete page capture data
- `ElementInfo` - Interactive element metadata  
- `PerformanceMetrics` - Performance timing data
- `AppMap` - Complete application map structure

### Performance First
- Configurable performance thresholds
- Automatic violation detection
- Performance scoring algorithm
- CI/CD friendly timeouts

## 🚧 Current Status

### ✅ Implemented
- Core navigation and capture system
- SvelteKit adapter with file-based route discovery
- Visual screenshot generation
- Interactive element analysis
- Performance metrics collection
- Comprehensive test coverage
- AI-optimized report generation

### 🔄 In Progress
- Enhanced error handling and retry logic
- Performance optimization recommendations
- Component dependency analysis

### 📋 Roadmap
- Next.js, Vue, React adapter improvements
- Visual diff tracking for changes
- AI-powered accessibility analysis
- Integration with popular CI/CD systems

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow testing best practices (see test files for examples)
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open Pull Request

### Testing Guidelines
- Follow AAA pattern (Arrange, Act, Assert)
- One assertion per test
- Descriptive test names: `should [behavior] when [condition]`
- Use proper test categories: `unit`, `integration`, `UI`

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built for the future of AI-assisted development** 🚀
