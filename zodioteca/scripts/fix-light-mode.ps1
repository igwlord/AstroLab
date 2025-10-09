# 🎨 Script de Corrección de Modo Claro - AstroLab
# Este script aplica los cambios para un modo claro funcional con paleta pastel

Write-Host "🎨 Iniciando corrección de Modo Claro..." -ForegroundColor Cyan
Write-Host ""

$baseDir = "c:\Users\juego\OneDrive\Escritorio\aaaa\AstroLab\zodioteca"
$srcDir = "$baseDir\src"

# Contador de cambios
$changesCount = 0

Write-Host "📋 Fase 1: Auditoría previa..." -ForegroundColor Yellow
Write-Host ""

# Función para contar ocurrencias
function Count-Pattern {
    param($pattern, $path)
    $results = Get-ChildItem -Path $path -Recurse -Include *.tsx,*.ts,*.css -ErrorAction SilentlyContinue |
        Select-String -Pattern $pattern -CaseSensitive
    return $results.Count
}

# Estadísticas pre-fix
$darkClassesCount = Count-Pattern "dark:" $srcDir
$hardcodedBgCount = Count-Pattern "bg-\w+-\d{3}" $srcDir
$gradientCount = Count-Pattern "bg-gradient-to" $srcDir

Write-Host "✓ Clases dark: encontradas: $darkClassesCount" -ForegroundColor Green
Write-Host "✓ Fondos hardcoded encontrados: $hardcodedBgCount" -ForegroundColor Green
Write-Host "✓ Gradientes encontrados: $gradientCount" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Los cambios se aplicarán manualmente a los siguientes archivos:" -ForegroundColor Cyan
Write-Host ""

$filesToFix = @(
    @{
        Path = "src\components\StarryBackground.tsx"
        Description = "✅ CRÍTICO - Fondo principal de la aplicación"
        Changes = @(
            "Línea 11: Agregar gradiente pastel para modo claro"
            "Agregar useTheme hook"
            "Condicional para dark/light background"
        )
    },
    @{
        Path = "src\components\NatalChartWheelPro.tsx"
        Description = "✅ CRÍTICO - Fondo de la rueda natal"
        Changes = @(
            "Línea 1001-1004: SVG radialGradient condicional"
            "Línea 1060-1063: SVG zoom gradient condicional"
            "Agregar useTheme import"
            "Colores: light = #FFF8F5 → #FFE5D9 → #D4F1F4 → #F8E6F1"
        )
    },
    @{
        Path = "src\components\NatalChartFormSimple.tsx"
        Description = "✅ ALTA - Formulario principal"
        Changes = @(
            "Inputs: bg-white/10 → dark:bg-white/10 bg-[#FFE5D9]/80"
            "Text: text-white → dark:text-white text-gray-800"
            "Borders: border-white/20 → dark:border-white/20 border-[#E2E8F0]"
            "Labels: text-white/90 → dark:text-white/90 text-gray-700"
        )
    },
    @{
        Path = "src\components\PositionsTable.tsx"
        Description = "✅ MEDIA - Tabla de posiciones"
        Changes = @(
            "Revisar todos los dark: classes existentes"
            "Agregar dark: donde falte"
            "Hover states: dark:hover:bg-purple-900/20 hover:bg-[#FFE5D9]/30"
        )
    },
    @{
        Path = "src\components\DominancesTable.tsx"
        Description = "✅ MEDIA - Tabla de dominancias"
        Changes = @(
            "Cards: dark:bg-gray-900 bg-white/95"
            "Borders: dark:border-purple-700 border-[#FDD4C1]"
            "Text headers: dark:text-purple-100 text-purple-800"
        )
    },
    @{
        Path = "src\components\AspectsTableGrid.tsx"
        Description = "✅ MEDIA - Grid de aspectos"
        Changes = @(
            "Modal zoom background"
            "Table cells con modo claro"
        )
    },
    @{
        Path = "src\components\Navbar.tsx"
        Description = "✅ MEDIA - Navegación principal"
        Changes = @(
            "Background: dark:bg-gray-900/95 bg-white/95"
            "Links: dark:text-white text-gray-800"
            "Hover: dark:bg-purple-700 bg-[#FFE5D9]"
        )
    },
    @{
        Path = "src\components\AccordionSection.tsx"
        Description = "✅ BAJA - Acordeones"
        Changes = @(
            "Open state: usar gradientes pasteles"
            "from-blue-100 to-cyan-100 (ya está bien para claro)"
            "Solo revisar que dark: esté presente"
        )
    },
    @{
        Path = "src\App.tsx"
        Description = "✅ BAJA - Loading spinner"
        Changes = @(
            "Línea 40: Suspense fallback con bg pastel"
            "dark:from-gray-900 from-[#FFE5D9]"
        )
    }
)

foreach ($file in $filesToFix) {
    Write-Host "📄 $($file.Path)" -ForegroundColor Magenta
    Write-Host "   $($file.Description)" -ForegroundColor White
    foreach ($change in $file.Changes) {
        Write-Host "   - $change" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host ""
Write-Host "⚠️  IMPORTANTE - ESTE SCRIPT NO MODIFICA ARCHIVOS AUTOMÁTICAMENTE" -ForegroundColor Red
Write-Host "⚠️  Los cambios deben aplicarse manualmente o con Copilot" -ForegroundColor Red
Write-Host ""

Write-Host "🎨 Paleta de colores a usar:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   🍑 Durazno:" -ForegroundColor White
Write-Host "      #FFF8F5 (muy claro), #FFE5D9 (claro), #FDD4C1, #FBC4AB" -ForegroundColor Gray
Write-Host ""
Write-Host "   🌊 Verde Agua:" -ForegroundColor White
Write-Host "      #F0FAFB (muy claro), #D4F1F4 (claro), #B8E6E9, #A7D8DC" -ForegroundColor Gray
Write-Host ""
Write-Host "   💗 Magenta Pastel:" -ForegroundColor White
Write-Host "      #FDF5FB (muy claro), #F8E6F1 (claro), #F3D5E7, #EDB8DB" -ForegroundColor Gray
Write-Host ""
Write-Host "   🌸 Rosa:" -ForegroundColor White
Write-Host "      #FFF9F8 (muy claro), #FFE4E1 (claro), #FFD1DC, #FFC0CB" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Principios de diseño:" -ForegroundColor Yellow
Write-Host "   1. Mantener modo oscuro INTACTO" -ForegroundColor White
Write-Host "   2. NO tocar colores de frecuencias/aspectos/glosario" -ForegroundColor White
Write-Host "   3. Usar gradientes suaves" -ForegroundColor White
Write-Host "   4. Asegurar contraste WCAG AA (4.5:1)" -ForegroundColor White
Write-Host "   5. Textos oscuros (#2D3748, #4A5568) para legibilidad" -ForegroundColor White
Write-Host ""

Write-Host "✅ Auditoría completada. Revisar audit-light-mode.md para detalles." -ForegroundColor Green
Write-Host ""

# Crear archivo de referencia rápida
$quickRef = @"
# 🎨 Referencia Rápida - Clases Tailwind para Modo Claro

## Patrones Comunes

### Fondos
\`\`\`tsx
// Fondo principal
dark:bg-gray-900 bg-[#FFF8F5]

// Cards
dark:bg-gray-800 bg-white/95

// Inputs
dark:bg-white/10 bg-[#FFE5D9]/80

// Gradientes
dark:from-purple-900 from-[#FFE5D9] dark:to-blue-900 to-[#D4F1F4]
\`\`\`

### Textos
\`\`\`tsx
// Títulos
dark:text-white text-gray-800

// Subtítulos
dark:text-purple-100 text-purple-800

// Cuerpo
dark:text-gray-300 text-gray-700

// Muted
dark:text-gray-400 text-gray-500
\`\`\`

### Bordes
\`\`\`tsx
dark:border-purple-700 border-[#FDD4C1]
dark:border-white/20 border-gray-200
\`\`\`

### Hover States
\`\`\`tsx
dark:hover:bg-purple-900/20 hover:bg-[#FFE5D9]/50
dark:hover:text-white hover:text-purple-800
\`\`\`

## SVG Gradients

### Rueda Natal - Modo Oscuro
\`\`\`tsx
<radialGradient id="bg-gradient-dark">
  <stop offset="0%" stopColor="#1a1a2e" />
  <stop offset="100%" stopColor="#0a0a18" />
</radialGradient>
\`\`\`

### Rueda Natal - Modo Claro
\`\`\`tsx
<radialGradient id="bg-gradient-light">
  <stop offset="0%" stopColor="#FFF8F5" />
  <stop offset="30%" stopColor="#FFE5D9" />
  <stop offset="70%" stopColor="#D4F1F4" />
  <stop offset="100%" stopColor="#F8E6F1" />
</radialGradient>
\`\`\`

## Testing

Después de cada cambio:
1. Toggle dark/light mode
2. Verificar legibilidad de textos
3. Probar hover/focus states
4. Validar en móvil
5. Generar PDF de prueba
"@

$quickRef | Out-File -FilePath "$baseDir\scripts\light-mode-reference.md" -Encoding UTF8
Write-Host "📄 Creado: scripts\light-mode-reference.md" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Revisar audit-light-mode.md" -ForegroundColor White
Write-Host "   2. Aplicar cambios con GitHub Copilot" -ForegroundColor White
Write-Host "   3. Usar light-mode-reference.md como guía" -ForegroundColor White
Write-Host "   4. Testar exhaustivamente" -ForegroundColor White
Write-Host "   5. Commit cambios a Git" -ForegroundColor White
Write-Host ""

Write-Host "✨ Script completado!" -ForegroundColor Green
