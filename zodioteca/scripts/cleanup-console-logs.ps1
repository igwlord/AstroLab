# Console.log Cleanup Script
# Replaces all console.log/warn/error with logger utility

$files = @(
    "src\services\exercises\rulesEngine.ts",
    "src\store\useExercisePlanStore.ts",
    "src\pages\ExercisePlanPage.tsx",
    "src\hooks\useExercisesOnboarding.ts",
    "src\services\pdfExportService.ts",
    "src\components\AuthModal.tsx",
    "src\utils\sw-update-prompt.tsx"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot ".." $file
    
    if (Test-Path $fullPath) {
        Write-Host "Processing: $file" -ForegroundColor Cyan
        
        $content = Get-Content $fullPath -Raw
        $originalLength = $content.Length
        
        # Replace console.log with logger.log
        $content = $content -replace 'console\.log\(', 'logger.log('
        $content = $content -replace 'console\.warn\(', 'logger.warn('
        $content = $content -replace 'console\.error\(', 'logger.error('
        $content = $content -replace 'console\.info\(', 'logger.info('
        $content = $content -replace 'console\.debug\(', 'logger.debug('
        
        # Check if we need to add logger import
        if ($content -match 'logger\.(log|warn|error|info|debug)\(' -and 
            $content -notmatch "import.*logger.*from") {
            
            # Find the last import statement
            $lines = $content -split "`r?`n"
            $lastImportIndex = -1
            
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i] -match "^import\s+") {
                    $lastImportIndex = $i
                }
            }
            
            if ($lastImportIndex -ge 0) {
                # Calculate relative path to logger
                $depth = ($file -split '\\').Count - 2  # Subtract file itself and src
                $relativePath = '../' * $depth + 'utils/logger'
                
                # Insert import after last import
                $lines = $lines[0..$lastImportIndex] + 
                         "import { logger } from '$relativePath';" + 
                         $lines[($lastImportIndex+1)..($lines.Count-1)]
                
                $content = $lines -join "`n"
                Write-Host "  ✅ Added logger import" -ForegroundColor Green
            }
        }
        
        if ($content.Length -ne $originalLength) {
            Set-Content $fullPath $content -NoNewline
            Write-Host "  ✅ Updated console.* calls" -ForegroundColor Green
        } else {
            Write-Host "  ℹ️  No changes needed" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ❌ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✨ Console cleanup complete!" -ForegroundColor Green
Write-Host "Run 'npm run lint' to verify changes" -ForegroundColor Cyan
