import { spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(require('child_process').exec);

export async function installPlaywright(): Promise<void> {
  try {
    console.log('📦 Installing Playwright browsers...');
    
    // Try different installation methods
    await executePlaywrightInstall();
    
    console.log('✅ Playwright browsers installed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to install Playwright browsers:', error instanceof Error ? error.message : 'Unknown error');
    console.log('\n💡 Manual installation options:');
    console.log('  • Run: npx playwright install');
    console.log('  • Or: npx playwright install chromium');
    console.log('  • Or add playwright to your project: npm install --save-dev @playwright/test');
    
    throw error;
  }
}

async function executePlaywrightInstall(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Try to install browsers using npx playwright install
    const child = spawn('npx', ['playwright', 'install', 'chromium'], {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Playwright installation failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

export async function checkPlaywrightInstallation(): Promise<boolean> {
  try {
    // Try to import playwright to check if it's available
    await import('@playwright/test');
    return true;
  } catch {
    return false;
  }
}

export async function ensurePlaywrightInstalled(): Promise<void> {
  const isInstalled = await checkPlaywrightInstallation();
  
  if (!isInstalled) {
    console.log('⚠️ Playwright is not installed. Installing now...');
    await installPlaywright();
  } else {
    console.log('✅ Playwright is already installed');
  }
} 