/**
 * Script para generar iconos PNG desde SVG
 * Ejecutar: node generate-icons.mjs
 */

import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

const svgContent = fs.readFileSync('./public/favicon.svg', 'utf8');

// Convertir SVG a PNG usando canvas
async function generatePNG(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Crear data URL del SVG
  const svgDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');
  
  try {
    const img = await loadImage(svgDataUrl);
    ctx.drawImage(img, 0, 0, size, size);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Generado: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error generando ${outputPath}:`, error.message);
  }
}

// Generar iconos
(async () => {
  console.log('🎨 Generando iconos PNG...\n');
  await generatePNG(192, './public/icon-192.png');
  await generatePNG(512, './public/icon-512.png');
  console.log('\n✨ ¡Iconos generados correctamente!');
})();
