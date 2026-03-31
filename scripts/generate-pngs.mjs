import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePNGs() {
  try {
    const sharp = (await import('sharp')).default;
    const publicDir = path.join(__dirname, '..', 'public');
    const svgPath = path.join(publicDir, 'icon.svg');
    
    if (!fs.existsSync(svgPath)) {
      console.error('❌ icon.svg not found. Run "node scripts/generate-icons.mjs" first');
      process.exit(1);
    }

    console.log('🎨 Generating PNG icons...\n');

    // Generate 512x512 PNG
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✅ Created icon-512.png (512x512)');

    // Generate 192x192 PNG
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✅ Created icon-192.png (192x192)');

    // Generate 32x32 PNG for favicon
    await sharp(svgPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32.png'));
    console.log('✅ Created favicon-32.png (32x32)');

    console.log('\n✨ All PNG icons generated successfully!');
    console.log('\n📝 Note: For favicon.ico, use an online converter:');
    console.log('   https://favicon.io/favicon-converter/');
    console.log('   Upload favicon-32.png and download the .ico file');

  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.error('\n❌ Sharp package not installed.');
      console.error('   Run: npm install sharp');
      console.error('   Then: node scripts/generate-pngs.mjs');
    } else {
      console.error('❌ Error generating PNGs:', error.message);
    }
    process.exit(1);
  }
}

generatePNGs();
