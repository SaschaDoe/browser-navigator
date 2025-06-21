# 📦 Publishing Guide: Cursor AI Navigator

This guide will help you publish the `@cursor-ai/navigator` package to npm.

## 🚀 Pre-Publication Checklist

### 1. Package Configuration ✅
- [x] Proper package name: `@cursor-ai/navigator`
- [x] Correct version: `1.0.0`
- [x] Main entry point: `dist/index.js`
- [x] TypeScript types: `dist/index.d.ts`
- [x] CLI binaries configured
- [x] Dependencies properly listed
- [x] Files array specified (only ships necessary files)

### 2. Required Files ✅
- [x] `package.json` - Package configuration
- [x] `README.md` - Documentation
- [x] `LICENSE` - MIT License
- [x] `.npmignore` - Exclude development files
- [x] `dist/` - Built JavaScript files
- [x] `bin/` - CLI executables

### 3. Build Process ✅
- [x] TypeScript compilation configured
- [x] Build script: `npm run build`
- [x] Automatic build on `prepare` and `prepack`

## 📝 Publication Steps

### Step 1: Update Repository URLs
Before publishing, update the repository URLs in `cursor-ai-navigator/package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/cursor-navigator-testbed.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/cursor-navigator-testbed/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/cursor-navigator-testbed#readme"
}
```

### Step 2: Test the Package (Recommended)
```bash
# From the root directory, run:
npm run publish:dry-run      # See what files will be included
npm run publish:check        # Test publish without actually publishing
```

### Step 3: Create npm Account
If you don't have an npm account:
1. Go to [npmjs.com](https://npmjs.com)
2. Sign up for a free account
3. Verify your email address

### Step 4: Login to npm
```bash
npm login
```
Enter your npm credentials (username, password, email).

### Step 5: Check Package Name Availability
```bash
npm search @cursor-ai/navigator
```
If the name is already taken, you'll need to choose a different name.

### Step 6: Publish the Package
```bash
# From the root directory (recommended):
npm run publish:navigator

# OR manually:
cd cursor-ai-navigator
npm run build
npm publish --access public
```

**Note:** Since this is a scoped package (`@cursor-ai/navigator`), you need the `--access public` flag to make it publicly available.

**Important:** Only the `cursor-ai-navigator/` directory gets published, NOT the root testbed application.

## 🔄 Publishing Updates

For future updates:

### Patch Version (1.0.0 → 1.0.1)
```bash
npm version patch
npm publish
```

### Minor Version (1.0.0 → 1.1.0)
```bash
npm version minor
npm publish
```

### Major Version (1.0.0 → 2.0.0)
```bash
npm version major
npm publish
```

## 🛠️ Package Scripts Available

From the root directory:
```bash
# Install all dependencies
npm run install:all

# Build the library
npm run build:lib

# Publish the navigator package
npm run publish:navigator
```

## 📊 Package Contents

When published, the package will include:
- `dist/` - Compiled JavaScript and TypeScript definitions
- `bin/` - CLI executables
- `README.md` - Documentation  
- `LICENSE` - MIT license
- `package.json` - Package metadata

## 🎯 Usage After Publication

Once published, users can install and use the package:

```bash
# Install the package
npm install --save-dev @cursor-ai/navigator

# Use CLI
npx cursor-navigator init
npx cursor-nav run

# Use programmatically
import { createNavigator } from '@cursor-ai/navigator';
```

## 🔍 Verification

After publishing, verify the package:

1. Check on npmjs.com: `https://www.npmjs.com/package/@cursor-ai/navigator`
2. Install in a test project: `npm install @cursor-ai/navigator`
3. Test the CLI: `npx cursor-navigator --help`
4. Test programmatic usage

## ⚠️ Important Notes

1. **Package Name**: The name `@cursor-ai/navigator` must be available on npm
2. **Scoped Package**: Requires `--access public` for public publishing
3. **Version Control**: Use semantic versioning (SemVer)
4. **Repository**: Update GitHub URLs to match your actual repository
5. **Build Before Publish**: Always run `npm run build` before publishing
6. **Test Locally**: Use `npm pack` and `npm link` to test before publishing

## 🚨 Troubleshooting

### "Package name already exists"
- Choose a different name (e.g., `@your-username/cursor-navigator`)
- Update all references in package.json and documentation

### "Access denied"
- Make sure you're logged in: `npm whoami`
- For scoped packages, use: `npm publish --access public`

### "Build fails"
- Run `npm run build` and fix any TypeScript errors
- Check all dependencies are installed

### "CLI commands not working"
- Verify `bin` field in package.json
- Check file permissions on executable files
- Test with `npm link` locally first

## 🎉 Success!

Once published, your package will be available globally at:
- **npm**: `https://www.npmjs.com/package/@cursor-ai/navigator`
- **Install**: `npm install @cursor-ai/navigator`
- **CLI**: `npx cursor-navigator`

Happy publishing! 🚀 