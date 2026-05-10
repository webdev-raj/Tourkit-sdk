const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const src = path.join(root, 'sdk', 'dist', 'tourkit.min.js')
const destDir = path.join(root, 'public')
const dest = path.join(destDir, 'tourkit.min.js')

if (!fs.existsSync(src)) {
  console.error('sync-sdk-to-public: missing', src, '— run: cd sdk && npm run build')
  process.exit(1)
}

fs.mkdirSync(destDir, { recursive: true })
fs.copyFileSync(src, dest)
console.log('sync-sdk-to-public: copied sdk/dist/tourkit.min.js -> public/tourkit.min.js')
