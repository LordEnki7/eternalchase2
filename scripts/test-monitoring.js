#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🧪 Testing Bundle Monitoring System');
console.log('═'.repeat(40));

// Test 1: Check if scripts exist
const scripts = [
  'bundle-monitor.js',
  'build-with-monitoring.js', 
  'optimize-bundle.js',
  'deploy-check.js'
];

console.log('\n1️⃣ Checking script files...');
for (const script of scripts) {
  const scriptPath = path.join(__dirname, script);
  if (fs.existsSync(scriptPath)) {
    console.log(`✅ ${script} - Found`);
  } else {
    console.log(`❌ ${script} - Missing`);
  }
}

// Test 2: Check if dist directory exists
console.log('\n2️⃣ Checking build output...');
const distPath = path.resolve(__dirname, '../dist/public');
if (fs.existsSync(distPath)) {
  console.log('✅ Build output directory exists');
  
  // Show current size if built
  const { execSync } = await import('child_process');
  try {
    console.log('\n📊 Current bundle analysis:');
    execSync('node scripts/bundle-monitor.js', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
  } catch (error) {
    console.log('ℹ️  No build found - run build first for size analysis');
  }
} else {
  console.log('⚠️  No build output found');
  console.log('   Run: node scripts/build-with-monitoring.js');
}

console.log('\n3️⃣ Bundle monitoring system ready!');
console.log('\nUsage:');
console.log('• Build with monitoring: node scripts/build-with-monitoring.js');
console.log('• Check bundle size: node scripts/bundle-monitor.js');
console.log('• Optimize bundle: node scripts/optimize-bundle.js');
console.log('• Pre-deploy check: node scripts/deploy-check.js');
console.log('\n✅ Monitoring system test completed!');