#!/usr/bin/env node

/**
 * Demo script showing how to use Cursor Navigator programmatically
 * 
 * Usage:
 *   node examples/demo.js
 */

const { createNavigator, detectFramework, closeNavigator } = require('../dist/index.js');

async function runDemo() {
  console.log('🧭 Cursor Navigator Demo\n');
  
  try {
    // Step 1: Detect framework
    console.log('1️⃣ Detecting framework...');
    const framework = await detectFramework('./');
    console.log(`   Framework detected: ${framework}\n`);
    
    // Step 2: Create navigator
    console.log('2️⃣ Creating navigator...');
    const navigator = await createNavigator(framework, './', {
      baseUrl: 'http://localhost:3000',
      outputDir: 'demo-output',
      headless: true,
      parallel: false,
      viewport: { width: 1280, height: 720 }
    });
    console.log('   Navigator created successfully\n');
    
    // Step 3: Check if server is running
    console.log('3️⃣ Checking development server...');
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        console.log('   ✅ Server is running\n');
        
        // Step 4: Generate app map
        console.log('4️⃣ Generating app map...');
        const appMap = await navigator.generateAppMap();
        
        // Step 5: Show results
        console.log('🎉 Demo completed successfully!\n');
        console.log('📊 Results:');
        console.log(`   • Framework: ${appMap.framework}`);
        console.log(`   • Routes discovered: ${appMap.summary.totalRoutes}`);
        console.log(`   • Routes captured: ${appMap.summary.successfulCaptures}`);
        console.log(`   • Interactive elements: ${appMap.summary.totalElements}`);
        console.log(`   • Average load time: ${appMap.summary.averageLoadTime}ms`);
        console.log(`   • Performance score: ${appMap.summary.performanceScore}/100`);
        console.log(`   • Output directory: demo-output`);
        
        if (appMap.summary.totalErrors > 0) {
          console.log(`   ⚠️ Performance issues: ${appMap.summary.totalErrors}`);
        }
        
      } else {
        console.log('   ❌ Server returned error status');
        console.log('   💡 Make sure your dev server is running on http://localhost:3000');
      }
    } catch (error) {
      console.log('   ❌ Server is not running');
      console.log('   💡 Start your dev server first: npm run dev');
      console.log('   💡 Or specify a different port with: --port 5173');
    }
    
    // Cleanup
    await closeNavigator(navigator);
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const portArg = args.find(arg => arg.startsWith('--port='));
const port = portArg ? portArg.split('=')[1] : '3000';

// Run demo
runDemo().catch(console.error); 