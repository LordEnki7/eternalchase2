#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUNDLE_SIZE_LIMIT = 500 * 1024; // 500KB in bytes
const DIST_PATH = path.resolve(__dirname, '../dist/public');

/**
 * Bundle Size Monitor for Eternal Chase
 * Ensures our deployment bundle never exceeds 500KB
 */

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDirectorySize(dirPath) {
  let totalSize = 0;
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      totalSize += getDirectorySize(itemPath);
    } else {
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

function analyzeBundle() {
  if (!fs.existsSync(DIST_PATH)) {
    console.log(chalk.red('❌ Build directory not found. Run "npm run build" first.'));
    process.exit(1);
  }

  console.log(chalk.cyan('\n🚀 Eternal Chase Bundle Size Monitor\n'));
  console.log(chalk.blue('═'.repeat(50)));

  const totalSize = getDirectorySize(DIST_PATH);
  const sizePercentage = (totalSize / BUNDLE_SIZE_LIMIT) * 100;

  // Analyze individual files
  const files = [];
  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relPath = path.join(relativePath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isFile()) {
        files.push({
          path: relPath,
          size: stats.size,
          extension: path.extname(item)
        });
      } else if (stats.isDirectory()) {
        scanDirectory(fullPath, relPath);
      }
    }
  }
  
  scanDirectory(DIST_PATH);
  
  // Sort files by size (largest first)
  files.sort((a, b) => b.size - a.size);
  
  // Display results
  console.log(chalk.white('📊 Bundle Analysis:'));
  console.log(chalk.gray('─'.repeat(30)));
  
  console.log(`Total Bundle Size: ${chalk.bold(formatBytes(totalSize))}`);
  console.log(`Size Limit: ${chalk.gray(formatBytes(BUNDLE_SIZE_LIMIT))}`);
  console.log(`Usage: ${chalk.bold(sizePercentage.toFixed(1) + '%')}`);
  
  // Status indicator
  if (totalSize > BUNDLE_SIZE_LIMIT) {
    console.log(chalk.red('\n🚨 BUNDLE SIZE EXCEEDED! 🚨'));
    console.log(chalk.red(`Bundle is ${formatBytes(totalSize - BUNDLE_SIZE_LIMIT)} over the limit!`));
  } else if (sizePercentage > 80) {
    console.log(chalk.yellow('\n⚠️  Bundle size approaching limit'));
    console.log(chalk.yellow(`${formatBytes(BUNDLE_SIZE_LIMIT - totalSize)} remaining`));
  } else {
    console.log(chalk.green('\n✅ Bundle size within limits'));
    console.log(chalk.green(`${formatBytes(BUNDLE_SIZE_LIMIT - totalSize)} remaining`));
  }
  
  // Show largest files
  console.log(chalk.white('\n📁 Largest Files:'));
  console.log(chalk.gray('─'.repeat(30)));
  
  const topFiles = files.slice(0, 10);
  for (const file of topFiles) {
    const sizeStr = formatBytes(file.size).padEnd(10);
    const percentage = ((file.size / totalSize) * 100).toFixed(1);
    console.log(`${sizeStr} ${chalk.cyan(percentage + '%')} ${chalk.gray(file.path)}`);
  }
  
  // File type breakdown
  const typeBreakdown = {};
  for (const file of files) {
    const ext = file.extension || 'no-ext';
    if (!typeBreakdown[ext]) {
      typeBreakdown[ext] = { count: 0, size: 0 };
    }
    typeBreakdown[ext].count++;
    typeBreakdown[ext].size += file.size;
  }
  
  console.log(chalk.white('\n📋 File Type Breakdown:'));
  console.log(chalk.gray('─'.repeat(30)));
  
  const sortedTypes = Object.entries(typeBreakdown)
    .sort(([,a], [,b]) => b.size - a.size);
    
  for (const [ext, data] of sortedTypes) {
    const percentage = ((data.size / totalSize) * 100).toFixed(1);
    console.log(`${ext.padEnd(8)} ${formatBytes(data.size).padEnd(10)} ${chalk.cyan(percentage + '%')} (${data.count} files)`);
  }
  
  console.log(chalk.blue('\n═'.repeat(50)));
  
  // Optimization suggestions
  if (totalSize > BUNDLE_SIZE_LIMIT * 0.7) {
    console.log(chalk.yellow('\n💡 Optimization Suggestions:'));
    console.log(chalk.gray('─'.repeat(30)));
    
    const largeJS = files.filter(f => f.extension === '.js' && f.size > 50 * 1024);
    if (largeJS.length > 0) {
      console.log('• Consider code splitting for large JavaScript files');
    }
    
    const largeAssets = files.filter(f => 
      ['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(f.extension) && 
      f.size > 100 * 1024
    );
    if (largeAssets.length > 0) {
      console.log('• Optimize image assets (compress, WebP format)');
    }
    
    const unusedFiles = files.filter(f => f.path.includes('unused') || f.path.includes('temp'));
    if (unusedFiles.length > 0) {
      console.log('• Remove unused/temporary files');
    }
    
    console.log('• Enable gzip compression on your server');
    console.log('• Use dynamic imports for non-critical code');
  }
  
  // Exit with error if over limit
  if (totalSize > BUNDLE_SIZE_LIMIT) {
    process.exit(1);
  }
}

// Run the analysis
analyzeBundle();