#!/usr/bin/env node

/**
 * iOS Splash Screen Generator
 *
 * Generates Apple Touch Startup Images for all iOS device sizes.
 * Uses sharp for image processing.
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Brand colors
const backgroundColor = '#FDF8F6' // Warm cream
const primaryColor = '#ed7412' // Orange

// iOS splash screen sizes (width x height)
// Format: [width, height, deviceWidth, deviceHeight, pixelRatio, description]
const splashSizes = [
  // iPhone
  [1290, 2796, 430, 932, 3, 'iPhone 15 Pro Max, 15 Plus, 14 Pro Max'],
  [1179, 2556, 393, 852, 3, 'iPhone 15 Pro, 15, 14 Pro'],
  [1170, 2532, 390, 844, 3, 'iPhone 14, 13, 13 Pro, 12, 12 Pro'],
  [1284, 2778, 428, 926, 3, 'iPhone 14 Plus, 13 Pro Max, 12 Pro Max'],
  [1125, 2436, 375, 812, 3, 'iPhone 13 mini, 12 mini, 11 Pro, XS, X'],
  [1242, 2688, 414, 896, 3, 'iPhone 11 Pro Max, XS Max'],
  [828, 1792, 414, 896, 2, 'iPhone 11, XR'],
  [1242, 2208, 414, 736, 3, 'iPhone 8 Plus, 7 Plus, 6s Plus'],
  [750, 1334, 375, 667, 2, 'iPhone SE 2nd/3rd gen, 8, 7, 6s'],
  [640, 1136, 320, 568, 2, 'iPhone SE 1st gen, 5s, 5c, 5'],
  // iPad
  [2048, 2732, 1024, 1366, 2, 'iPad Pro 12.9"'],
  [1668, 2388, 834, 1194, 2, 'iPad Pro 11"'],
  [1640, 2360, 820, 1180, 2, 'iPad Air 10.9", iPad 10th gen'],
  [1668, 2224, 834, 1112, 2, 'iPad Pro 10.5", iPad Air 3rd gen'],
  [1620, 2160, 810, 1080, 2, 'iPad 9th gen, 8th gen, 7th gen'],
  [1536, 2048, 768, 1024, 2, 'iPad mini 6, iPad 6th gen, iPad mini 5'],
]

// Create SVG for splash screen
function createSplashSvg(width, height) {
  const iconSize = Math.min(width, height) * 0.2
  const centerX = width / 2
  const centerY = height / 2 - height * 0.1 // Slightly above center

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${backgroundColor}"/>

  <!-- Centered icon -->
  <g transform="translate(${centerX - iconSize/2}, ${centerY - iconSize/2})">
    <!-- Orange circle -->
    <circle cx="${iconSize/2}" cy="${iconSize/2}" r="${iconSize/2}" fill="${primaryColor}"/>

    <!-- Inner glow -->
    <circle cx="${iconSize/2}" cy="${iconSize/2}" r="${iconSize * 0.42}" fill="white" opacity="0.15"/>

    <!-- Stylized "M" for Metanoia -->
    <g transform="translate(${iconSize * 0.2}, ${iconSize * 0.25})">
      <path
        d="M0,${iconSize * 0.5} L0,0 L${iconSize * 0.15},${iconSize * 0.25} L${iconSize * 0.3},0 L${iconSize * 0.3},${iconSize * 0.5}"
        fill="none"
        stroke="white"
        stroke-width="${iconSize * 0.06}"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M${iconSize * 0.3},${iconSize * 0.5} L${iconSize * 0.3},0 L${iconSize * 0.45},${iconSize * 0.25} L${iconSize * 0.6},0 L${iconSize * 0.6},${iconSize * 0.5}"
        fill="none"
        stroke="white"
        stroke-width="${iconSize * 0.06}"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Transformation sparkle -->
    <g transform="translate(${iconSize * 0.7}, ${iconSize * 0.2})">
      <line x1="0" y1="${iconSize * 0.05}" x2="0" y2="-${iconSize * 0.05}" stroke="white" stroke-width="${iconSize * 0.02}" stroke-linecap="round"/>
      <line x1="-${iconSize * 0.05}" y1="0" x2="${iconSize * 0.05}" y2="0" stroke="white" stroke-width="${iconSize * 0.02}" stroke-linecap="round"/>
    </g>
  </g>

  <!-- App name -->
  <text
    x="${centerX}"
    y="${centerY + iconSize/2 + height * 0.08}"
    font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    font-size="${Math.max(24, iconSize * 0.18)}"
    font-weight="600"
    fill="#1a1a1a"
    text-anchor="middle"
    dominant-baseline="middle"
  >Metanoia Moment</text>
</svg>`
}

async function generateSplashScreens() {
  const outputDir = path.join(__dirname, '../apps/web/public/splash')

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log('Created splash directory:', outputDir)
  }

  console.log('\nGenerating iOS splash screens...\n')

  for (const [width, height, deviceWidth, deviceHeight, pixelRatio, description] of splashSizes) {
    const filename = `apple-splash-${width}-${height}.png`
    const outputPath = path.join(outputDir, filename)

    try {
      const svg = createSplashSvg(width, height)

      await sharp(Buffer.from(svg))
        .png()
        .toFile(outputPath)

      console.log(`✓ ${filename} (${description})`)
    } catch (error) {
      console.error(`✗ Failed to generate ${filename}:`, error.message)
    }
  }

  console.log('\n✓ Splash screen generation complete!')
  console.log(`\nGenerated ${splashSizes.length} splash screens in ${outputDir}`)
}

generateSplashScreens().catch(console.error)
