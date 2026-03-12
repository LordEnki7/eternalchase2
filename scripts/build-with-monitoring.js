#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🏗️  Building Eternal Chase with Bundle Monitoring');
console.log('═'.repeat(50));

try {
  // Clean previous build
  const distPath = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log('🧹 Cleaned previous build');
  }

  // Build client
  console.log('\n📦 Building client application...');
  execSync('vite build', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

  // Build server
  console.log('\n🖥️  Building server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });

  // Run bundle analysis
  console.log('\n📊 Analyzing bundle size...');
  execSync('node scripts/bundle-monitor.js', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully!');

} catch (error) {
  console.error('\n❌ Build failed!');
  console.error(error.message);
  process.exit(1);
}