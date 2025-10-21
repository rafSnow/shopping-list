# Script de Verificação - Shopping List App
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SHOPPING LIST - VERIFICAÇÃO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0

Write-Host "1. VERIFICANDO ESTRUTURA..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path ".\mobile") {
    Write-Host "  [OK] Pasta mobile" -ForegroundColor Green
}
else {
    Write-Host "  [ERRO] Pasta mobile não encontrada" -ForegroundColor Red
    $errors++
}

if (Test-Path ".\mobile\package.json") {
    Write-Host "  [OK] package.json" -ForegroundColor Green
}
else {
    Write-Host "  [ERRO] package.json não encontrado" -ForegroundColor Red
    $errors++
}

if (Test-Path ".\mobile\.env") {
    Write-Host "  [OK] .env configurado" -ForegroundColor Green
}
else {
    Write-Host "  [AVISO] .env não encontrado - copie de .env.example" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. VERIFICANDO DEPENDÊNCIAS..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path ".\mobile\node_modules") {
    Write-Host "  [OK] node_modules instalado" -ForegroundColor Green
    
    if (Test-Path ".\mobile\node_modules\firebase") {
        Write-Host "  [OK] Firebase SDK" -ForegroundColor Green
    }
    else {
        Write-Host "  [ERRO] Firebase SDK não instalado" -ForegroundColor Red
        $errors++
    }
    
    if (Test-Path ".\mobile\node_modules\expo") {
        Write-Host "  [OK] Expo" -ForegroundColor Green
    }
    else {
        Write-Host "  [ERRO] Expo não instalado" -ForegroundColor Red
        $errors++
    }
}
else {
    Write-Host "  [ERRO] node_modules não instalado" -ForegroundColor Red
    Write-Host "         Execute: cd mobile; npm install" -ForegroundColor Cyan
    $errors++
}

Write-Host ""
Write-Host "3. VERIFICANDO CÓDIGO..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path ".\mobile\App.tsx") {
    Write-Host "  [OK] App.tsx" -ForegroundColor Green
}
else {
    Write-Host "  [ERRO] App.tsx não encontrado" -ForegroundColor Red
    $errors++
}

if (Test-Path ".\mobile\src\services\firebase.ts") {
    Write-Host "  [OK] firebase.ts service" -ForegroundColor Green
}
else {
    Write-Host "  [ERRO] firebase.ts não encontrado" -ForegroundColor Red
    $errors++
}

if (Test-Path ".\mobile\src\screens\HomeScreen.tsx") {
    Write-Host "  [OK] HomeScreen" -ForegroundColor Green
}
else {
    Write-Host "  [ERRO] HomeScreen não encontrado" -ForegroundColor Red
    $errors++
}

Write-Host ""
Write-Host "4. VERIFICANDO FERRAMENTAS..." -ForegroundColor Yellow
Write-Host ""

$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCheck) {
    $nodeVersion = node --version
    Write-Host "  [OK] Node.js $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "  [ERRO] Node.js não instalado" -ForegroundColor Red
    $errors++
}

$npmCheck = Get-Command npm -ErrorAction SilentlyContinue
if ($npmCheck) {
    $npmVersion = npm --version
    Write-Host "  [OK] npm $npmVersion" -ForegroundColor Green
}
else {
    Write-Host "  [ERRO] npm não instalado" -ForegroundColor Red
    $errors++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           RESULTADO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($errors -eq 0) {
    Write-Host "✓ TUDO PRONTO PARA TESTAR!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. cd mobile" -ForegroundColor White
    Write-Host "  2. npx expo start" -ForegroundColor White
    Write-Host "  3. Escaneie QR code com Expo Go" -ForegroundColor White
}
else {
    Write-Host "✗ Encontrados $errors problemas" -ForegroundColor Red
    Write-Host ""
    Write-Host "Consulte: INICIO-RAPIDO.md e CHECKLIST-TESTES.md" -ForegroundColor Cyan
}

Write-Host ""
