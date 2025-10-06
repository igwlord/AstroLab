# Image Optimization Script
# Convierte imágenes PNG a WebP para mejor compresión

Write-Host "🖼️  Image Optimization Script" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "public")) {
    Write-Host "❌ Error: Debe ejecutar este script desde zodioteca/" -ForegroundColor Red
    exit 1
}

# Verificar si magick está instalado (ImageMagick)
$magickInstalled = Get-Command magick -ErrorAction SilentlyContinue

if (-not $magickInstalled) {
    Write-Host "⚠️  ImageMagick no está instalado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para instalar ImageMagick:" -ForegroundColor Yellow
    Write-Host "  1. Con Chocolatey: choco install imagemagick" -ForegroundColor White
    Write-Host "  2. Con Scoop: scoop install imagemagick" -ForegroundColor White
    Write-Host "  3. Manual: https://imagemagick.org/script/download.php" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternativa: Puedes usar servicios online como:" -ForegroundColor Yellow
    Write-Host "  - https://squoosh.app/ (Google)" -ForegroundColor White
    Write-Host "  - https://tinypng.com/" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ ImageMagick detectado" -ForegroundColor Green
Write-Host ""

# Buscar archivos PNG
$pngFiles = Get-ChildItem -Path "public" -Filter "*.png" -Recurse

if ($pngFiles.Count -eq 0) {
    Write-Host "ℹ️  No se encontraron archivos PNG para optimizar" -ForegroundColor Cyan
    exit 0
}

Write-Host "📊 Archivos PNG encontrados: $($pngFiles.Count)" -ForegroundColor Cyan
Write-Host ""

$totalOriginalSize = 0
$totalWebpSize = 0

foreach ($file in $pngFiles) {
    $originalSize = $file.Length
    $totalOriginalSize += $originalSize
    
    $webpPath = $file.FullName -replace '\.png$', '.webp'
    $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart('\')
    
    Write-Host "🔄 Procesando: $relativePath" -ForegroundColor White
    Write-Host "   Tamaño original: $([math]::Round($originalSize / 1KB, 2)) KB" -ForegroundColor Gray
    
    # Convertir a WebP con calidad 85
    & magick convert $file.FullName -quality 85 $webpPath
    
    if (Test-Path $webpPath) {
        $webpSize = (Get-Item $webpPath).Length
        $totalWebpSize += $webpSize
        $savings = [math]::Round((($originalSize - $webpSize) / $originalSize) * 100, 1)
        
        Write-Host "   ✅ WebP creado: $([math]::Round($webpSize / 1KB, 2)) KB (ahorro: $savings%)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error al crear WebP" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Resumen
Write-Host "📈 RESUMEN DE OPTIMIZACIÓN" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "Archivos procesados: $($pngFiles.Count)" -ForegroundColor White
Write-Host "Tamaño original total: $([math]::Round($totalOriginalSize / 1KB, 2)) KB" -ForegroundColor White
Write-Host "Tamaño WebP total: $([math]::Round($totalWebpSize / 1KB, 2)) KB" -ForegroundColor White
$totalSavings = [math]::Round((($totalOriginalSize - $totalWebpSize) / $totalOriginalSize) * 100, 1)
Write-Host "Ahorro total: $totalSavings% 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Próximo paso:" -ForegroundColor Yellow
Write-Host "   Actualiza las referencias en el código para usar .webp" -ForegroundColor White
Write-Host "   Ejemplo: <img src='icon.png' /> → <img src='icon.webp' />" -ForegroundColor White
Write-Host ""
