#!/usr/bin/env node

/**
 * PWA Icon Generator
 *
 * This script generates PWA icons from an SVG source.
 *
 * Prerequisites:
 * - Node.js
 * - sharp (npm install sharp)
 *
 * Usage:
 *   node scripts/generate-icons.js
 *
 * The script will:
 * 1. Generate icons in all required sizes for PWA
 * 2. Create maskable icons with proper safe zone
 * 3. Generate shortcut icons
 */

const fs = require('fs')
const path = require('path')

// Define icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

// Brand colors
const primaryColor = '#ed7412' // Orange
const backgroundColor = '#FDF8F6' // Warm cream

// SVG template for the main icon
// Features: A stylized "M" with a transformation/butterfly motif
const createSvg = (size) => {
  const padding = Math.round(size * 0.1) // 10% padding for maskable
  const iconSize = size - padding * 2

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${primaryColor}"/>

  <!-- Inner circle for depth -->
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.42}" fill="white" opacity="0.15"/>

  <!-- Stylized "M" for Metanoia -->
  <g transform="translate(${size * 0.2}, ${size * 0.25})">
    <path
      d="M0,${size * 0.5} L0,0 L${size * 0.15},${size * 0.25} L${size * 0.3},0 L${size * 0.3},${size * 0.5}"
      fill="none"
      stroke="white"
      stroke-width="${size * 0.06}"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M${size * 0.3},${size * 0.5} L${size * 0.3},0 L${size * 0.45},${size * 0.25} L${size * 0.6},0 L${size * 0.6},${size * 0.5}"
      fill="none"
      stroke="white"
      stroke-width="${size * 0.06}"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>

  <!-- Transformation symbol (small cross/sparkle) -->
  <g transform="translate(${size * 0.7}, ${size * 0.2})">
    <line x1="0" y1="${size * 0.05}" x2="0" y2="-${size * 0.05}" stroke="white" stroke-width="${size * 0.02}" stroke-linecap="round"/>
    <line x1="-${size * 0.05}" y1="0" x2="${size * 0.05}" y2="0" stroke="white" stroke-width="${size * 0.02}" stroke-linecap="round"/>
  </g>
</svg>`
}

// Create record shortcut icon (camera/video icon)
const createRecordIcon = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#dc2626"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.3}" fill="white"/>
</svg>`
}

// Create browse shortcut icon (play button)
const createBrowseIcon = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${primaryColor}"/>
  <polygon
    points="${size * 0.35},${size * 0.25} ${size * 0.75},${size * 0.5} ${size * 0.35},${size * 0.75}"
    fill="white"
  />
</svg>`
}

// Output directory
const outputDir = path.join(__dirname, '../apps/web/public/icons')

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('Generating PWA icons...')
console.log('Output directory:', outputDir)
console.log('')

// Generate main icons as SVG (to be converted to PNG later with sharp if available)
sizes.forEach(size => {
  const svg = createSvg(size)
  const filename = path.join(outputDir, `icon-${size}x${size}.svg`)
  fs.writeFileSync(filename, svg)
  console.log(`✓ Generated: icon-${size}x${size}.svg`)
})

// Generate shortcut icons
fs.writeFileSync(path.join(outputDir, 'record-icon.svg'), createRecordIcon(96))
console.log('✓ Generated: record-icon.svg')

fs.writeFileSync(path.join(outputDir, 'browse-icon.svg'), createBrowseIcon(96))
console.log('✓ Generated: browse-icon.svg')

console.log('')
console.log('SVG icons generated successfully!')
console.log('')
console.log('To convert to PNG, install sharp and run:')
console.log('  npm install sharp')
console.log('  node scripts/convert-icons-to-png.js')
console.log('')
console.log('Or use an online tool like https://svgtopng.com/')
