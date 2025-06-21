#!/usr/bin/env node

/**
 * Quick test for Cursor AI Auto-Navigation
 * Uses the already running dev server
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function quickTest() {
  console.log('🚀 Quick Test - Cursor AI Auto-Navigation\n');
  
  try {
    console.log('🔍 Running Playwright test...');
    console.log('Using dev server at: http://localhost:5174\n');
    
    // Run the test with the dev config
    await runCommand('npx', [
      'playwright', 
      'test', 
      'e2e/auto-navigator.spec.ts',
      '--config=playwright.config.dev.ts',
      '--reporter=line'
    ]);
    
    console.log('\n✅ Test completed successfully!');
    
    // Check for generated files
    console.log('\n📁 Checking generated files...');
    const mapDir = path.join(__dirname, 'cursor-app-map');
    
    try {
      const files = await fs.readdir(mapDir);
      console.log('\n📋 Generated files:');
      files.forEach(file => console.log(`   📄 ${file}`));
      
      // Check screenshots
      try {
        const screenshotDir = path.join(mapDir, 'screenshots');
        const screenshots = await fs.readdir(screenshotDir);
        console.log(`\n📸 Screenshots (${screenshots.length}):`);
        screenshots.forEach(file => console.log(`   🖼️  ${file}`));
      } catch (error) {
        console.log('   ⚠️  No screenshots directory found');
      }
      
    } catch (error) {
      console.log('   ❌ cursor-app-map directory not found');
    }
    
    console.log('\n🎉 All done! Check cursor-app-map/ for results');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Make sure the dev server is running on http://localhost:5174');
    process.exit(1);
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, { 
      stdio: 'inherit', 
      shell: true 
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Run the test
quickTest().catch(console.error); 