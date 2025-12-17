#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const glob = __importStar(require("glob"));
const dotenv_1 = __importDefault(require("dotenv"));
const chalk_1 = __importDefault(require("chalk"));
commander_1.program
    .version('1.0.0')
    .description('Scans your code for process.env usage and ensures they exist in .env')
    .option('-p, --path <path>', 'Path to source code', './src')
    .option('-e, --env <path>', 'Path to .env file', './.env')
    .parse(process.argv);
const options = commander_1.program.opts();
const run = () => {
    console.log(chalk_1.default.blue(`🔍 Scanning for environment variables in ${options.path}...`));
    // 1. Load the .env file
    const envPath = path.resolve(process.cwd(), options.env);
    if (!fs.existsSync(envPath)) {
        console.log(chalk_1.default.red(`❌ .env file not found at ${envPath}`));
        process.exit(1);
    }
    const envConfig = dotenv_1.default.parse(fs.readFileSync(envPath));
    const definedKeys = Object.keys(envConfig);
    // 2. Find all JS/TS files
    const searchPattern = `${options.path}/**/*.{js,jsx,ts,tsx}`;
    const files = glob.sync(searchPattern, { ignore: '**/node_modules/**' });
    let missingVars = new Set();
    let usedVars = new Set();
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
            if (!definedKeys.includes(varName))
                missingVars.add(varName);
        }
        // Check Destructuring Usage
        while ((match = destructureRegex.exec(content)) !== null) {
            const vars = match[1].split(',').map(v => v.trim().split(':')[0].trim());
            vars.forEach(varName => {
                if (varName && /^[A-Z_0-9]+$/.test(varName)) {
                    usedVars.add(varName);
                    if (!definedKeys.includes(varName))
                        missingVars.add(varName);
                }
            });
        }
    });
    // 4. Report Results
    if (missingVars.size > 0) {
        console.log(chalk_1.default.red('\n❌ Missing Environment Variables:'));
        console.log(chalk_1.default.yellow('These variables are used in your code but missing from .env:'));
        missingVars.forEach((v) => console.log(chalk_1.default.red(`   - ${v}`)));
        process.exit(1);
    }
    else {
        console.log(chalk_1.default.green('\n✅ All environment variables are defined!'));
        console.log(chalk_1.default.gray(`   Checked ${files.length} files.`));
        console.log(chalk_1.default.gray(`   Verified ${usedVars.size} variables.`));
    }
};
run();
