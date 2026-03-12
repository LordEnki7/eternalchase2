#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Emergency Bundle Size Fix for Eternal Chase
 * Removes audio files from build output to meet 500KB limit
 */

function fixBundleSize() {
  console.log('🚨 Emergency Bundle Size Fix');
  console.log('═'.repeat(40));

  const distPath = path.resolve(__dirname, '../dist/public');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Build directory not found.');
    return;
  }

  let removedSize = 0;
  let removedFiles = 0;

  function removeAudioFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        removeAudioFiles(filePath);
        // Remove empty directories
        try {
          if (fs.readdirSync(filePath).length === 0) {
            fs.rmdirSync(filePath);
          }
        } catch (e) {
          // Directory not empty, ignore
        }
      } else {
        // Remove audio files from build
        const audioExtensions = ['.wav', '.mp3', '.ogg', '.m4a', '.aac'];
        const isAudio = audioExtensions.some(ext => file.toLowerCase().endsWith(ext));
        
        if (isAudio) {
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

  // Remove all audio files from dist
  removeAudioFiles(distPath);

  console.log('\n📊 Fix Results:');
  console.log(`Audio files removed: ${removedFiles}`);
  console.log(`Space saved: ${formatBytes(removedSize)}`);

  // Check new size
  console.log('\n📏 Checking new bundle size...');
  import('./bundle-monitor.js');
}

fixBundleSize();