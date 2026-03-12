// Build configuration to exclude assets from bundle
export const buildConfig = {
  // Exclude these directories from bundle
  excludeFromBundle: [
    'attached_assets/**/*',
    '**/*.wav',
    '**/*.mp3',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.webp',
    '**/*.gif'
  ],
  
  // Asset serving configuration
  assetServing: {
    enabled: true,
    path: '/assets',
    directory: '../attached_assets',
    maxAge: '1y',
    compression: true
  },
  
  // Bundle size limits
  bundleSize: {
    maxSize: 500 * 1024, // 500KB
    warnAt: 400 * 1024,  // 400KB
    errorAt: 500 * 1024  // 500KB
  },
  
  // Modular build settings
  modular: {
    enabled: true,
    chunkSizeLimit: 200 * 1024, // 200KB per chunk
    dynamicImports: true,
    treeShaking: true,
    minification: true
  }
};