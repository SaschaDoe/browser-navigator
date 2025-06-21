#!/usr/bin/env node

/**
 * Simple test runner for the Cursor AI auto-navigation system
 * This validates that the system works without complex shell commands
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

async function testCursorMap() {
  console.log('🚀 Testing Cursor AI Auto-Navigation System\n');
  
  try {
    // Step 1: Check if built files exist
    console.log('1. Checking build files...');
    const buildPath = path.join(__dirname, '.svelte-kit/output');
    try {
      await fs.access(buildPath);
      console.log('   ✅ Build files found');
    } catch (error) {
      console.log('   ⚠️  Build files not found. Running build...');
      await runCommand('npm', ['run', 'build']);
    }
    
    // Step 2: Start preview server
    console.log('\n2. Starting preview server...');
    const server = spawn('npm', ['run', 'preview'], {
      stdio: 'pipe',
      shell: true
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 3: Run Playwright test
    console.log('\n3. Running auto-navigation test...');
    await runCommand('npx', ['playwright', 'test', 'e2e/auto-navigator.spec.ts']);
    
    // Step 4: Check generated files
    console.log('\n4. Checking generated files...');
    const mapDir = path.join(__dirname, 'cursor-app-map');
    
    try {
      const files = await fs.readdir(mapDir);
      console.log('   ✅ Generated files:');
      files.forEach(file => console.log(`      - ${file}`));
      
      // Check for key files
      const expectedFiles = ['app-map.json', 'README.md'];
      for (const file of expectedFiles) {
        if (files.includes(file)) {
          console.log(`   ✅ ${file} generated successfully`);
        } else {
          console.log(`   ❌ ${file} missing`);
        }
      }
      
    } catch (error) {
      console.log('   ❌ cursor-app-map directory not found');
    }
    
    // Clean up
    server.kill();
    
    console.log('\n🎉 Test completed! Check the cursor-app-map directory for results.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
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
  });
}

// Run if called directly
if (require.main === module) {
  testCursorMap().catch(console.error);
}

module.exports = { testCursorMap }; 