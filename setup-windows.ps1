# 🕊️ Verso Diário - Script de Setup Automático para Windows
# Execute este script no PowerShell como Administrador

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🕊️  VERSO DIÁRIO - Setup Automático Windows" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verifica se está na pasta correta
if (-Not (Test-Path "app.json")) {
    Write-Host "❌ ERRO: Arquivo app.json não encontrado!" -ForegroundColor Red
    Write-Host "   Certifique-se de estar na pasta raiz do projeto." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Exemplo:" -ForegroundColor Yellow
    Write-Host "   cd C:\Users\SeuNome\Documents\verso-diario" -ForegroundColor Yellow
    Write-Host "   .\setup-windows.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Pasta do projeto detectada!" -ForegroundColor Green
Write-Host ""

# Passo 1: Limpeza
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "PASSO 1: Limpando cache e pastas antigas..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$foldersToRemove = @('.expo', 'android', 'ios', 'node_modules', '.metro')
foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        Write-Host "🗑️  Removendo $folder..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force $folder -ErrorAction SilentlyContinue
    } else {
        Write-Host "⏭️  $folder não existe (ok)" -ForegroundColor Gray
    }
}

if (Test-Path "package-lock.json") {
    Write-Host "🗑️  Removendo package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "✅ Limpeza completa finalizada!" -ForegroundColor Green
Write-Host ""

# Passo 2: Verificar Node.js
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "PASSO 2: Verificando Node.js..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js versão: $nodeVersion" -ForegroundColor Green
    
    $npmVersion = npm -v
    Write-Host "✅ npm versão: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Node.js não instalado!" -ForegroundColor Red
    Write-Host "   Instale Node.js 20.x de: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Passo 3: Verificar app.json
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "PASSO 3: Verificando app.json..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$appJson = Get-Content "app.json" -Raw | ConvertFrom-Json

if ($appJson.expo.plugins -contains "expo-router") {
    Write-Host "✅ Plugin expo-router encontrado!" -ForegroundColor Green
} else {
    Write-Host "⚠️  AVISO: Plugin expo-router não encontrado em app.json" -ForegroundColor Yellow
    Write-Host "   Isso pode causar o erro 'main has not been registered'" -ForegroundColor Yellow
}

if ($appJson.expo.entryPoint) {
    Write-Host "⚠️  AVISO: entryPoint manual detectado em app.json" -ForegroundColor Yellow
    Write-Host "   Valor: $($appJson.expo.entryPoint)" -ForegroundColor Yellow
    Write-Host "   Isso pode causar conflitos com expo-router!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   RECOMENDAÇÃO: Remova a linha 'entryPoint' de app.json" -ForegroundColor Yellow
} else {
    Write-Host "✅ Sem entryPoint manual (correto!)" -ForegroundColor Green
}

Write-Host ""

# Passo 4: Instalar dependências
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "PASSO 4: Instalando dependências..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "⏳ Isso pode demorar 2-5 minutos..." -ForegroundColor Yellow
Write-Host ""

npm install --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ ERRO ao instalar dependências!" -ForegroundColor Red
    Write-Host "   Execute manualmente:" -ForegroundColor Yellow
    Write-Host "   npm install --legacy-peer-deps" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Passo 5: Verificar assets
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "PASSO 5: Verificando assets..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$requiredAssets = @(
    @{Path="assets/icon.png"; MinSize=1000},
    @{Path="assets/splash.png"; MinSize=1000},
    @{Path="assets/adaptive-icon.png"; MinSize=1000}
)

$assetErrors = 0
foreach ($asset in $requiredAssets) {
    if (Test-Path $asset.Path) {
        $size = (Get-Item $asset.Path).Length
        if ($size -gt $asset.MinSize) {
            $sizeKB = [math]::Round($size / 1KB, 2)
            Write-Host "✅ $($asset.Path) ($sizeKB KB)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $($asset.Path) existe mas está vazio ou muito pequeno!" -ForegroundColor Yellow
            $assetErrors++
        }
    } else {
        Write-Host "❌ $($asset.Path) não encontrado!" -ForegroundColor Red
        $assetErrors++
    }
}

if ($assetErrors -gt 0) {
    Write-Host ""
    Write-Host "⚠️  AVISO: Assets faltando ou inválidos!" -ForegroundColor Yellow
    Write-Host "   Isso pode causar crash no APK." -ForegroundColor Yellow
    Write-Host "   Baixe novamente o projeto completo do Replit." -ForegroundColor Yellow
}

Write-Host ""

# Passo 6: Instruções finais
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ SETUP CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Inicie o Expo Dev Server:" -ForegroundColor White
Write-Host "   npx expo start -c --clear" -ForegroundColor Yellow
Write-Host ""
Write-Host "2️⃣  No celular:" -ForegroundColor White
Write-Host "   - Instale o app 'Expo Go' da Play Store" -ForegroundColor Gray
Write-Host "   - Conecte ao mesmo WiFi do computador" -ForegroundColor Gray
Write-Host "   - Escaneie o QR code que aparecerá no PowerShell" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Teste todas as funcionalidades no Expo Go" -ForegroundColor White
Write-Host ""
Write-Host "4️⃣  Se tudo funcionar, gere o APK:" -ForegroundColor White
Write-Host "   npm install -g eas-cli" -ForegroundColor Yellow
Write-Host "   eas login" -ForegroundColor Yellow
Write-Host "   eas build:configure" -ForegroundColor Yellow
Write-Host "   eas build --platform android --profile preview" -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  SE DER ERRO 'main has not been registered':" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Pare o servidor (Ctrl+C)" -ForegroundColor Gray
Write-Host "   2. Abra app.json e remova a linha 'entryPoint' se existir" -ForegroundColor Gray
Write-Host "   3. Execute novamente este script: .\setup-windows.ps1" -ForegroundColor Gray
Write-Host "   4. Reinicie: npx expo start -c --clear" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Para mais ajuda, veja:" -ForegroundColor Cyan
Write-Host "   - RESOLUCAO_ERROS_WINDOWS.md" -ForegroundColor Gray
Write-Host "   - WINDOWS_SETUP_COMPLETO.md" -ForegroundColor Gray
Write-Host "   - COMO_GERAR_APK.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🕊️  Verso Diário - 'Você não está sozinho, viva com propósito'" -ForegroundColor Magenta
Write-Host ""
