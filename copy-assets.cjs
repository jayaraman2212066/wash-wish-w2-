const fs = require('fs')
const path = require('path')

// Copy all images from public/images/assets to dist folder for deployment
const sourceDir = path.join(__dirname, 'public', 'images', 'assets')
const destDir = path.join(__dirname, 'dist', 'assets')

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.log('Source directory not found:', sourceDir)
  return
}

// Get all files from source directory
const assetFiles = fs.readdirSync(sourceDir)

assetFiles.forEach(file => {
  const src = path.join(sourceDir, file)
  const dest = path.join(destDir, file)
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log(`Copied ${file} to dist/assets`)
  }
})

console.log(`All ${assetFiles.length} asset files copied successfully!`)