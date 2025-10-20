# 🚀 Guia de Setup Mobile - Shopping List

## 📦 O que precisa instalar

### 1. Instalar Firebase SDK

```powershell
cd mobile
npm install firebase
```

### 2. Configurar Variáveis de Ambiente

```powershell
# Copiar arquivo exemplo
copy .env.example .env

# Editar .env e adicionar suas credenciais Firebase
notepad .env
```

Suas credenciais Firebase (obtenha em https://console.firebase.google.com):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## 🤔 Decisão Importante: Expo ou React Native CLI?

Você tem duas opções:

### Opção A: 🚀 Migrar para Expo (RECOMENDADO)

**Vantagens:**

- ✅ Mais fácil de configurar
- ✅ Build na nuvem (gratuito)
- ✅ Hot reload melhor
- ✅ Expo Go para testar sem build
- ✅ OTA updates (atualizar sem rebuild)

**Como migrar:**

```powershell
# 1. Instalar Expo
npm install expo

# 2. Atualizar package.json scripts
npm install expo-dev-client

# 3. Rodar
npx expo start
```

### Opção B: ⚛️ Continuar com React Native CLI

**Vantagens:**

- ✅ Mais controle sobre código nativo
- ✅ Menos abstrações

**Desvantagens:**

- ❌ Precisa Android Studio + Xcode configurados
- ❌ Build local (mais lento)
- ❌ Mais complexo

**Como continuar:**

```powershell
# Já está configurado, só precisa:
npm install firebase

# E rodar:
npm run android
# ou
npm run ios
```

---

## 🎯 Próximos Arquivos a Criar

Após instalar Firebase, precisamos criar:

### 1. Componentes UI

- [ ] `src/components/ItemInput.tsx` - Campo para adicionar item
- [ ] `src/components/ItemList.tsx` - Lista de itens
- [ ] `src/components/ItemCard.tsx` - Card individual do item
- [ ] `src/components/ClearButton.tsx` - Botão limpar lista
- [ ] `src/components/LoadingSpinner.tsx` - Loading

### 2. Telas

- [ ] `src/screens/HomeScreen.tsx` - Tela principal

### 3. App Principal

- [ ] `App.tsx` - Componente raiz

---

## ✅ Checklist de Setup

- [ ] Instalar Firebase: `npm install firebase`
- [ ] Configurar `.env` com credenciais
- [ ] Decidir: Expo ou React Native CLI
- [ ] Criar componentes UI
- [ ] Criar telas
- [ ] Criar App.tsx
- [ ] Testar no device/emulator

---

## 🔧 Comandos Úteis

### Se escolher Expo:

```powershell
# Instalar Expo globalmente
npm install -g expo-cli

# Iniciar
npx expo start

# Build Android
npx eas build --platform android

# Build iOS
npx eas build --platform ios
```

### Se continuar React Native CLI:

```powershell
# Android
npm run android

# iOS (macOS only)
npm run ios

# Metro bundler
npm start
```

---

## 📝 Arquivos Criados Até Agora

✅ `src/types/Item.ts` - Tipos TypeScript
✅ `src/services/firebase.ts` - Serviços Firebase (CRUD)
✅ `src/hooks/useItems.ts` - Hook personalizado

---

## 🤷 Qual escolher?

**Para começar rápido e fácil:** Escolha **Expo** ✨

**Para máximo controle:** Continue com **React Native CLI**

**Minha recomendação:** Expo, pelos motivos:

1. Mais fácil para começar
2. Build gratuito na nuvem
3. Testar no celular com Expo Go (sem build)
4. Deploy mais simples

---

## 🎬 Próximo Passo

Responda: **Expo ou React Native CLI?**

Depois disso, vou criar todos os componentes e você terá um app funcionando! 🚀
