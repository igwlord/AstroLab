#!/bin/bash
# Script para generar iconos PNG desde el SVG
# Usa ImageMagick o cualquier conversor online

echo "🎨 Para generar los iconos PNG:"
echo ""
echo "Opción 1 - Online (Más fácil):"
echo "1. Ve a https://realfavicongenerator.net/"
echo "2. Sube el archivo public/favicon.svg"
echo "3. Descarga y extrae los iconos generados"
echo "4. Copia icon-192.png e icon-512.png a la carpeta public/"
echo ""
echo "Opción 2 - Con ImageMagick (si lo tienes instalado):"
echo "  convert public/favicon.svg -resize 192x192 public/icon-192.png"
echo "  convert public/favicon.svg -resize 512x512 public/icon-512.png"
echo ""
echo "Opción 3 - Con Inkscape (si lo tienes instalado):"
echo "  inkscape public/favicon.svg --export-type=png --export-width=192 --export-filename=public/icon-192.png"
echo "  inkscape public/favicon.svg --export-type=png --export-width=512 --export-filename=public/icon-512.png"
echo ""
echo "💡 Por ahora, el SVG funcionará en navegadores modernos."
echo "   Los PNG son opcionales pero recomendados para mejor compatibilidad."
