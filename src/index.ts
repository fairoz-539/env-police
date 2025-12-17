#!/usr/bin/env node
import { program } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import dotenv from 'dotenv';
import chalk from 'chalk';

program
  .version('1.0.0')
  .description('Scans your code for process.env usage and ensures they exist in .env')
  .option('-p, --path <path>', 'Path to source code', './src')
  .option('-e, --env <path>', 'Path to .env file', './.env')
  .parse(process.argv);

const options = program.opts();

const run = () => {
  console.log(chalk.blue(`🔍 Scanning for environment variables in ${options.path}...`));

  // 1. Load the .env file
  const envPath = path.resolve(process.cwd(), options.env);
  if (!fs.existsSync(envPath)) {
    console.log(chalk.red(`❌ .env file not found at ${envPath}`));
    process.exit(1);
  }

  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  const definedKeys = Object.keys(envConfig);

  // 2. Find all JS/TS files
  const searchPattern = `${options.path}/**/*.{js,jsx,ts,tsx}`;
  const files = glob.sync(searchPattern, { ignore: '**/node_modules/**' });

  let missingVars: Set<string> = new Set();
  let usedVars: Set<string> = new Set();

  // 3. UPGRADED REGEX PATTERNS
  // Catches: process.env.API_KEY
  const standardRegex = /process\.env\.([A-Z_0-9]+)/g;
  // Catches: const { API_KEY } = process.env;
  const destructureRegex = /const\s+\{([^}]+)\}\s*=\s*process\.env/g;

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    let match;

    // Check Standard Usage
    while ((match = standardRegex.exec(content)) !== null) {
      const varName = match[1];
      usedVars.add(varName);
      if (!definedKeys.includes(varName)) missingVars.add(varName);
    }

    // Check Destructuring Usage
    while ((match = destructureRegex.exec(content)) !== null) {
      const vars = match[1].split(',').map(v => v.trim().split(':')[0].trim());
      vars.forEach(varName => {
        if (varName && /^[A-Z_0-9]+$/.test(varName)) {
          usedVars.add(varName);
          if (!definedKeys.includes(varName)) missingVars.add(varName);
        }
      });
    }
  });

  // 4. Report Results
  if (missingVars.size > 0) {
    console.log(chalk.red('\n❌ Missing Environment Variables:'));
    console.log(chalk.yellow('These variables are used in your code but missing from .env:'));
    missingVars.forEach((v) => console.log(chalk.red(`   - ${v}`)));
    process.exit(1);
  } else {
    console.log(chalk.green('\n✅ All environment variables are defined!'));
    console.log(chalk.gray(`   Checked ${files.length} files.`));
    console.log(chalk.gray(`   Verified ${usedVars.size} variables.`));
  }
};

run();