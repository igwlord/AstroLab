# Script de Limpieza - Fase 2 (ALTA PRIORIDAD)
# Elimina páginas de test del proyecto AstroLab

Write-Host "🧹 AUDITORÍA DE LIMPIEZA - FASE 2 (ALTA PRIORIDAD)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "src/pages")) {
    Write-Host "❌ Error: Debe ejecutar este script desde la raíz del proyecto zodioteca" -ForegroundColor Red
    exit 1
}

Write-Host "📊 Páginas de Test a eliminar:" -ForegroundColor Yellow
Write-Host "-------------------------------" -ForegroundColor Yellow

# Archivos de test a eliminar
$testPages = Get-ChildItem -Path "src/pages/Test*.tsx"

if ($testPages.Count -eq 0) {
    Write-Host "✓ No se encontraron páginas de test" -ForegroundColor Green
    exit 0
}

$totalLines = 0
foreach ($page in $testPages) {
    $lines = (Get-Content $page.FullName | Measure-Object -Line).Lines
    $totalLines += $lines
    Write-Host "  • $($page.Name) ($lines líneas)" -ForegroundColor White
}

Write-Host ""
Write-Host "📉 Impacto total: $($testPages.Count) archivos, $totalLines líneas" -ForegroundColor Cyan
Write-Host ""

# Advertencia sobre App.tsx
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   Este script también actualizará src/App.tsx para eliminar:" -ForegroundColor White
Write-Host "   • Imports de páginas Test (líneas 12-23)" -ForegroundColor White
Write-Host "   • Rutas de páginas Test (líneas 109-188)" -ForegroundColor White
Write-Host ""

Write-Host "📋 Impacto en producción:" -ForegroundColor Yellow
Write-Host "   ✓ Se eliminarán 12 rutas públicas: /test/*" -ForegroundColor Green
Write-Host "   ✓ Build más ligero (~80KB menos)" -ForegroundColor Green
Write-Host "   ✓ Menos código en producción" -ForegroundColor Green
Write-Host ""

# Preguntar confirmación
$confirmation = Read-Host "¿Desea continuar con la eliminación? (S/N)"

if ($confirmation -ne "S" -and $confirmation -ne "s") {
    Write-Host ""
    Write-Host "❌ Operación cancelada por el usuario" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🗑️  Eliminando páginas de test..." -ForegroundColor Cyan
Write-Host ""

$deletedCount = 0
foreach ($page in $testPages) {
    if (Test-Path ".git") {
        git rm $page.FullName 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ git rm $($page.Name)" -ForegroundColor Green
        } else {
            Remove-Item $page.FullName -Force
            Write-Host "  ✓ Eliminado $($page.Name)" -ForegroundColor Green
        }
    } else {
        Remove-Item $page.FullName -Force
        Write-Host "  ✓ Eliminado $($page.Name)" -ForegroundColor Green
    }
    $deletedCount++
}

Write-Host ""
Write-Host "📝 Actualizando App.tsx..." -ForegroundColor Cyan

# Leer App.tsx
$appPath = "src/App.tsx"
$appContent = Get-Content $appPath -Raw

# Eliminar imports de Test pages (líneas individuales)
$testPageNames = $testPages | ForEach-Object { $_.BaseName }
foreach ($pageName in $testPageNames) {
    $appContent = $appContent -replace "import $pageName from '\./pages/$pageName';\r?\n", ""
}

# Eliminar rutas de Test pages
# Patrón: <Route path="/test/..." element={...TestPage />} />
$appContent = $appContent -replace '<Route\s+path="/test/[^"]+"\s+element=\{[^}]+Test\w+Page[^}]+\}\s*/>\r?\n', ''

# Guardar App.tsx actualizado
Set-Content -Path $appPath -Value $appContent -NoNewline

Write-Host "  ✓ App.tsx actualizado" -ForegroundColor Green
Write-Host ""

Write-Host "✅ FASE 2 COMPLETADA" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host "  • Páginas eliminadas: $deletedCount" -ForegroundColor White
Write-Host "  • Líneas eliminadas: ~$totalLines" -ForegroundColor White
Write-Host "  • App.tsx actualizado" -ForegroundColor White
Write-Host ""

Write-Host "📝 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Verificar compilación: npm run build" -ForegroundColor White
Write-Host "   2. Revisar cambios en App.tsx: git diff src/App.tsx" -ForegroundColor White
Write-Host "   3. Hacer commit: git commit -m '🧹 chore: Eliminar páginas de test (Fase 2)'" -ForegroundColor White
Write-Host "   4. Probar en local: npm run dev" -ForegroundColor White
Write-Host "   5. Deploy a Netlify: git push origin main" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  VERIFICAR:" -ForegroundColor Yellow
Write-Host "   • Las rutas principales (/dashboard, /natal-chart, /glossary) siguen funcionando" -ForegroundColor White
Write-Host "   • No hay errores de compilación" -ForegroundColor White
Write-Host "   • Las rutas /test/* ya no existen (404 esperado)" -ForegroundColor White
Write-Host ""
