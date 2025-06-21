import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { promises as fs } from 'fs';
import { createNavigator } from '../utils/factory';
import { detectFramework } from '../utils/detector';
import { installPlaywright } from '../utils/installer';
import type { FrameworkType, NavigatorOptions } from '../types';

const program = new Command();

export async function runCLI() {
  program
    .name('cursor-navigator')
    .description('AI-powered visual navigation and mapping for web applications')
    .version('1.0.0');

  program
    .command('init')
    .description('Initialize Cursor Navigator in your project')
    .option('-f, --framework <framework>', 'Specify framework type')
    .option('-p, --port <port>', 'Specify dev server port', '3000')
    .option('-o, --output <output>', 'Specify output directory', 'cursor-app-map')
    .option('--force', 'Force initialization even if config exists')
    .action(async (options) => {
      await initCommand(options);
    });

  program
    .command('run')
    .description('Run the navigator to generate app map')
    .option('-c, --config <config>', 'Path to config file')
    .option('-p, --port <port>', 'Override dev server port')
    .option('-o, --output <output>', 'Override output directory')
    .option('--headless', 'Run in headless mode', true)
    .option('--no-headless', 'Run with visible browser')
    .option('--parallel', 'Process routes in parallel')
    .option('--verbose', 'Enable verbose logging')
    .action(async (options) => {
      await runCommand(options);
    });

  program
    .command('install')
    .description('Install required dependencies (Playwright browsers)')
    .action(async () => {
      await installCommand();
    });

  program
    .command('detect')
    .description('Detect project framework and configuration')
    .action(async () => {
      await detectCommand();
    });

  await program.parseAsync(process.argv);
}

async function initCommand(options: {
  framework?: string;
  port?: string;
  output?: string;
  force?: boolean;
}) {
  console.log(chalk.blue('🚀 Initializing Cursor Navigator...\n'));

  const projectRoot = process.cwd();
  const configPath = path.join(projectRoot, 'cursor-navigator.config.js');

  // Check if config already exists
  if (!options.force) {
    try {
      await fs.access(configPath);
      console.log(chalk.yellow('⚠️ Configuration file already exists!'));
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Do you want to overwrite the existing configuration?',
          default: false
        }
      ]);
      
      if (!overwrite) {
        console.log(chalk.gray('Initialization cancelled.'));
        return;
      }
    } catch {
      // Config doesn't exist, continue
    }
  }

  // Detect or prompt for framework
  let framework: FrameworkType = 'generic';
  
  if (options.framework) {
    framework = options.framework as FrameworkType;
  } else {
    console.log(chalk.blue('🔍 Detecting framework...'));
    const detected = await detectFramework(projectRoot);
    
    if (detected !== 'generic') {
      console.log(chalk.green(`✅ Detected: ${detected}`));
      const { useDetected } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useDetected',
          message: `Use detected framework (${detected})?`,
          default: true
        }
      ]);
      
      if (useDetected) {
        framework = detected;
      }
    }
    
    if (framework === 'generic') {
      const { selectedFramework } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedFramework',
          message: 'Select your framework:',
          choices: [
            { name: 'SvelteKit', value: 'sveltekit' },
            { name: 'Next.js', value: 'nextjs' },
            { name: 'Nuxt.js', value: 'nuxt' },
            { name: 'Vue.js', value: 'vue' },
            { name: 'React', value: 'react' },
            { name: 'Angular', value: 'angular' },
            { name: 'Generic/Other', value: 'generic' }
          ]
        }
      ]);
      framework = selectedFramework;
    }
  }

  // Prompt for additional configuration
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'port',
      message: 'Development server port:',
      default: options.port || '3000',
      validate: (input) => {
        const port = parseInt(input);
        if (isNaN(port) || port < 1 || port > 65535) {
          return 'Please enter a valid port number (1-65535)';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'output',
      message: 'Output directory:',
      default: options.output || 'cursor-app-map'
    },
    {
      type: 'confirm',
      name: 'headless',
      message: 'Run in headless mode by default?',
      default: true
    },
    {
      type: 'confirm',
      name: 'parallel',
      message: 'Process routes in parallel for faster execution?',
      default: true
    },
    {
      type: 'input',
      name: 'excludeRoutes',
      message: 'Routes to exclude (comma-separated regex patterns):',
      default: '',
      filter: (input) => input ? input.split(',').map((s: string) => s.trim()) : []
    }
  ]);

  // Generate configuration
  const config = {
    framework,
    baseUrl: `http://localhost:${answers.port}`,
    outputDir: answers.output,
    headless: answers.headless,
    parallel: answers.parallel,
    excludeRoutes: answers.excludeRoutes,
    viewport: { width: 1280, height: 720 },
    timeout: 30000,
    retries: 2,
    screenshotOptions: {
      type: 'png',
      quality: 90,
      fullPage: true,
      animations: 'disabled'
    },
    performanceThresholds: {
      loadTime: 5000,
      firstContentfulPaint: 2000,
      largestContentfulPaint: 4000,
      cumulativeLayoutShift: 0.1
    }
  };

  // Write configuration file
  const configContent = `module.exports = ${JSON.stringify(config, null, 2)};`;
  await fs.writeFile(configPath, configContent);

  // Update package.json scripts
  await updatePackageJson(projectRoot);

  console.log(chalk.green('\n✅ Cursor Navigator initialized successfully!'));
  console.log(chalk.blue('\nNext steps:'));
  console.log(chalk.gray('1. Install Playwright browsers: npm run cursor:install'));
  console.log(chalk.gray('2. Start your dev server: npm run dev'));
  console.log(chalk.gray('3. Generate app map: npm run cursor:map'));
  console.log(chalk.gray('\nConfiguration saved to: cursor-navigator.config.js'));
}

async function runCommand(options: {
  config?: string;
  port?: string;
  output?: string;
  headless?: boolean;
  parallel?: boolean;
  verbose?: boolean;
}) {
  const spinner = ora('Starting Cursor Navigator...').start();
  
  try {
    const projectRoot = process.cwd();
    const configPath = options.config || path.join(projectRoot, 'cursor-navigator.config.js');
    
    // Load configuration
    let config: any = {};
    try {
      const configModule = await import(path.resolve(configPath));
      config = configModule.default || configModule;
    } catch (error) {
      spinner.warn('No configuration file found, using defaults');
      
      // Auto-detect configuration
      const detected = await detectFramework(projectRoot);
      config = {
        framework: detected,
        baseUrl: `http://localhost:${options.port || '3000'}`,
        outputDir: options.output || 'cursor-app-map'
      };
    }

    // Override with CLI options
    if (options.port) config.baseUrl = `http://localhost:${options.port}`;
    if (options.output) config.outputDir = options.output;
    if (options.headless !== undefined) config.headless = options.headless;
    if (options.parallel !== undefined) config.parallel = options.parallel;

    spinner.text = 'Creating navigator...';
    
    // Create navigator
    const navigator = await createNavigator(config.framework, projectRoot, config);
    
    spinner.text = 'Generating app map...';
    
    // Generate app map
    const appMap = await navigator.generateAppMap();
    
    spinner.succeed(`App map generated successfully!`);
    
    console.log(chalk.green('\n🎉 Navigation complete!'));
    console.log(chalk.blue(`📊 Summary:`));
    console.log(chalk.gray(`  • Routes mapped: ${appMap.summary.successfulCaptures}/${appMap.summary.totalRoutes}`));
    console.log(chalk.gray(`  • Interactive elements: ${appMap.summary.totalElements}`));
    console.log(chalk.gray(`  • Average load time: ${appMap.summary.averageLoadTime}ms`));
    console.log(chalk.gray(`  • Performance score: ${appMap.summary.performanceScore}/100`));
    console.log(chalk.gray(`  • Output directory: ${config.outputDir}`));
    
    if (appMap.summary.totalErrors > 0) {
      console.log(chalk.yellow(`  ⚠️ Performance issues: ${appMap.summary.totalErrors}`));
    }
    
  } catch (error) {
    spinner.fail('Navigation failed');
    console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : 'Unknown error');
    
    if (options.verbose) {
      console.error(error);
    }
    
    process.exit(1);
  }
}

async function installCommand() {
  console.log(chalk.blue('📦 Installing Playwright browsers...\n'));
  
  const spinner = ora('Installing browsers...').start();
  
  try {
    await installPlaywright();
    spinner.succeed('Playwright browsers installed successfully!');
  } catch (error) {
    spinner.fail('Failed to install Playwright browsers');
    console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

async function detectCommand() {
  console.log(chalk.blue('🔍 Detecting project configuration...\n'));
  
  const projectRoot = process.cwd();
  const framework = await detectFramework(projectRoot);
  
  console.log(chalk.green('📋 Detection Results:'));
  console.log(chalk.gray(`  Framework: ${framework}`));
  
  try {
    const packagePath = path.join(projectRoot, 'package.json');
    const packageContent = await fs.readFile(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    console.log(chalk.gray(`  Dev command: ${packageJson.scripts?.dev || 'Not found'}`));
    console.log(chalk.gray(`  Build command: ${packageJson.scripts?.build || 'Not found'}`));
    
    // Try to detect port from dev script
    if (packageJson.scripts?.dev) {
      const portMatch = packageJson.scripts.dev.match(/-p\s+(\d+)|--port\s+(\d+)|port[=:]\s*(\d+)/i);
      if (portMatch) {
        console.log(chalk.gray(`  Detected port: ${portMatch[1] || portMatch[2] || portMatch[3]}`));
      }
    }
    
  } catch (error) {
    console.log(chalk.yellow('⚠️ Could not read package.json'));
  }
  
  console.log(chalk.blue('\n💡 To initialize with these settings:'));
  console.log(chalk.gray(`cursor-navigator init --framework ${framework}`));
}

async function updatePackageJson(projectRoot: string) {
  try {
    const packagePath = path.join(projectRoot, 'package.json');
    const packageContent = await fs.readFile(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    // Add scripts if they don't exist
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    if (!packageJson.scripts['cursor:map']) {
      packageJson.scripts['cursor:map'] = 'cursor-navigator run';
    }
    
    if (!packageJson.scripts['cursor:install']) {
      packageJson.scripts['cursor:install'] = 'cursor-navigator install';
    }
    
    await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(chalk.green('✅ Package.json scripts updated'));
    
  } catch (error) {
    console.log(chalk.yellow('⚠️ Could not update package.json scripts'));
  }
} 