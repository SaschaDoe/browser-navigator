# User Manual - Cursor AI Auto-Navigation System

## 📚 Table of Contents

1. [Quick Start Guide](#-quick-start-guide)
2. [System Overview](#-system-overview)
3. [Installation & Setup](#-installation--setup)
4. [Basic Usage](#-basic-usage)
5. [Advanced Features](#-advanced-features)
6. [Understanding Output](#-understanding-output)
7. [Troubleshooting](#-troubleshooting)
8. [Best Practices](#-best-practices)
9. [FAQ](#-faq)
10. [Support](#-support)

---

## 🚀 Quick Start Guide

### **In 30 Seconds**

1. **Ensure your dev server is running:**
   ```bash
   npm run dev
   ```

2. **Generate app map for Cursor AI:**
   ```bash
   npm run cursor:map
   ```

3. **Check results:**
   - Screenshots: `cursor-app-map/screenshots/`
   - Report: `cursor-app-map/README.md`
   - Data: `cursor-app-map/app-map.json`

**That's it!** Cursor AI now has complete visual understanding of your app.

---

## 🎯 System Overview

### **What Does This System Do?**

The Cursor AI Auto-Navigation System automatically:

- 🔍 **Discovers all routes** in your SvelteKit application
- 📸 **Captures full-page screenshots** of every page
- 🎯 **Maps interactive elements** with precise pixel coordinates
- ⚡ **Measures performance** (load times, Core Web Vitals)
- 📊 **Generates comprehensive reports** for AI consumption
- 🧠 **Enables smarter AI assistance** with visual context

### **Why Use This System?**

#### **For Developers**
- **Faster Development**: AI assistants understand your app visually
- **Better Code Suggestions**: AI knows exact element locations
- **Performance Tracking**: Monitor app performance over time
- **Visual Documentation**: Automatic app screenshots

#### **For AI Assistants (Cursor)**
- **Visual Context**: See exactly how the app looks
- **Element Mapping**: Know precise locations of buttons, forms, links
- **Performance Data**: Understand app speed and responsiveness
- **Structure Understanding**: Navigate app architecture intelligently

---

## 🛠️ Installation & Setup

### **Prerequisites**

Before using the system, ensure you have:

- ✅ **Node.js** 18.0.0 or higher
- ✅ **NPM** 8.0.0 or higher
- ✅ **SvelteKit project** (this system is integrated)
- ✅ **4GB RAM** minimum (8GB recommended)
- ✅ **2GB free disk space** (for browsers and screenshots)

### **First-Time Setup**

The system is already integrated into your project, but if browsers aren't installed:

```bash
# Install Playwright browsers (one-time setup)
npx playwright install
```

### **Verify Installation**

```bash
# Check if everything is working
npm run cursor:map:test
```

If this runs without errors, you're ready to go!

---

## 📖 Basic Usage

### **Main Commands**

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run cursor:map` | Full app mapping | Before/after feature development |
| `npm run cursor:map:test` | Test only (manual) | When dev server is already running |
| `npm run cursor:map:manual` | Start server only | For manual testing |

### **Typical Workflow**

#### **1. Before Implementing a Feature**
```bash
# Start dev server
npm run dev

# Generate current app state
npm run cursor:map
```

**Result**: Cursor AI now knows your app's current state

#### **2. Implement Your Feature**
```svelte
<!-- Make your changes in Svelte files -->
<button on:click={handleClick}>New Feature</button>
```

#### **3. After Implementation**
```bash
# Regenerate app map to see changes
npm run cursor:map
```

**Result**: Compare before/after to see impact

### **Output Structure**

After running `npm run cursor:map`, you'll find:

```
cursor-app-map/
├── app-map.json           # Structured data for AI
├── README.md              # Human-readable report
└── screenshots/
    ├── __[timestamp].png       # Home page screenshot
    ├── _about_[timestamp].png  # About page screenshot
    └── _contact_[timestamp].png # Contact page screenshot
```

---

## 🔧 Advanced Features

### **Custom Configuration**

#### **Modify Routes to Capture**

Edit `e2e/auto-navigator.spec.ts`:

```typescript
async discoverRoutes(): Promise<string[]> {
  const routes = [
    '/',
    '/about',
    '/contact',
    '/custom-route',  // Add your custom routes
    '/admin/dashboard'
  ];
  // ... rest of the method
}
```

#### **Screenshot Options**

Customize screenshot capture:

```typescript
await this.page.screenshot({ 
  path: screenshotPath, 
  fullPage: true,           // Capture entire page
  type: 'png',              // Format: png, jpeg, webp
  quality: 90,              // Quality for jpeg/webp (0-100)
  animations: 'disabled'    // Disable animations
});
```

#### **Element Selectors**

Add custom element types to track:

```typescript
const selectors = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[data-testid]',          // Add test IDs
  '.custom-interactive',    // Add custom classes
  'form'
];
```

### **Environment Configuration**

#### **Different Ports**

The system auto-detects your dev server port, but you can override:

```bash
# Set custom base URL
BASE_URL=http://localhost:3000 npm run cursor:map
```

#### **Headless vs. Headed Mode**

For debugging, run in headed mode:

```typescript
// In playwright.config.dev.ts
use: {
  headless: false,  // Show browser window
  slowMo: 1000     // Slow down actions
}
```

### **Performance Tuning**

#### **Faster Execution**

```typescript
// Reduce wait times for faster execution
await this.page.goto(fullUrl, { 
  waitUntil: 'domcontentloaded',  // Don't wait for all resources
  timeout: 10000                  // Shorter timeout
});

await this.page.waitForTimeout(500); // Reduced wait time
```

#### **Higher Quality Screenshots**

```typescript
await this.page.screenshot({ 
  path: screenshotPath, 
  fullPage: true,
  type: 'png',
  clip: undefined,        // No clipping
  animations: 'allow'     // Include animations
});
```

---

## 📊 Understanding Output

### **JSON Data Structure**

The `app-map.json` file contains structured data:

```json
{
  "routes": [
    {
      "url": "/",
      "title": "Home Page",
      "screenshot": "path/to/screenshot.png",
      "elements": [
        {
          "selector": "button:nth-of-type(1)",
          "type": "button",
          "text": "Click Me",
          "visible": true,
          "position": { "x": 100, "y": 200, "width": 80, "height": 32 }
        }
      ],
      "performance": {
        "loadTime": 1234,
        "firstContentfulPaint": 500
      },
      "errors": [],
      "timestamp": 1640995200000
    }
  ],
  "summary": {
    "totalRoutes": 3,
    "totalElements": 19,
    "averageLoadTime": 1500
  }
}
```

### **Markdown Report**

The `README.md` file provides human-readable insights:

- **Route Overview**: List of all captured pages
- **Performance Metrics**: Load times and vitals
- **Element Summary**: Count of interactive elements
- **Development Insights**: Recommendations and observations

### **Screenshots**

Screenshot files are named with timestamps:
- `__[timestamp].png` = Home page (`/`)
- `_about_[timestamp].png` = About page (`/about`)
- `_contact_[timestamp].png` = Contact page (`/contact`)

### **Element Position Data**

Each interactive element includes:
- **Selector**: CSS selector to target the element
- **Type**: HTML element type (`button`, `a`, `input`, etc.)
- **Text**: Visible text content
- **Position**: Exact pixel coordinates and dimensions
- **Visibility**: Whether element is currently visible

---

## 🔍 Troubleshooting

### **Common Issues**

#### **❌ "Executable doesn't exist" Error**

**Problem**: Playwright browsers not installed

**Solution**:
```bash
npx playwright install
```

#### **❌ "Command failed with code 1"**

**Problem**: Test execution failed

**Solutions**:
1. Check if dev server is running
2. Verify port number (should auto-detect)
3. Check browser console for errors

#### **❌ "ECONNREFUSED" Error**

**Problem**: Cannot connect to dev server

**Solutions**:
```bash
# Start dev server first
npm run dev

# Then run in another terminal
npm run cursor:map
```

#### **❌ Screenshots are blank/black**

**Problem**: Page not fully loaded

**Solutions**:
1. Increase wait time:
   ```typescript
   await this.page.waitForTimeout(2000); // Wait longer
   ```
2. Wait for specific elements:
   ```typescript
   await this.page.waitForSelector('main'); // Wait for main content
   ```

#### **❌ "Permission denied" writing files**

**Problem**: Insufficient file system permissions

**Solutions**:
1. Check folder permissions on `cursor-app-map/`
2. Run with elevated permissions (if necessary)
3. Ensure disk space is available

### **Debugging Mode**

#### **Enable Verbose Logging**

```bash
# Run with debug output
DEBUG=pw:* npm run cursor:map
```

#### **Keep Browser Open**

Modify `playwright.config.dev.ts`:
```typescript
use: {
  headless: false,  // Show browser
  slowMo: 1000     // Slow down actions
}
```

#### **Save Debug Screenshots**

Add debug screenshots to your test:
```typescript
// Take screenshot at specific points
await this.page.screenshot({ 
  path: `debug-${Date.now()}.png`,
  fullPage: true 
});
```

### **Performance Issues**

#### **Slow Execution**

**Causes & Solutions**:
- **Large pages**: Reduce screenshot quality or size
- **Slow server**: Optimize your dev server
- **Memory issues**: Close other applications
- **Network latency**: Ensure local development

#### **High Memory Usage**

**Solutions**:
- Restart browser between routes
- Reduce concurrent operations
- Clear screenshots periodically
- Monitor system resources

---

## ✅ Best Practices

### **Development Workflow**

#### **1. Regular Mapping**
```bash
# Before major changes
npm run cursor:map

# After feature implementation
npm run cursor:map

# Compare results to understand impact
```

#### **2. Clean Setup**
```bash
# Ensure clean state
rm -rf cursor-app-map/
npm run dev
npm run cursor:map
```

#### **3. Version Control**
```gitignore
# Add to .gitignore
cursor-app-map/
```

Keep generated files out of version control as they change frequently.

### **AI Integration**

#### **1. Context Preparation**
Before asking Cursor AI for help:
```bash
npm run cursor:map
```
Then reference: "Check the cursor-app-map/ for current app state"

#### **2. Feature Development**
```bash
# 1. Map current state
npm run cursor:map

# 2. Describe desired changes to AI
# "Add a login form to the home page, similar to the contact form"

# 3. AI can reference exact element positions and styling
```

#### **3. Bug Fixing**
```bash
# Generate map showing current issue
npm run cursor:map

# Share screenshot and element data with AI
# AI can see exactly what's wrong
```

### **Performance Optimization**

#### **1. Selective Route Mapping**
Only map routes you're actively working on:
```typescript
// In discoverRoutes(), temporarily limit routes
const routes = ['/specific-route']; // Only map this route
```

#### **2. Cleanup Old Data**
```bash
# Periodically clean old screenshots
rm -rf cursor-app-map/screenshots/*
```

#### **3. Monitor System Resources**
- Watch memory usage during execution
- Close unnecessary applications
- Ensure sufficient disk space

### **Quality Assurance**

#### **1. Verify Screenshots**
Always check that screenshots captured correctly:
- Look for blank/black images
- Verify all content is visible
- Check responsive elements

#### **2. Validate Element Data**
Review `app-map.json` for:
- Correct element counts
- Accurate positioning data
- Proper text extraction

#### **3. Performance Monitoring**
Track performance over time:
- Monitor load time trends
- Identify performance regressions
- Set performance budgets

---

## ❓ FAQ

### **General Questions**

**Q: How often should I run the app mapping?**

A: Run before and after significant changes. For active development, daily mapping provides good AI context.

**Q: Can I run this on production?**

A: This is designed for development only. Don't run against production servers.

**Q: Does this work with other frameworks?**

A: Currently optimized for SvelteKit, but the core concepts work with any web application.

### **Technical Questions**

**Q: Why are my screenshots blank?**

A: Usually a timing issue. The page hasn't fully loaded. Increase wait times or wait for specific elements.

**Q: Can I capture mobile views?**

A: Yes! Modify the viewport in Playwright config:
```typescript
use: {
  viewport: { width: 375, height: 667 } // iPhone size
}
```

**Q: How do I add authentication?**

A: Add login steps before route discovery:
```typescript
// In the test, login first
await page.goto('/login');
await page.fill('[name="username"]', 'testuser');
await page.fill('[name="password"]', 'testpass');
await page.click('button[type="submit"]');
```

**Q: Can I exclude certain routes?**

A: Yes, filter them in `discoverRoutes()`:
```typescript
const routes = allRoutes.filter(route => 
  !route.startsWith('/admin') && 
  !route.includes('/private')
);
```

### **AI Integration Questions**

**Q: How does Cursor AI use this data?**

A: Cursor can reference screenshots to understand visual layout and use element position data for more accurate code suggestions.

**Q: Should I commit the generated files?**

A: No, add `cursor-app-map/` to `.gitignore`. These files are meant to be generated fresh.

**Q: Can other AI assistants use this?**

A: Yes! The JSON data format is universal and can be consumed by any AI system.

---

## 🆘 Support

### **Getting Help**

#### **1. Check the Logs**
Most issues show helpful error messages in the console output.

#### **2. Review Generated Files**
Check if files were created in `cursor-app-map/` to diagnose where the process failed.

#### **3. Debug Mode**
Run with debug flags:
```bash
DEBUG=pw:* npm run cursor:map
```

#### **4. Manual Testing**
Test components individually:
```bash
# Test just the Playwright test
npm run cursor:map:test

# Test just the server
npm run cursor:map:manual
```

### **Common Solutions**

| Problem | Quick Fix |
|---------|-----------|
| Browser errors | `npx playwright install` |
| Port issues | Check dev server is running |
| Permission errors | Check file/folder permissions |
| Blank screenshots | Increase wait times |
| Memory issues | Restart system, close apps |

### **Reporting Issues**

When reporting problems, include:
1. **Command used**: What command you ran
2. **Error message**: Full error output
3. **Environment**: OS, Node.js version, browser
4. **Screenshots**: If visual issues
5. **Generated files**: Contents of `cursor-app-map/` if created

### **System Requirements Reminder**

- **Node.js**: 18.0.0+
- **Memory**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Internet access for browser downloads
- **Permissions**: Read/write access to project directory

---

## 🔄 Version History

### **v1.0.0** (Current)
- ✅ Route auto-discovery
- ✅ Full-page screenshot capture
- ✅ Interactive element mapping
- ✅ Performance metrics
- ✅ JSON/Markdown output
- ✅ Error handling & resilience
- ✅ ES Module support

### **Planned Features**
- 🔄 Multi-browser support (Firefox, Safari)
- 🔄 Responsive screenshots (mobile, tablet)
- 🔄 Accessibility analysis
- 🔄 Visual regression detection
- 🔄 Performance budgets & alerts

---

*This manual is updated regularly. Check back for new features and improvements!*

---

## 📞 Quick Reference

### **Essential Commands**
```bash
npm run cursor:map        # Full app mapping
npm run dev              # Start development server
npx playwright install   # Install browsers (one-time)
```

### **Key Files**
- `cursor-app-map/README.md` - Human-readable report
- `cursor-app-map/app-map.json` - AI-consumable data
- `cursor-app-map/screenshots/` - Visual captures
- `e2e/auto-navigator.spec.ts` - Main system code

### **Troubleshooting Checklist**
- [ ] Dev server running?
- [ ] Browsers installed?
- [ ] Sufficient disk space?
- [ ] Correct file permissions?
- [ ] No firewall blocking?

**Remember**: This system makes Cursor AI much smarter about your app. Use it regularly for the best AI-assisted development experience! 🚀
