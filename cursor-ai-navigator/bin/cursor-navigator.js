#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const { promises: fs } = require('fs');

// Import the main CLI function
async function main() {
  try {
    // Dynamically import ES module
    const { runCLI } = await import('../dist/cli/index.js');
    await runCLI();
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('❌ Cursor Navigator not built. Please run: npm run build');
      process.exit(1);
    }
    console.error('❌ Error running Cursor Navigator:', error.message);
    process.exit(1);
  }
}

main(); 