#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Production Deployment Script
 * Complete deployment process with bundle size validation
 */

async function productionDeploy() {
  console.log('🚀 Eternal Chase Production Deployment');
  console.log('═'.repeat(50));

  try {
    // Step 1: Clean everything
    console.log('\n1️⃣ Cleaning previous builds...');
    const distPath = path.resolve(__dirname, '../dist');
    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, { recursive: true, force: true });
      console.log('✅ Cleaned dist directory');
    }

    // Step 2: Production build
    console.log('\n2️⃣ Building production application...');
    process.env.NODE_ENV = 'production';
    execSync('vite build --mode production', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    
    execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });

    // Step 3: Optimize bundle
    console.log('\n3️⃣ Optimizing bundle size...');
    execSync('node scripts/optimize-bundle.js', { stdio: 'inherit' });
    execSync('node scripts/optimize-images.js', { stdio: 'inherit' });

    // Step 4: Final size check
    console.log('\n4️⃣ Final bundle size validation...');
    execSync('node scripts/bundle-monitor.js', { stdio: 'inherit' });

    console.log('\n✅ Production deployment ready!');
    console.log('Bundle meets 500KB requirement for deployment.');

  } catch (error) {
    console.error('\n❌ Deployment failed!');
    console.error('Bundle size exceeds 500KB limit.');
    console.error('Run optimization scripts before deploying.');
    process.exit(1);
  }
}

productionDeploy();