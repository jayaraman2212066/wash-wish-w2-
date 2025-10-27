const fs = require('fs')
const path = require('path')

// Copy all assets to public folder for deployment
const assetsDir = path.join(__dirname, 'assets')
const publicDir = path.join(__dirname, 'public')

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Get all files from assets directory
const assetFiles = fs.readdirSync(assetsDir)

assetFiles.forEach(file => {
  const src = path.join(assetsDir, file)
  const dest = path.join(publicDir, file)
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log(`Copied ${file} to public folder`)
  }
})

console.log(`All ${assetFiles.length} asset files copied successfully!`)