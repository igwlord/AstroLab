# Script de Limpieza - Fase 1 (CRÍTICA)
# Elimina archivos obsoletos del proyecto AstroLab

Write-Host "🧹 AUDITORÍA DE LIMPIEZA - FASE 1 (CRÍTICA)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "src/pages")) {
    Write-Host "❌ Error: Debe ejecutar este script desde la raíz del proyecto zodioteca" -ForegroundColor Red
    exit 1
}

Write-Host "📊 Estado actual del proyecto:" -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Yellow

# Contar líneas de código actual
$currentLines = (Get-ChildItem -Path "src" -Include "*.ts","*.tsx" -Recurse | Get-Content | Measure-Object -Line).Lines
Write-Host "✓ Líneas de código actuales: $currentLines" -ForegroundColor White
Write-Host ""

# Archivos a eliminar
$filesToDelete = @(
    "src/pages/NatalChartPage.OLD.tsx",
    "src/pages/NewNatalChartPage.tsx",
    "src/services/astroCalculator.ts"
)

Write-Host "🗑️  Archivos a eliminar:" -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow

$totalLinesToDelete = 0

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        $lines = (Get-Content $file | Measure-Object -Line).Lines
        $totalLinesToDelete += $lines
        Write-Host "  ✓ $file ($lines líneas)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $file (no encontrado)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📉 Impacto estimado: -$totalLinesToDelete líneas" -ForegroundColor Cyan
Write-Host ""

# Verificar dependencias (imports rotos)
Write-Host "🔍 Verificando dependencias..." -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Yellow

$astroCalcRefs = Select-String -Path "src/**/*.ts","src/**/*.tsx" -Pattern "from.*astroCalculator" -Exclude "astroCalculator.ts" -ErrorAction SilentlyContinue

if ($astroCalcRefs) {
    Write-Host "⚠️  ADVERTENCIA: Se encontraron referencias a astroCalculator.ts:" -ForegroundColor Red
    $astroCalcRefs | ForEach-Object {
        Write-Host "    - $($_.Path):$($_.LineNumber)" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "    Archivos que necesitan actualización:" -ForegroundColor Yellow
    Write-Host "    • src/store/useSavedCharts.ts → cambiar a 'realAstroCalculator'" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✓ No se encontraron dependencias rotas" -ForegroundColor Green
    Write-Host ""
}

# Preguntar confirmación
Write-Host "⚠️  PRECAUCIÓN:" -ForegroundColor Yellow
Write-Host "   Esta acción eliminará 3 archivos ($totalLinesToDelete líneas de código)" -ForegroundColor White
Write-Host "   Se recomienda hacer commit antes de continuar" -ForegroundColor White
Write-Host ""

$confirmation = Read-Host "¿Desea continuar? (S/N)"

if ($confirmation -ne "S" -and $confirmation -ne "s") {
    Write-Host ""
    Write-Host "❌ Operación cancelada por el usuario" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🗑️  Eliminando archivos..." -ForegroundColor Cyan
Write-Host ""

$deletedFiles = 0
$deletedLines = 0

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        $lines = (Get-Content $file | Measure-Object -Line).Lines
        
        # Usar git rm si está en git
        if (Test-Path ".git") {
            git rm $file 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✓ git rm $file" -ForegroundColor Green
            } else {
                Remove-Item $file -Force
                Write-Host "  ✓ Eliminado $file (fuera de git)" -ForegroundColor Green
            }
        } else {
            Remove-Item $file -Force
            Write-Host "  ✓ Eliminado $file" -ForegroundColor Green
        }
        
        $deletedFiles++
        $deletedLines += $lines
    }
}

Write-Host ""
Write-Host "✅ FASE 1 COMPLETADA" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host "  • Archivos eliminados: $deletedFiles" -ForegroundColor White
Write-Host "  • Líneas eliminadas: $deletedLines" -ForegroundColor White
Write-Host ""

# Contar líneas después
$newLines = (Get-ChildItem -Path "src" -Include "*.ts","*.tsx" -Recurse | Get-Content | Measure-Object -Line).Lines
$savedLines = $currentLines - $newLines

Write-Host "📊 Resultado:" -ForegroundColor Cyan
Write-Host "  • Antes: $currentLines líneas" -ForegroundColor White
Write-Host "  • Después: $newLines líneas" -ForegroundColor White
Write-Host "  • Ahorro: -$savedLines líneas (-$('{0:N2}' -f (($savedLines / $currentLines) * 100))%)" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "   Si useSavedCharts.ts tiene errores de import, ejecute:" -ForegroundColor White
Write-Host "   • Cambiar import en src/store/useSavedCharts.ts" -ForegroundColor White
Write-Host "     De: import type { NatalChart } from '../services/astroCalculator';" -ForegroundColor Red
Write-Host "     A:  import type { NatalChart } from '../services/realAstroCalculator';" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Recomendaciones:" -ForegroundColor Yellow
Write-Host "   1. Verificar que el proyecto compile: npm run build" -ForegroundColor White
Write-Host "   2. Hacer commit: git commit -m '🧹 chore: Eliminar archivos obsoletos (Fase 1)'" -ForegroundColor White
Write-Host "   3. Continuar con Fase 2: scripts/cleanup-phase2.ps1" -ForegroundColor White
Write-Host ""
