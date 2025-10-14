#!/usr/bin/env pwsh
# 🚀 Script de Análisis Rápido de Performance
# Ejecutar: .\quick-audit.ps1

param(
    [switch]$Full,
    [switch]$Compare,
    [string]$BeforePath = "dist-before"
)

$ErrorActionPreference = "Continue"
$projectPath = "zodioteca"

# Colores
$colors = @{
    Title = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Info = "White"
    Highlight = "Magenta"
}

# Header
function Write-Header {
    param([string]$text)
    Write-Host ""
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Gray
    Write-Host " $text" -ForegroundColor $colors.Title
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Gray
    Write-Host ""
}

function Write-Section {
    param([string]$text)
    Write-Host ""
    Write-Host "─── $text" -ForegroundColor $colors.Info
    Write-Host ""
}

function Write-Metric {
    param(
        [string]$label,
        [string]$value,
        [string]$color = "White"
    )
    Write-Host ("{0,-30} {1}" -f $label, $value) -ForegroundColor $color
}

function Write-Check {
    param(
        [string]$label,
        [bool]$passed
    )
    $icon = if ($passed) { "✅" } else { "❌" }
    $color = if ($passed) { $colors.Success } else { $colors.Error }
    Write-Host "$icon $label" -ForegroundColor $color
}

# Navegar al proyecto
if (-not (Test-Path $projectPath)) {
    Write-Host "❌ Error: No se encuentra el directorio '$projectPath'" -ForegroundColor $colors.Error
    exit 1
}

Set-Location $projectPath

Write-Header "🔍 Auditoría Rápida de Performance - AstroLab"

# ═══════════════════════════════════════════
# 1. Información del Proyecto
# ═══════════════════════════════════════════

Write-Section "📦 Información del Proyecto"

$packageJson = Get-Content "package.json" | ConvertFrom-Json
Write-Metric "Nombre:" $packageJson.name
Write-Metric "Versión:" $packageJson.version

# Contar archivos
$totalFiles = (Get-ChildItem -Path "src" -Recurse -File -Include "*.tsx","*.ts").Count
$componentFiles = (Get-ChildItem -Path "src/components" -File -Include "*.tsx" -ErrorAction SilentlyContinue).Count
$pageFiles = (Get-ChildItem -Path "src/pages" -File -Include "*.tsx" -ErrorAction SilentlyContinue).Count

Write-Metric "Total archivos TS/TSX:" $totalFiles
Write-Metric "Componentes:" $componentFiles
Write-Metric "Páginas:" $pageFiles

# ═══════════════════════════════════════════
# 2. Análisis de Bundle
# ═══════════════════════════════════════════

Write-Section "🔨 Compilando proyecto..."

$buildOutput = npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en la compilación" -ForegroundColor $colors.Error
    Write-Host $buildOutput
    exit 1
}

Write-Host "✅ Compilación exitosa" -ForegroundColor $colors.Success

Write-Section "📊 Análisis de Bundle"

if (-not (Test-Path "dist/assets")) {
    Write-Host "❌ No se encontró el directorio dist/assets" -ForegroundColor $colors.Error
    exit 1
}

# Analizar archivos JS
$jsFiles = Get-ChildItem -Path "dist/assets/*.js" | Sort-Object Length -Descending
$totalJsSize = ($jsFiles | Measure-Object -Property Length -Sum).Sum
$totalJsSizeMB = [math]::Round($totalJsSize / 1MB, 2)

Write-Metric "Total JS:" "$totalJsSizeMB MB" $(if ($totalJsSizeMB -gt 2) { $colors.Error } elseif ($totalJsSizeMB -gt 1.5) { $colors.Warning } else { $colors.Success })
Write-Metric "Archivos JS:" $jsFiles.Count

# Top 10 archivos más grandes
Write-Host ""
Write-Host "🔝 Top 10 Archivos Más Grandes:" -ForegroundColor $colors.Highlight
Write-Host ""

$jsFiles | Select-Object -First 10 | ForEach-Object {
    $sizeKB = [math]::Round($_.Length / 1KB, 2)
    $color = if ($sizeKB -gt 200) { $colors.Error }
             elseif ($sizeKB -gt 100) { $colors.Warning }
             else { $colors.Success }
    
    Write-Host ("{0,-65} {1,10:N2} KB" -f $_.Name.Substring(0, [Math]::Min(65, $_.Name.Length)), $sizeKB) -ForegroundColor $color
}

# Archivos problemáticos
Write-Host ""
Write-Host "⚠️  Chunks Críticos (>100 KB):" -ForegroundColor $colors.Warning
$criticalChunks = $jsFiles | Where-Object { $_.Length / 1KB -gt 100 }
if ($criticalChunks.Count -gt 0) {
    $criticalChunks | ForEach-Object {
        $sizeKB = [math]::Round($_.Length / 1KB, 2)
        Write-Host "   • $($_.Name): $sizeKB KB" -ForegroundColor $colors.Error
    }
} else {
    Write-Host "   ✅ No hay chunks mayores a 100 KB" -ForegroundColor $colors.Success
}

# Analizar CSS
$cssFiles = Get-ChildItem -Path "dist/assets/*.css" -ErrorAction SilentlyContinue
$totalCssSize = ($cssFiles | Measure-Object -Property Length -Sum).Sum
$totalCssSizeKB = [math]::Round($totalCssSize / 1KB, 2)

Write-Host ""
Write-Metric "Total CSS:" "$totalCssSizeKB KB"

# Analizar WASM y otros
$wasmFiles = Get-ChildItem -Path "dist/assets/*.wasm" -ErrorAction SilentlyContinue
if ($wasmFiles) {
    $wasmSize = [math]::Round(($wasmFiles | Measure-Object -Property Length -Sum).Sum / 1KB, 2)
    Write-Metric "WASM:" "$wasmSize KB"
}

# ═══════════════════════════════════════════
# 3. Análisis de Lazy Loading
# ═══════════════════════════════════════════

Write-Section "🚀 Análisis de Lazy Loading"

# Contar lazy imports
$lazyImports = Select-String -Path "src/**/*.tsx" -Pattern "lazy\(\s*\(\s*\)\s*=>" -AllMatches
$lazyCount = $lazyImports.Count

Write-Metric "Lazy imports encontrados:" $lazyCount $(if ($lazyCount -gt 25) { $colors.Success } elseif ($lazyCount -gt 15) { $colors.Warning } else { $colors.Error })

# Buscar imports problemáticos
$pdfImports = Select-String -Path "src/**/*.tsx","src/**/*.ts" -Pattern "from\s+['\`"]jspdf['\`"]" -AllMatches
$canvasImports = Select-String -Path "src/**/*.tsx","src/**/*.ts" -Pattern "from\s+['\`"]html2canvas['\`"]" -AllMatches

if ($pdfImports.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ jsPDF imports estáticos encontrados: $($pdfImports.Count)" -ForegroundColor $colors.Error
    Write-Host "   Usar dynamic import para ahorrar ~391 KB" -ForegroundColor $colors.Warning
}

if ($canvasImports.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ html2canvas imports estáticos encontrados: $($canvasImports.Count)" -ForegroundColor $colors.Error
    Write-Host "   Usar dynamic import para ahorrar ~196 KB" -ForegroundColor $colors.Warning
}

# ═══════════════════════════════════════════
# 4. Checklist de Optimización
# ═══════════════════════════════════════════

Write-Section "✅ Checklist de Optimización"

$checks = @(
    @{
        Label = "Bundle inicial < 1.5 MB"
        Passed = $totalJsSizeMB -lt 1.5
    },
    @{
        Label = "Lazy imports > 25"
        Passed = $lazyCount -gt 25
    },
    @{
        Label = "Sin imports estáticos de PDF"
        Passed = ($pdfImports.Count -eq 0 -and $canvasImports.Count -eq 0)
    },
    @{
        Label = "No hay chunks > 200 KB"
        Passed = ($jsFiles | Where-Object { $_.Length / 1KB -gt 200 }).Count -eq 0
    },
    @{
        Label = "CSS < 50 KB"
        Passed = $totalCssSizeKB -lt 50
    }
)

$passedChecks = 0
foreach ($check in $checks) {
    Write-Check $check.Label $check.Passed
    if ($check.Passed) { $passedChecks++ }
}

$percentage = [math]::Round(($passedChecks / $checks.Count) * 100)
Write-Host ""
Write-Host "Optimización: $passedChecks/$($checks.Count) checks pasados ($percentage%)" -ForegroundColor $(if ($percentage -gt 80) { $colors.Success } elseif ($percentage -gt 50) { $colors.Warning } else { $colors.Error })

# ═══════════════════════════════════════════
# 5. Comparación (si se especifica)
# ═══════════════════════════════════════════

if ($Compare -and (Test-Path "../$BeforePath")) {
    Write-Section "📈 Comparación Antes/Después"
    
    $beforeJs = Get-ChildItem -Path "../$BeforePath/assets/*.js"
    $beforeSize = [math]::Round(($beforeJs | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
    
    Write-Metric "ANTES:" "$beforeSize MB" $colors.Warning
    Write-Metric "DESPUÉS:" "$totalJsSizeMB MB" $colors.Info
    
    $diff = $beforeSize - $totalJsSizeMB
    $diffPercent = [math]::Round(($diff / $beforeSize) * 100, 2)
    
    if ($diff -gt 0) {
        Write-Host ""
        Write-Host "✅ MEJORA: -$diff MB (-$diffPercent%)" -ForegroundColor $colors.Success
    } else {
        Write-Host ""
        Write-Host "⚠️  Bundle aumentó: +$([math]::Abs($diff)) MB" -ForegroundColor $colors.Error
    }
}

# ═══════════════════════════════════════════
# 6. Recomendaciones
# ═══════════════════════════════════════════

Write-Section "💡 Recomendaciones"

$recommendations = @()

if ($totalJsSizeMB -gt 2) {
    $recommendations += "🔴 CRÍTICO: Bundle muy grande (>2 MB). Implementar lazy loading agresivo."
}

if (($jsFiles | Where-Object { $_.Name -like "*glossary-grids*" -and $_.Length / 1KB -gt 300 }).Count -gt 0) {
    $recommendations += "🔴 CRÍTICO: Fragmentar glossary grids bundle (ahorro: ~460 KB)"
}

if ($pdfImports.Count -gt 0 -or $canvasImports.Count -gt 0) {
    $recommendations += "🔴 CRÍTICO: Usar dynamic import para PDF libraries (ahorro: ~588 KB)"
}

if ($lazyCount -lt 20) {
    $recommendations += "🟡 Agregar más lazy imports (objetivo: >25)"
}

if (($jsFiles | Where-Object { $_.Length / 1KB -gt 200 }).Count -gt 0) {
    $recommendations += "🟡 Fragmentar chunks grandes (objetivo: <200 KB por chunk)"
}

if ($recommendations.Count -eq 0) {
    Write-Host "✅ ¡Excelente! No hay recomendaciones críticas." -ForegroundColor $colors.Success
} else {
    foreach ($rec in $recommendations) {
        Write-Host "   $rec" -ForegroundColor $colors.Warning
    }
}

# ═══════════════════════════════════════════
# 7. Próximos Pasos
# ═══════════════════════════════════════════

Write-Section "🎯 Próximos Pasos"

Write-Host "1. 📖 Leer GUIA_IMPLEMENTACION.md" -ForegroundColor $colors.Info
Write-Host "2. 🔧 Implementar optimizaciones prioritarias" -ForegroundColor $colors.Info
Write-Host "3. 🧪 Ejecutar este script nuevamente con -Compare" -ForegroundColor $colors.Info
Write-Host "4. 🚀 Ejecutar Lighthouse: npm run lighthouse" -ForegroundColor $colors.Info

# ═══════════════════════════════════════════
# Footer
# ═══════════════════════════════════════════

Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Gray
Write-Host " Auditoría completada - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor $colors.Success
Write-Host "═══════════════════════════════════════════" -ForegroundColor Gray
Write-Host ""

# Volver al directorio anterior
Set-Location ..

# Retornar código basado en estado
if ($totalJsSizeMB -lt 1.5 -and $passedChecks -ge 4) {
    exit 0
} else {
    exit 1
}
