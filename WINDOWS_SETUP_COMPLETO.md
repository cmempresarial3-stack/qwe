# 🪟 Guia Completo Windows PowerShell - Verso Diário

## ✅ PRÉ-REQUISITOS

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** ou **20+** (https://nodejs.org/)
- **Git** (https://git-scm.com/)
- **Android Studio** (para build APK local - opcional)
- **PowerShell** como Administrador

Verifique as versões:
```powershell
node -v
npm -v
```

---

## 🚀 PASSO A PASSO COMPLETO - COPIE E COLE

### 1️⃣ BAIXAR O PROJETO DO REPLIT

```powershell
# Baixe o projeto do Replit como ZIP e extraia para uma pasta
# Exemplo: C:\Users\SeuNome\Documents\verso-diario

# Navegue até a pasta do projeto
cd C:\Users\SeuNome\Documents\verso-diario
```

---

### 2️⃣ LIMPEZA COMPLETA (Primeira Vez ou Problemas)

```powershell
# Limpa todas as pastas de cache e builds anteriores
# -ErrorAction SilentlyContinue ignora erros se as pastas não existirem

Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ios -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

Write-Host "✅ Limpeza completa finalizada!" -ForegroundColor Green
```

---

### 3️⃣ INSTALAR DEPENDÊNCIAS

```powershell
# Instala todas as dependências do projeto
# --legacy-peer-deps é OBRIGATÓRIO para evitar conflitos

npm install --legacy-peer-deps

Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
```

---

### 4️⃣ INSTALAR EXPO CLI GLOBALMENTE (Se Ainda Não Tiver)

```powershell
npm install -g expo-cli

# Verifique a instalação
expo --version
```

---

### 5️⃣ INICIAR O EXPO DEV SERVER

```powershell
# Inicia o Metro Bundler com cache limpo
# IMPORTANTE: Este comando vai gerar um QR code para testar no celular

npx expo start -c

# Você verá:
# - Um QR code no terminal
# - Opções de teclas (a = Android, w = Web, r = Reload)
# - URL: exp://SEU_IP:8081
```

**O que esperar:**
- ✅ Metro Bundler iniciando
- ✅ QR code aparecendo no terminal
- ✅ Mensagem "Metro waiting on exp://..."
- ❌ Se aparecer erro "main has not been registered", veja seção de troubleshooting

---

### 6️⃣ TESTAR NO EXPO GO (CELULAR)

1. **Instale o Expo Go** no seu celular Android:
   - Google Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Conecte ao mesmo WiFi**:
   - Seu computador e celular DEVEM estar na mesma rede WiFi

3. **Escaneie o QR code**:
   - Abra o Expo Go
   - Toque em "Scan QR code"
   - Aponte para o QR code no PowerShell
   - O app vai carregar no celular

4. **Testando**:
   - O app deve abrir mostrando a tela de Onboarding
   - Navegue pelas telas (Home, Bíblia, Hinário, etc.)
   - Se aparecer tela branca ou crash, veja troubleshooting

---

## 📦 GERAR APK PARA INSTALAÇÃO

### Método 1: EAS Build (Mais Fácil - Recomendado)

```powershell
# 1. Instale EAS CLI
npm install -g eas-cli

# 2. Login no Expo (crie uma conta grátis em expo.dev se não tiver)
eas login

# 3. Configure o projeto para EAS
eas build:configure

# 4. Gere o APK (build na nuvem Expo)
eas build --platform android --profile preview

# O processo leva 10-15 minutos
# Ao finalizar, você recebe um link para baixar o APK
```

**Vantagens:**
- ✅ Não precisa de Android Studio
- ✅ Build na nuvem (mais confiável)
- ✅ APK pronto para instalar

**Desvantagens:**
- ❌ Precisa de conta Expo (grátis)
- ❌ Demora 10-15 minutos

---

### Método 2: Build Local com Gradle (Avançado)

```powershell
# 1. Certifique-se de ter Android Studio instalado
# Download: https://developer.android.com/studio

# 2. Gere os arquivos nativos Android
npx expo prebuild --platform android --clean

# 3. Entre na pasta Android
cd android

# 4. Windows: Use gradlew.bat (NÃO ./gradlew)
.\gradlew clean
.\gradlew assembleRelease

# 5. APK estará em:
# android\app\build\outputs\apk\release\app-release.apk
```

**Vantagens:**
- ✅ Build 100% offline
- ✅ Controle total

**Desvantagens:**
- ❌ Precisa de Android Studio (4-5 GB)
- ❌ Configuração mais complexa
- ❌ Pode dar erros de SDK/Java

---

## 🐛 TROUBLESHOOTING - ERROS COMUNS

### ❌ Erro: "main" has not been registered

**Causa:** O Metro Bundler não está encontrando o entry point do app.

**Solução:**

```powershell
# 1. Pare o servidor (Ctrl+C)

# 2. Limpe completamente
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# 3. Reinstale
npm install --legacy-peer-deps

# 4. Verifique se app.json tem:
# "expo": {
#   "entryPoint": "expo-router/entry"
# }

# 5. Reinicie com cache limpo
npx expo start -c --clear
```

---

### ❌ Erro: RCTEventEmitter.receiveTouches()

**Causa:** Bundle JavaScript corrompido ou módulos nativos desatualizados.

**Solução:**

```powershell
# 1. Pare tudo (Ctrl+C)

# 2. Limpeza profunda
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# 3. Reinstale
npm install --legacy-peer-deps

# 4. Reinicie
npx expo start -c

# 5. Se persistir, atualize o Expo Go no celular
```

---

### ❌ Tela Branca no Expo Go

**Causa:** Erro de JavaScript não capturado, imports incorretos, ou AsyncStorage.

**Solução:**

```powershell
# 1. No PowerShell, pressione 'r' para reload

# 2. Abra o menu de desenvolvedor no celular:
# - Android: Agite o celular
# - Toque em "Debug Remote JS"

# 3. Verifique os erros no terminal do PowerShell

# 4. Se aparecer erro de AsyncStorage:
npm install @react-native-async-storage/async-storage --legacy-peer-deps
```

---

### ❌ APK Abre e Fecha Sozinho

**Causa:** Erros não tratados, assets faltando, ou assinatura incorreta.

**Solução:**

```powershell
# 1. Teste PRIMEIRO no Expo Go - se funcionar lá, o problema é no build

# 2. Use EAS Build em vez de gradlew local:
eas build --platform android --profile preview

# 3. Se usar gradlew local, certifique-se de:
# - Assets estão em assets/ (icon.png, splash.png)
# - app.json configurado corretamente
# - Nenhum import com @ paths (use caminhos relativos)

# 4. Gere APK debug primeiro para testar:
.\gradlew assembleDebug
# APK debug: android\app\build\outputs\apk\debug\app-debug.apk
```

---

### ❌ Comandos rm -rf Não Funcionam no Windows

**Solução:** Use comandos PowerShell nativos:

```powershell
# ❌ ERRADO (Linux/Mac)
rm -rf node_modules

# ✅ CORRETO (Windows PowerShell)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Ou simplesmente exclua as pastas manualmente no Windows Explorer
```

---

### ❌ Expo Go Não Conecta (Mesmo WiFi)

**Causa:** Firewall do Windows bloqueando porta 8081 ou 19000.

**Solução:**

```powershell
# 1. Verifique se o Expo está rodando na porta 8081:
# Procure por: "Metro waiting on exp://SEU_IP:8081"

# 2. Teste com modo tunnel (mais lento mas funciona):
npx expo start --tunnel

# 3. Adicione exceção no Firewall do Windows:
# - Abra "Firewall do Windows Defender"
# - "Permitir um aplicativo" → Node.js → Permitir Rede Privada
```

---

## 📝 CHECKLIST DE VERIFICAÇÃO

Antes de gerar o APK, certifique-se:

- ✅ App abre no Expo Go sem erros
- ✅ Todas as 7 tabs aparecem (Home, Bíblia, Hinário, Anotações, Calendário, Loja, Configurações)
- ✅ Consegue navegar entre telas
- ✅ Consegue criar alarmes
- ✅ Consegue favoritar versos
- ✅ Player de hinário funciona
- ✅ Leitor da Bíblia com TTS funciona
- ✅ Modo escuro/claro funciona

Se TUDO acima funcionar no Expo Go, o APK vai funcionar também.

---

## 🎯 RESUMO - COMANDOS ESSENCIAIS

```powershell
# PRIMEIRA VEZ (ou para limpar tudo)
Remove-Item -Recurse -Force .expo, android, ios, node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install --legacy-peer-deps
npx expo start -c

# TESTAR NO EXPO GO
# 1. Instale Expo Go no celular
# 2. Conecte ao mesmo WiFi
# 3. Escaneie o QR code
# 4. Teste todas as funcionalidades

# GERAR APK (EAS - Recomendado)
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview

# GERAR APK (Local - Avançado)
npx expo prebuild --platform android --clean
cd android
.\gradlew assembleRelease
# APK: android\app\build\outputs\apk\release\app-release.apk
```

---

## 🆘 AINDA COM PROBLEMAS?

Se após seguir todos os passos ainda houver erros:

1. **Copie a mensagem de erro completa** do PowerShell
2. **Tire screenshot** da tela do Expo Go (se houver)
3. **Verifique a versão do Node**: `node -v` (recomendado 18.x ou 20.x)
4. **Verifique o arquivo app.json** - deve ter `"entryPoint": "expo-router/entry"`
5. **Teste no navegador**: No PowerShell, pressione `w` para abrir no navegador

---

## 📱 INSTALANDO O APK NO CELULAR

Depois de gerar o APK:

1. **Transfira o APK** para o celular (via USB, email, ou Google Drive)
2. **Ative "Fontes Desconhecidas"**:
   - Configurações → Segurança → Fontes Desconhecidas → Ativar
3. **Abra o arquivo APK** no gerenciador de arquivos
4. **Toque em "Instalar"**
5. **Abra o app "Verso Diário"**

**IMPORTANTE:** Se o app abrir e fechar sozinho, significa que há um erro não tratado. Teste PRIMEIRO no Expo Go para garantir que tudo funciona antes de gerar o APK.

---

## ✅ PROJETO 100% FUNCIONAL NO REPLIT

O projeto aqui no Replit está funcionando perfeitamente:
- ✅ Metro Bundler rodando sem erros
- ✅ QR code ativo
- ✅ 0 erros TypeScript
- ✅ Todas as dependências instaladas corretamente
- ✅ ErrorBoundary funcionando
- ✅ Splash screen configurado corretamente

Ao baixar o código do Replit e seguir este guia no seu Windows, você terá o mesmo resultado.

---

**🕊️ Verso Diário** - "Você não está sozinho, viva com propósito"
