# App Cristão - Instruções para Uso

## ✅ **Projeto Concluído com Sucesso!**

Seu app cristão React Native + Expo foi atualizado com todas as funcionalidades solicitadas, mantendo o design profissional, moderno e minimalista, transmitindo a mensagem central: **"Você não está sozinho, viva com propósito"**.

---

## 🎯 **Funcionalidades Implementadas**

### ✅ **1. Tema Escuro Completo**
- **Cores**: Azul escuro, cinza grafite e dourado conforme solicitado
- **Toggle nas Configurações**: Usuário pode alternar entre tema claro e escuro
- **Persistência**: Preferência salva automaticamente no dispositivo

### ✅ **2. Notificações Push Inteligentes**
- **Frequência**: 2-3 vezes por semana (terça, quinta e sábado às 19h)
- **Perguntas Contextuais**: "Como você está se sentindo hoje?", etc.
- **Respostas Direcionadas**: Cada resposta direciona para versículos específicos
- **Lista Pré-programada**: 5 perguntas diferentes para evitar repetição

### ✅ **3. Notificações Diárias**
- **Horário**: 8:00 AM todos os dias
- **Conteúdo**: Versículo/devocional do dia
- **Algoritmo Determinístico**: Mesmo versículo por dia para todos os usuários

### ✅ **4. Container da Loja**
- **Localização**: Tela inicial, abaixo do versículo do dia
- **Design**: Container elegante com ícone e call-to-action
- **WebView Integrada**: Tela dedicada da loja com navegação web
- **Acesso**: Também disponível na aba "Loja" na navegação inferior

### ✅ **5. Redes Sociais**
- **Localização**: Tela inicial, abaixo da loja
- **Plataformas**: Instagram, YouTube, Facebook
- **Design**: Botões coloridos com ícones específicos
- **Funcionalidade**: Links diretos para redes sociais

### ✅ **6. Perfil do Usuário**
- **Nome**: Campo editável salvo localmente
- **Foto de Perfil**: Seleção da galeria com câmera
- **Armazenamento**: Dados salvos com AsyncStorage
- **Localização**: Aba "Configurações"

### ✅ **7. Sistema de Feedback**
- **Localização**: Aba Configurações
- **Funcionalidade**: Caixa de texto para sugestões
- **Envio**: E-mail direto para contato da empresa
- **Confirmação**: Mensagem de sucesso após envio

### ✅ **8. Navegação Inferior Fixa**
- **5 Abas**: Início, Bíblia, Hinário, Loja, Configurações
- **Sempre Visível**: Em todas as telas principais
- **Ícones Intuitivos**: MaterialIcons para cada aba
- **Cores Dinâmicas**: Adaptam ao tema atual

### ✅ **9. Layout Otimizado**
- **Sem Margens Excessivas**: Container preenche horizontalmente
- **Estética Limpa**: Design minimalista e profissional
- **Responsivo**: Adapta-se a diferentes tamanhos de tela

### ✅ **10. Funcionalidades da Bíblia**
- **Controle de Fonte**: Botões A+/A- para ajustar tamanho
- **Persistência**: Preferência de fonte salva no dispositivo
- **Busca**: Pesquisa por livros da Bíblia
- **Navegação**: Seleção fácil de capítulos e versículos

---

## 🚀 **Como Testar o App**

### **1. Ambiente de Desenvolvimento**
O app está configurado e funcionando no Expo. Você pode:

1. **Testar no Navegador Web**: Use o comando `npm run web`
2. **Testar no Simulador**: Use `npm run ios` ou `npm run android`
3. **Testar no Dispositivo Real**: 
   - Instale o Expo Go no seu celular
   - Escaneie o QR code que aparece no terminal

### **2. QR Code Disponível**
O Expo está rodando e exibindo o QR code. Escaneie com:
- **Android**: App Expo Go
- **iOS**: Câmera nativa ou Expo Go

---

## 📱 **Como Gerar APK/IPA para Produção**

### **🤖 Para Android (APK)**

1. **Instalar EAS CLI**:
```bash
npm install -g @expo/cli
npm install -g eas-cli
```

2. **Login no Expo**:
```bash
expo login
```

3. **Configurar Build**:
```bash
eas build:configure
```

4. **Gerar APK**:
```bash
eas build --platform android --profile preview
```

5. **Baixar APK**: O link será fornecido no terminal após o build

### **🍎 Para iOS (IPA)**

1. **Configurar Conta Apple Developer** (obrigatório):
   - Tenha uma conta Apple Developer ativa
   - Configure certificados no Apple Developer Portal

2. **Gerar IPA**:
```bash
eas build --platform ios --profile preview
```

3. **Distribuição**: Use TestFlight ou instale diretamente

---

## ⚙️ **Configurações Importantes**

### **📧 E-mail da Empresa**
No arquivo `src/screens/SettingsScreen.js`, linha 67:
```javascript
recipients: ['contato@exemploapp.com'], // ⚠️ SUBSTITUA pelo e-mail real
```

### **🏪 URL da Loja**
No arquivo `src/screens/StoreScreen.js`, linha 12:
```javascript
const storeUrl = 'https://exemplo-loja-crista.com'; // ⚠️ SUBSTITUA pela URL real
```

### **📱 Bundle Identifiers**
No arquivo `app.json`:
- **Android**: `com.christianapp.faithcompanion`
- **iOS**: `com.christianapp.faithcompanion`

---

## 🎨 **Personalização de Cores**

### **Tema Claro**
- Fundo: Branco (#ffffff)
- Primário: Azul (#0070f3)
- Secundário: Dourado (#eab308)
- Texto: Azul escuro (#0f172a)

### **Tema Escuro**
- Fundo: Azul escuro (#0f172a)
- Primário: Azul claro (#36abff)
- Secundário: Dourado claro (#fde047)
- Texto: Branco (#f8fafc)

---

## 📂 **Estrutura do Projeto**

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Context API (temas, etc.)
├── data/              # Dados da Bíblia, hinos, versículos
├── hooks/             # Hooks customizados
├── screens/           # Telas do aplicativo
└── utils/             # Utilitários (storage, notificações)
```

---

## 🔔 **Sistema de Notificações**

As notificações são inicializadas automaticamente quando o app carrega:

- **Permissões**: Solicitadas automaticamente na primeira execução
- **Agendamento**: Configurado para horários específicos
- **Teste**: Use `notificationService.sendTestNotification()` para testar

---

## ✅ **Checklist Final**

- ✅ Tema escuro implementado
- ✅ Notificações inteligentes configuradas
- ✅ Notificações diárias funcionando
- ✅ Loja integrada com WebView
- ✅ Redes sociais conectadas
- ✅ Perfil de usuário completo
- ✅ Sistema de feedback por e-mail
- ✅ Navegação inferior fixa
- ✅ Layout sem margens excessivas
- ✅ Controles de fonte na Bíblia
- ✅ Configuração para builds APK/IPA

---

## 🎯 **Próximos Passos Recomendados**

1. **Substituir URLs e e-mails** pelos dados reais da empresa
2. **Testar notificações** em dispositivo físico
3. **Customizar ícones e splash screen** se necessário
4. **Gerar builds de teste** para validação
5. **Configurar conta EAS** para builds em produção

---

**🙏 Seu app cristão está pronto para abençoar vidas com a mensagem: "Você não está sozinho, viva com propósito"!**