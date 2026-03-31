import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced SVG content for the Pre-MedElect icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Shield background -->
  <path d="M256 40 L460 90 L460 280 Q460 440 256 472 Q52 440 52 280 L52 90 Z" 
        fill="#1A3FA8" 
        filter="url(#shadow)"/>
  
  <!-- Inner shadow for depth -->
  <path d="M256 50 L450 95 L450 280 Q450 430 256 460 Q62 430 62 280 L62 95 Z" 
        fill="none" 
        stroke="#0D1F54" 
        stroke-width="2" 
        opacity="0.3"/>
  
  <!-- Medical cross -->
  <g filter="url(#shadow)">
    <rect x="236" y="180" width="40" height="140" fill="white" rx="6"/>
    <rect x="186" y="230" width="140" height="40" fill="white" rx="6"/>
  </g>
  
  <!-- Green check badge -->
  <circle cx="390" cy="390" r="70" fill="#34D399" filter="url(#shadow)"/>
  <circle cx="390" cy="390" r="65" fill="#34D399"/>
  
  <!-- White checkmark -->
  <path d="M355 390 L375 410 L425 360" 
        stroke="white" 
        stroke-width="16" 
        fill="none" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        filter="url(#shadow)"/>
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

console.log('✅ Enhanced SVG icon created at public/icon.svg');
console.log('\n📋 Next steps to generate PNG files:\n');
console.log('Option 1 - Using sharp (recommended):');
console.log('  npm install sharp');
console.log('  node scripts/generate-pngs.js\n');
console.log('Option 2 - Online converter:');
console.log('  1. Go to https://cloudconvert.com/svg-to-png');
console.log('  2. Upload public/icon.svg');
console.log('  3. Set width to 512, height to 512');
console.log('  4. Download as icon-512.png');
console.log('  5. Repeat with 192x192 for icon-192.png');
console.log('  6. Use https://favicon.io/favicon-converter/ for favicon.ico');
