# Script para identificar todos los alert(), confirm() y prompt() nativos del browser
# Autor: AstroLab Team
# Fecha: 2025-10-13

Write-Host "🔍 Buscando diálogos nativos del navegador en el código..." -ForegroundColor Cyan
Write-Host ""

$srcPath = Join-Path $PSScriptRoot "..\src"
$results = @()

# Buscar alert()
Write-Host "📢 Buscando alert()..." -ForegroundColor Yellow
$alerts = Get-ChildItem -Path $srcPath -Recurse -Include *.ts,*.tsx | 
    Select-String -Pattern "\balert\s*\(" | 
    ForEach-Object {
        [PSCustomObject]@{
            Type = "alert"
            File = $_.Path
            Line = $_.LineNumber
            Content = $_.Line.Trim()
        }
    }
$results += $alerts

# Buscar confirm()
Write-Host "❓ Buscando confirm()..." -ForegroundColor Yellow
$confirms = Get-ChildItem -Path $srcPath -Recurse -Include *.ts,*.tsx | 
    Select-String -Pattern "\bconfirm\s*\(" | 
    ForEach-Object {
        [PSCustomObject]@{
            Type = "confirm"
            File = $_.Path
            Line = $_.LineNumber
            Content = $_.Line.Trim()
        }
    }
$results += $confirms

# Buscar prompt()
Write-Host "✏️  Buscando prompt()..." -ForegroundColor Yellow
$prompts = Get-ChildItem -Path $srcPath -Recurse -Include *.ts,*.tsx | 
    Select-String -Pattern "\bprompt\s*\(" | 
    ForEach-Object {
        [PSCustomObject]@{
            Type = "prompt"
            File = $_.Path
            Line = $_.LineNumber
            Content = $_.Line.Trim()
        }
    }
$results += $prompts

# Mostrar resultados
Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "📊 RESUMEN DE RESULTADOS" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

$alertCount = ($results | Where-Object { $_.Type -eq "alert" }).Count
$confirmCount = ($results | Where-Object { $_.Type -eq "confirm" }).Count
$promptCount = ($results | Where-Object { $_.Type -eq "prompt" }).Count
$totalCount = $results.Count

Write-Host "Total encontrados: $totalCount" -ForegroundColor White
Write-Host "  • alert():   $alertCount" -ForegroundColor Red
Write-Host "  • confirm(): $confirmCount" -ForegroundColor Yellow
Write-Host "  • prompt():  $promptCount" -ForegroundColor Cyan
Write-Host ""

if ($totalCount -gt 0) {
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host "📝 DETALLE DE OCURRENCIAS" -ForegroundColor Magenta
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host ""
    
    $groupedResults = $results | Group-Object -Property File
    
    foreach ($group in $groupedResults) {
        $relativePath = $group.Name.Replace($srcPath, "src")
        Write-Host "📁 $relativePath" -ForegroundColor Green
        
        foreach ($item in $group.Group) {
            $typeColor = switch ($item.Type) {
                "alert" { "Red" }
                "confirm" { "Yellow" }
                "prompt" { "Cyan" }
            }
            Write-Host "   Línea $($item.Line): [$($item.Type)]" -ForegroundColor $typeColor -NoNewline
            Write-Host " $($item.Content)" -ForegroundColor Gray
        }
        Write-Host ""
    }
    
    # Exportar a archivo
    $reportPath = Join-Path $PSScriptRoot "browser-dialogs-report.txt"
    $results | Format-Table -AutoSize | Out-File $reportPath -Encoding UTF8
    Write-Host "💾 Reporte guardado en: $reportPath" -ForegroundColor Green
    Write-Host ""
    
    # Recomendaciones
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host "💡 RECOMENDACIONES" -ForegroundColor Magenta
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Se recomienda reemplazar estos diálogos nativos con:" -ForegroundColor White
    Write-Host "  1. Sistema de notificaciones toast personalizado" -ForegroundColor Cyan
    Write-Host "  2. Modales de confirmación con diseño propio" -ForegroundColor Cyan
    Write-Host "  3. Inputs personalizados en lugar de prompt()" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Beneficios:" -ForegroundColor White
    Write-Host "  ✓ Mejor UX y diseño consistente" -ForegroundColor Green
    Write-Host "  ✓ Animaciones y transiciones suaves" -ForegroundColor Green
    Write-Host "  ✓ Responsive y mobile-friendly" -ForegroundColor Green
    Write-Host "  ✓ Accesibilidad mejorada" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ ¡Excelente! No se encontraron diálogos nativos del navegador." -ForegroundColor Green
}

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Magenta
