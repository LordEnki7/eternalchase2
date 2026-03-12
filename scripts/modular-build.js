#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Modular Build System for Eternal Chase
 * Prevents asset bundling and ensures 500KB limit compliance
 */

const BUILD_CONFIG = {
  MAX_BUNDLE_SIZE: 500 * 1024, // 500KB
  ASSET_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.wav', '.mp3', '.ogg'],
  KEEP_EXTENSIONS: ['.js', '.css', '.html'],
  EXCLUDE_FROM_BUNDLE: ['attached_assets', 'audiobooks', 'characters', 'book-covers', 'images']
};

async function modularBuild() {
  console.log('🏗️  Modular Build System - Target: <500KB');
  console.log('═'.repeat(50));

  try {
    // Step 1: Clean previous builds
    await cleanBuild();
    
    // Step 2: Create production build with asset exclusions
    await createOptimizedBuild();
    
    // Step 3: Remove bundled assets
    await excludeAssetsFromBundle();
    
    // Step 4: Validate bundle size
    await validateBundleSize();
    
    // Step 5: Setup asset serving
    await configureAssetServing();
    
    console.log('\n✅ Modular build completed successfully!');
    console.log('Bundle is optimized and under 500KB limit.');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

async function cleanBuild() {
  console.log('\n1️⃣ Cleaning previous builds...');
  
  const distPath = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log('✓ Cleaned dist directory');
  }
}

async function createOptimizedBuild() {
  console.log('\n2️⃣ Creating optimized production build...');
  
  // Set production environment
  process.env.NODE_ENV = 'production';
  process.env.VITE_BUILD_MODE = 'modular';
  
  // Build frontend with optimizations
  execSync('vite build --mode production --minify', {
    stdio: 'pipe',
    cwd: path.resolve(__dirname, '..')
  });
  
  // Build backend
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify --tree-shaking=true', {
    stdio: 'pipe',
    cwd: path.resolve(__dirname, '..')
  });
  
  console.log('✓ Build completed');
}

async function excludeAssetsFromBundle() {
  console.log('\n3️⃣ Excluding assets from bundle...');
  
  const distAssetsPath = path.resolve(__dirname, '../dist/public/assets');
  if (!fs.existsSync(distAssetsPath)) {
    console.log('✓ No assets to exclude');
    return;
  }
  
  let removedSize = 0;
  let removedFiles = 0;
  
  const files = fs.readdirSync(distAssetsPath);
  
  for (const file of files) {
    const filePath = path.join(distAssetsPath, file);
    const stats = fs.statSync(filePath);
    
    // Remove all non-essential assets
    const isAsset = BUILD_CONFIG.ASSET_EXTENSIONS.some(ext => 
      file.toLowerCase().endsWith(ext)
    );
    
    const isEssential = BUILD_CONFIG.KEEP_EXTENSIONS.some(ext => 
      file.toLowerCase().endsWith(ext)
    );
    
    if (isAsset && !isEssential) {
      removedSize += stats.size;
      removedFiles++;
      fs.unlinkSync(filePath);
    }
  }
  
  console.log(`✓ Excluded ${removedFiles} assets (${formatBytes(removedSize)} saved)`);
}

async function validateBundleSize() {
  console.log('\n4️⃣ Validating bundle size...');
  
  const distPath = path.resolve(__dirname, '../dist/public');
  const totalSize = getDirectorySize(distPath);
  
  console.log(`Bundle size: ${formatBytes(totalSize)}`);
  console.log(`Limit: ${formatBytes(BUILD_CONFIG.MAX_BUNDLE_SIZE)}`);
  console.log(`Usage: ${((totalSize / BUILD_CONFIG.MAX_BUNDLE_SIZE) * 100).toFixed(1)}%`);
  
  if (totalSize > BUILD_CONFIG.MAX_BUNDLE_SIZE) {
    throw new Error(`Bundle size ${formatBytes(totalSize)} exceeds ${formatBytes(BUILD_CONFIG.MAX_BUNDLE_SIZE)} limit`);
  }
  
  console.log('✓ Bundle size within limits');
}

async function configureAssetServing() {
  console.log('\n5️⃣ Configuring asset serving...');
  
  // Create asset configuration
  const assetConfig = {
    serveFromAssets: true,
    assetPath: '/attached_assets',
    fallbackPath: '/assets/fallback',
    maxAge: '1y',
    compression: true
  };
  
  const configPath = path.resolve(__dirname, '../dist/asset-config.json');
  fs.writeFileSync(configPath, JSON.stringify(assetConfig, null, 2));
  
  console.log('✓ Asset serving configured');
}

function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  if (!fs.existsSync(dirPath)) return 0;
  
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

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run modular build
modularBuild();