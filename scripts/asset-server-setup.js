#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Asset Server Setup
 * Configures server to serve assets directly without bundling
 */

function setupAssetServer() {
  console.log('🔧 Setting up asset server configuration');
  console.log('═'.repeat(40));

  // Create asset middleware configuration
  const assetServerCode = `
// Asset serving middleware - prevents bundling large files
app.use('/assets', express.static(path.join(__dirname, '../attached_assets'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  setHeaders: (res, filePath) => {
    // Enable compression for assets
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Set proper MIME types
    if (filePath.endsWith('.wav')) {
      res.setHeader('Content-Type', 'audio/wav');
    } else if (filePath.endsWith('.mp3')) {
      res.setHeader('Content-Type', 'audio/mpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));

// Fallback for missing assets
app.get('/assets/*', (req, res) => {
  const fallbackPath = path.join(__dirname, '../attached_assets/fallback');
  
  if (req.path.includes('.wav') || req.path.includes('.mp3')) {
    // Return empty audio file
    res.setHeader('Content-Type', 'audio/wav');
    res.status(204).end();
  } else if (req.path.includes('.png') || req.path.includes('.jpg')) {
    // Return minimal 1px image
    const minimalPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.send(minimalPng);
  } else {
    res.status(404).json({ error: 'Asset not found' });
  }
});`;

  // Write asset server configuration
  const configPath = path.resolve(__dirname, '../server/asset-middleware.js');
  fs.writeFileSync(configPath, assetServerCode);
  
  console.log('✓ Created asset middleware configuration');
  
  // Create build configuration to exclude assets
  const buildConfig = `
// Build configuration to exclude assets from bundle
export const buildConfig = {
  // Exclude these directories from bundle
  excludeFromBundle: [
    'attached_assets/**/*',
    '**/*.wav',
    '**/*.mp3',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg'
  ],
  
  // Asset serving configuration
  assetServing: {
    enabled: true,
    path: '/assets',
    directory: '../attached_assets',
    maxAge: '1y'
  },
  
  // Bundle size limits
  bundleSize: {
    maxSize: 500 * 1024, // 500KB
    warnAt: 400 * 1024   // 400KB
  }
};`;

  const buildConfigPath = path.resolve(__dirname, '../build.config.js');
  fs.writeFileSync(buildConfigPath, buildConfig);
  
  console.log('✓ Created build configuration');
  console.log('\n✅ Asset server setup completed');
}

setupAssetServer();