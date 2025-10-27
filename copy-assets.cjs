const fs = require('fs');
const path = require('path');

// Create dist/assets directory if it doesn't exist
const distAssetsDir = path.join(__dirname, 'dist', 'assets');
if (!fs.existsSync(distAssetsDir)) {
  fs.mkdirSync(distAssetsDir, { recursive: true });
}

// Copy assets from public/assets to dist/assets
const publicAssetsDir = path.join(__dirname, 'public', 'assets');
if (fs.existsSync(publicAssetsDir)) {
  const files = fs.readdirSync(publicAssetsDir);
  files.forEach(file => {
    const srcPath = path.join(publicAssetsDir, file);
    const destPath = path.join(distAssetsDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to dist/assets/`);
  });
  console.log('✅ Assets copied successfully!');
} else {
  console.log('❌ Public assets directory not found');
}