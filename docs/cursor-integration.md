# 🧠 Cursor AI Integration - Auto-Navigation & Screenshots

## Overview

This system allows Cursor AI to automatically navigate your SvelteKit web application, take screenshots, and generate a comprehensive visual map. This helps Cursor understand your app's current state when developing new features.

## 🚀 Quick Start

### Generate App Map for Cursor

```bash
# For production build (recommended)
npm run cursor:map

# For development server (faster, but less reliable)
npm run cursor:map:dev
```

### What Gets Generated

The system creates a `cursor-app-map/` directory with:

- **Screenshots**: Full-page screenshots of each route
- **app-map.json**: Structured data about your app
- **README.md**: Human-readable report for Cursor

## 📋 Generated Information

### Route Information
- **URL & Title**: Each page's URL and title
- **Screenshots**: Full-page visual captures
- **Interactive Elements**: Buttons, links, forms with positions
- **Performance Metrics**: Load times, Core Web Vitals
- **Error Detection**: JavaScript errors, console warnings

### Element Tracking
For each page, the system captures:
- All interactive elements (buttons, links, forms)
- Element positions and visibility
- Form fields and validation states
- Navigation patterns

## 🛠️ How It Works

### 1. Route Discovery
- Starts at the home page (`/`)
- Finds all internal links (`<a href="/...">`)
- Builds a map of your app's routes
- Handles dynamic routes (future enhancement)

### 2. Screenshot Capture
- Uses Playwright for reliable screenshots
- Captures full-page screenshots (including scrolled content)
- Saves as high-quality PNG files
- Includes mobile/desktop responsive views (future)

### 3. Element Analysis
- Identifies all interactive elements
- Records positions relative to viewport
- Captures element properties (text, attributes)
- Tracks visibility states

### 4. Performance Monitoring
- Measures page load times
- Captures Core Web Vitals when available
- Detects performance issues
- Tracks resource loading

## 📊 Cursor AI Benefits

When you run the app mapper, Cursor gains:

### Visual Understanding
- **Current UI State**: Screenshots show exactly how your app looks
- **Layout Patterns**: Understand spacing, colors, component arrangements
- **Responsive Design**: See how elements adapt to different screen sizes

### Interactive Elements
- **Button & Link Locations**: Know where interactive elements are positioned
- **Form Structure**: Understand form layouts and validation
- **Navigation Patterns**: See how users move through your app

### Development Context
- **Performance Baseline**: Know current load times before optimization
- **Error States**: Identify existing issues that need fixing
- **Component Usage**: See how components are used in practice

## 🔧 Configuration

### Playwright Configuration
The system uses two Playwright configs:

- `playwright.config.ts`: Production builds (port 4173)
- `playwright.config.dev.ts`: Development server (port 5173)

### Customizing Screenshots
Edit `e2e/auto-navigator.spec.ts` to customize:

```typescript
// Screenshot options
await this.page.screenshot({ 
  path: screenshotPath, 
  fullPage: true,        // Capture full page
  type: 'png',           // Format: png, jpeg, webp
  quality: 90            // Quality for jpeg/webp
});
```

### Adding More Routes
The system auto-discovers routes by following links. To ensure all routes are found:

1. **Add Navigation Links**: Include links to all important pages
2. **Manual Route List**: Edit the `discoverRoutes()` method
3. **Sitemap Integration**: Parse your sitemap.xml (future enhancement)

## 📝 Example Usage with Cursor

### Before Implementing a Feature
```bash
# Generate current app map
npm run cursor:map

# Cursor can now see:
# - Current layout and styling
# - Existing interactive elements
# - Performance characteristics
# - Areas that might need updates
```

### After Implementing a Feature
```bash
# Regenerate to see changes
npm run cursor:map

# Compare with previous version to see:
# - New UI elements
# - Layout changes
# - Performance impact
# - Any new errors
```

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill existing processes
npx kill-port 4173
npx kill-port 5173
```

**Screenshots Not Capturing**
- Ensure your app loads completely
- Check for JavaScript errors in console
- Verify network connectivity for external resources

**Missing Routes**
- Add navigation links to your pages
- Check that routes are publicly accessible
- Verify route file naming follows SvelteKit conventions

### Debug Mode
```bash
# Run with debug output
DEBUG=pw:* npm run cursor:map
```

## 🚀 Future Enhancements

### Planned Features
- **Component Analysis**: Detect and analyze Svelte components
- **State Tracking**: Monitor store/state changes
- **Accessibility Scanning**: WCAG compliance checking
- **SEO Analysis**: Meta tags, structured data validation
- **Network Monitoring**: API calls and performance
- **Multi-Browser Testing**: Chrome, Firefox, Safari screenshots
- **Responsive Screenshots**: Mobile, tablet, desktop views
- **A/B Testing Support**: Compare different UI versions

### Integration with Your Workflow
- **Git Hooks**: Auto-generate maps on commit
- **CI/CD Integration**: Generate maps in deployment pipeline
- **Design System**: Track component usage and consistency
- **Performance Monitoring**: Set up alerts for regression

## 💡 Tips for Cursor AI

### Best Practices
1. **Run Before Major Changes**: Generate fresh maps before implementing features
2. **Compare Screenshots**: Use diff tools to see visual changes
3. **Check Performance Impact**: Monitor load time changes
4. **Verify All Routes**: Ensure complete coverage of your app

### Understanding the Data
- **app-map.json**: Machine-readable data for analysis
- **README.md**: Human-readable summary for quick reference
- **Screenshots**: Visual reference for UI decisions

This system provides Cursor with comprehensive understanding of your application's current state, enabling more informed development decisions and better feature implementation. 