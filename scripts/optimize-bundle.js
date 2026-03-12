#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Bundle Optimization Script for Eternal Chase
 * Automatically optimizes bundle size by removing unnecessary files
 */

function optimizeBundle() {
  console.log('🎯 Optimizing Eternal Chase Bundle');
  console.log('═'.repeat(40));

  const distPath = path.resolve(__dirname, '../dist/public');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Build directory not found. Run build first.');
    return;
  }

  let removedSize = 0;
  let removedFiles = 0;

  // Files to remove for size optimization
  const filesToRemove = [
    'assets/**/*.map',           // Source maps
    '**/*.LICENSE.txt',          // License files
    '**/unused-*',               // Unused assets
    '**/.DS_Store',              // macOS files
    '**/thumbs.db',              // Windows thumbnails
  ];

  // Directories to check for large files
  const checkDirectories = [
    'assets',
    'images',
    'fonts'
  ];

  function removeFile(filePath) {
    try {
      const stats = fs.statSync(filePath);
      fs.unlinkSync(filePath);
      removedSize += stats.size;
      removedFiles++;
      console.log(`🗑️  Removed: ${path.relative(distPath, filePath)} (${formatBytes(stats.size)})`);
    } catch (error) {
      // File might not exist, ignore
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        scanDirectory(filePath);
      } else {
        // Remove source maps
        if (file.endsWith('.map')) {
          removeFile(filePath);
        }
        
        // Remove license files
        if (file.includes('LICENSE') || file.includes('license')) {
          removeFile(filePath);
        }
        
        // Check for very large files that might be unused
        if (stats.size > 100 * 1024 && file.includes('unused')) {
          removeFile(filePath);
        }
      }
    }
  }

  // Start optimization
  scanDirectory(distPath);

  // Optimize specific asset types
  const assetsPath = path.join(distPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    console.log('\n🖼️  Checking asset optimization...');
    
    const assetFiles = fs.readdirSync(assetsPath);
    for (const file of assetFiles) {
      const filePath = path.join(assetsPath, file);
      const stats = fs.statSync(filePath);
      
      // Warn about large assets
      if (stats.size > 200 * 1024) {
        console.log(`⚠️  Large asset detected: ${file} (${formatBytes(stats.size)})`);
        console.log('   Consider optimizing this file');
      }
    }
  }

  console.log('\n📊 Optimization Results:');
  console.log(`Files removed: ${removedFiles}`);
  console.log(`Space saved: ${formatBytes(removedSize)}`);

  if (removedSize > 0) {
    console.log('\n✅ Bundle optimization completed!');
  } else {
    console.log('\n💡 No optimization needed - bundle is already clean');
  }
}

optimizeBundle();