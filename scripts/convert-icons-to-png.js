#!/usr/bin/env node

/**
 * Convert SVG icons to PNG using sharp
 */

const fs = require('fs')
const path = require('path')

async function convertIcons() {
  let sharp
  try {
    sharp = require('sharp')
  } catch (e) {
    console.error('Error: sharp is not installed.')
    console.log('Install it with: npm install sharp')
    process.exit(1)
  }

  const iconsDir = path.join(__dirname, '../apps/web/public/icons')
  const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'))

  console.log('Converting SVG icons to PNG...')
  console.log('')

  for (const file of files) {
    const svgPath = path.join(iconsDir, file)
    const pngPath = path.join(iconsDir, file.replace('.svg', '.png'))

    try {
      // Read the SVG and extract the size from filename
      const match = file.match(/(\d+)x(\d+)/)
      const size = match ? parseInt(match[1]) : 96

      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath)

      console.log(`✓ Converted: ${file} -> ${file.replace('.svg', '.png')}`)
    } catch (error) {
      console.error(`✗ Error converting ${file}:`, error.message)
    }
  }

  console.log('')
  console.log('PNG conversion complete!')
}

convertIcons()
