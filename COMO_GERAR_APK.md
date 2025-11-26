# Como Gerar o APK do Verso Diário

Este guia explica como gerar o arquivo APK do aplicativo Verso Diário para distribuição.

## Pré-requisitos

### Opção 1: EAS Build (Recomendado - Mais Fácil)

1. Instalar EAS CLI globalmente:
```bash
npm install -g eas-cli
```

2. Fazer login no Expo:
```bash
eas login
```

### Opção 2: Build Local (Mais Complexo)

1. **Android Studio** instalado
2. **JDK 17** ou superior
3. **Node.js** 18 ou superior
4. **Expo CLI** instalado globalmente

## Método 1: EAS Build (Recomendado)

### Passo 1: Configurar o projeto EAS

```bash
eas build:configure
```

### Passo 2: Gerar o APK de Preview

```bash
eas build --platform android --profile preview
```

OU, para produção:

```bash
eas build --platform android --profile production
```

### Passo 3: Baixar o APK

Após o build ser concluído, você receberá um link para baixar o APK. Você também pode ver todos os builds em:
```bash
eas build:list
```

## Método 2: Build Local com Expo Prebuild

### Passo 1: Instalar dependências

```bash
npm install
```

### Passo 2: Fazer prebuild

```bash
npx expo prebuild --platform android
```

Este comando criará a pasta `android/` com o projeto nativo.

### Passo 3: Gerar o APK

Navegue até a pasta android e execute:

```bash
cd android
./gradlew assembleRelease
```

O APK será gerado em:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Passo 4: Assinar o APK (Opcional mas Recomendado)

Para distribuir o APK, você precisará assiná-lo:

1. Gerar keystore (primeira vez apenas):
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore verso-diario.keystore -alias verso-diario -keyalg RSA -keysize 2048 -validity 10000
```

2. Configurar gradle para usar o keystore editando `android/app/build.gradle`

3. Gerar APK assinado:
```bash
./gradlew assembleRelease
```

## Método 3: Build Local com EAS Build Local

```bash
eas build --platform android --local --profile preview
```

Isso executa o build na sua máquina local usando Docker, sem enviar para os servidores Expo.

## Configurações do APK

### Arquivo `app.json`

Verifique/ajuste as configurações em `app.json`:

```json
{
  "expo": {
    "android": {
      "package": "com.versodiario.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "version": "1.0.0"
  }
}
```

### Arquivo `eas.json`

As configurações de build estão em `eas.json`:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## Testando o APK

### No Emulador Android

```bash
adb install app-release.apk
```

### No Dispositivo Físico

1. Ative "Fontes Desconhecidas" nas configurações do Android
2. Transfira o APK para o dispositivo
3. Instale tocando no arquivo

## Distribuição

### Google Play Store

Para publicar na Play Store, você precisará:
1. Criar uma conta de desenvolvedor Google Play (taxa única de $25)
2. Gerar um App Bundle (.aab) em vez de APK:
```bash
eas build --platform android --profile production
```
3. Fazer upload através do Google Play Console

### Distribuição Direta

Você pode distribuir o APK diretamente:
- Via link de download
- Via Firebase App Distribution
- Via TestFlight (para iOS)

## Troubleshooting

### Erro: "SDK location not found"

Crie o arquivo `android/local.properties`:
```
sdk.dir=/caminho/para/seu/Android/Sdk
```

### Erro de permissões

No Linux/Mac:
```bash
chmod +x android/gradlew
```

### Erro de memória durante build

Edite `android/gradle.properties`:
```
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
```

### Build muito lento

Use o Gradle Daemon:
```
org.gradle.daemon=true
```

## Recursos Adicionais

- [Documentação Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Documentação Android Build](https://reactnative.dev/docs/signed-apk-android)
- [Expo Application Services](https://expo.dev/eas)

## Notas Importantes

1. O APK gerado por `assembleRelease` NÃO está assinado por padrão
2. Para produção, sempre use APKs/AABs assinados
3. EAS Build é mais fácil e gerencia assinaturas automaticamente
4. Builds locais requerem mais configuração mas dão mais controle
5. O primeiro build pode demorar 20-30 minutos

## Checklist Antes de Gerar o APK

- [ ] Versão atualizada em `app.json`
- [ ] Ícones corretos em `assets/`
- [ ] Splash screen configurado
- [ ] Permissões necessárias declaradas
- [ ] Testado no Expo Go
- [ ] Sem console.logs desnecessários
- [ ] Build type escolhido (APK vs AAB)
- [ ] Keystore gerado (se build local)