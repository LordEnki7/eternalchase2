#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUNDLE_SIZE_LIMIT = 500 * 1024; // 500KB
const DIST_PATH = path.resolve(__dirname, '../dist/public');

console.log('🚀 Pre-Deployment Bundle Size Check');
console.log('═'.repeat(40));

try {
  // Run build first
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Run bundle analysis
  console.log('\nAnalyzing bundle size...');
  execSync('node scripts/bundle-monitor.js', { stdio: 'inherit' });
  
  console.log('\n✅ Deployment check passed!');
  console.log('Bundle is ready for deployment.');
  
} catch (error) {
  console.error('\n❌ Deployment check failed!');
  console.error('Fix bundle size issues before deploying.');
  process.exit(1);
}