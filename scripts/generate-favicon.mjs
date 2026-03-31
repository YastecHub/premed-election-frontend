import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicon() {
  try {
    const sharp = (await import('sharp')).default;
    const publicDir = path.join(__dirname, '..', 'public');
    const favicon32Path = path.join(publicDir, 'favicon-32.png');
    
    if (!fs.existsSync(favicon32Path)) {
      console.error('❌ favicon-32.png not found. Run "node scripts/generate-pngs.mjs" first');
      process.exit(1);
    }

    console.log('🎨 Generating favicon.ico...\n');

    // Read the 32x32 PNG and save as ICO format
    // Note: Sharp doesn't directly support ICO, so we'll create multiple sizes
    const sizes = [16, 32, 48];
    const svgPath = path.join(publicDir, 'icon.svg');
    
    for (const size of sizes) {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `favicon-${size}.png`));
      console.log(`✅ Created favicon-${size}.png (${size}x${size})`);
    }

    console.log('\n✨ Favicon PNGs generated!');
    console.log('\n📝 To create favicon.ico:');
    console.log('   Option 1: Use https://favicon.io/favicon-converter/');
    console.log('   Option 2: Use https://www.icoconverter.com/');
    console.log('   Upload favicon-32.png and download as favicon.ico');
    console.log('\n   Or simply use favicon-32.png as favicon (modern browsers support PNG favicons)');

  } catch (error) {
    console.error('❌ Error generating favicon:', error.message);
    process.exit(1);
  }
}

generateFavicon();
