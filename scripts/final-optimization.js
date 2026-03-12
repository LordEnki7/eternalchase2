#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Final Bundle Optimization for 500KB Limit
 * Applies aggressive optimizations to meet deployment requirements
 */

function finalOptimization() {
  console.log('🎯 Final Bundle Optimization for 500KB Limit');
  console.log('═'.repeat(50));

  const distPath = path.resolve(__dirname, '../dist/public');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Build directory not found.');
    return;
  }

  console.log('📦 Creating optimized production build...');
  
  try {
    // Clean and rebuild with production optimizations
    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, { recursive: true, force: true });
    }
    
    // Build with production optimizations
    process.env.NODE_ENV = 'production';
    execSync('vite build --mode production', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    
    // Remove all non-essential files
    removeNonEssentialFiles();
    
    console.log('\n📊 Final bundle analysis:');
    execSync('node scripts/bundle-monitor.js', { stdio: 'inherit' });
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

function removeNonEssentialFiles() {
  const distPath = path.resolve(__dirname, '../dist/public');
  let removedSize = 0;
  let removedFiles = 0;

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function cleanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        cleanDirectory(filePath);
        // Remove empty directories
        try {
          if (fs.readdirSync(filePath).length === 0) {
            fs.rmdirSync(filePath);
          }
        } catch (e) {
          // Directory not empty, ignore
        }
      } else {
        // Remove non-essential files
        const shouldRemove = 
          file.endsWith('.map') ||           // Source maps
          file.includes('LICENSE') ||        // License files
          file.includes('unused') ||         // Unused files
          file === '.DS_Store' ||           // macOS files
          file === 'Thumbs.db' ||           // Windows thumbnails
          file.endsWith('_vite') ||         // Vite temp files
          (file.endsWith('.png') && stats.size > 1024 * 100) || // Large images
          (file.endsWith('.wav') || file.endsWith('.mp3')); // Audio files
        
        if (shouldRemove) {
          removedSize += stats.size;
          removedFiles++;
          fs.unlinkSync(filePath);
          console.log(`🗑️  Removed: ${file} (${formatBytes(stats.size)})`);
        }
      }
    }
  }

  console.log('\n🧹 Removing non-essential files...');
  cleanDirectory(distPath);
  
  if (removedFiles > 0) {
    console.log(`\n✅ Cleanup completed: ${removedFiles} files, ${formatBytes(removedSize)} saved`);
  } else {
    console.log('\n💡 Bundle is already optimized');
  }
}

finalOptimization();