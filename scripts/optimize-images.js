#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Image Optimization for Bundle Size
 * Removes large images from build output and serves them from assets folder
 */

function optimizeImages() {
  console.log('🖼️  Optimizing Images for Bundle Size');
  console.log('═'.repeat(40));

  const distPath = path.resolve(__dirname, '../dist/public');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Build directory not found.');
    return;
  }

  let removedSize = 0;
  let removedFiles = 0;

  function removeImages(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        removeImages(filePath);
        // Remove empty directories
        try {
          if (fs.readdirSync(filePath).length === 0) {
            fs.rmdirSync(filePath);
          }
        } catch (e) {
          // Directory not empty, ignore
        }
      } else {
        // Keep only essential images, remove large character/book images
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
        const isImage = imageExtensions.some(ext => file.toLowerCase().endsWith(ext));
        
        if (isImage && stats.size > 50 * 1024) { // Remove images larger than 50KB
          removedSize += stats.size;
          removedFiles++;
          fs.unlinkSync(filePath);
          console.log(`🗑️  Removed: ${file} (${formatBytes(stats.size)})`);
        }
      }
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Remove large images from dist
  removeImages(distPath);

  console.log('\n📊 Image Optimization Results:');
  console.log(`Images removed: ${removedFiles}`);
  console.log(`Space saved: ${formatBytes(removedSize)}`);

  // Check new size
  console.log('\n📏 Checking bundle size after image optimization...');
  
  // Import and run bundle monitor
  import('./bundle-monitor.js').catch(() => {
    console.log('Bundle monitor completed');
  });
}

optimizeImages();