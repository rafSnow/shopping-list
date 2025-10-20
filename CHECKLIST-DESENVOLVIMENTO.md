# ✅ Checklist de Desenvolvimento

## Shopping List App - Firebase + Vercel

**Objetivo:** Desenvolver app de lista de compras compartilhada com custo zero

---

## 🎯 Setup Inicial

### Firebase Setup

- [ ] Criar projeto no Firebase Console (https://console.firebase.google.com)
  - Nome: `shopping-list-app`
  - Desabilitar Google Analytics (opcional)
- [ ] Ativar Firestore Database
  - Modo: Produção
  - Localização: southamerica-east1 (São Paulo)
- [ ] Configurar Security Rules
  - Copiar de `firebase/firestore.rules`
- [ ] Criar índices do Firestore
  - Copiar de `firebase/firestore.indexes.json`
- [ ] Obter credenciais Web
  - Firebase Console → Project Settings → Your apps → Web
  - Copiar `firebaseConfig`

### Vercel Setup

- [ ] Criar conta no Vercel (https://vercel.com)
  - Login com GitHub
- [ ] Instalar Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`

### Expo Setup

- [ ] Criar conta no Expo (https://expo.dev)
- [ ] Instalar Expo CLI: `npm i -g expo-cli`
- [ ] Instalar EAS CLI: `npm i -g eas-cli`
- [ ] Login: `npx expo login`

---

## 📱 Desenvolvimento Mobile

### Inicialização

- [ ] Criar projeto Expo com TypeScript
  ```bash
  npx create-expo-app mobile --template expo-template-blank-typescript
  ```
- [ ] Instalar dependências Firebase
  ```bash
  npm install firebase
  npm install @react-native-firebase/app @react-native-firebase/firestore
  ```
- [ ] Instalar dependências UI
  ```bash
  npm install react-native-paper
  npm install react-native-vector-icons
  ```
- [ ] Configurar arquivo `.env`
  - Adicionar variáveis Firebase
  - Prefixo: `EXPO_PUBLIC_`

### Estrutura de Arquivos

- [ ] Criar `src/types/Item.ts`
  - Interface Item
- [ ] Criar `src/services/firebase.ts`
  - Configuração Firebase
  - Funções CRUD
- [ ] Criar `src/hooks/useItems.ts`
  - Custom hook para gerenciar itens
- [ ] Criar `src/components/ItemList.tsx`
  - Listar itens
- [ ] Criar `src/components/ItemInput.tsx`
  - Input para adicionar item
- [ ] Criar `src/components/ItemCard.tsx`
  - Card individual do item
- [ ] Criar `src/screens/HomeScreen.tsx`
  - Tela principal

### Funcionalidades

- [ ] Implementar adicionar item
  - Validação (1-200 caracteres)
  - Feedback visual
- [ ] Implementar listar itens
  - Real-time listener
  - Ordenar por data (mais recente primeiro)
- [ ] Implementar remover item
  - Soft delete
  - Confirmação
- [ ] Implementar limpar lista
  - Batch delete
  - Confirmação
- [ ] Implementar modo offline
  - Testar sem internet
  - Verificar sincronização ao voltar online
- [ ] Adicionar loading states
- [ ] Adicionar error handling
- [ ] Adicionar mensagens de feedback

### Testes

- [ ] Testar no Android Emulator
- [ ] Testar no iOS Simulator (se macOS)
- [ ] Testar em device real via Expo Go
- [ ] Testar modo offline
- [ ] Testar sincronização entre múltiplos devices

---

## 💻 Desenvolvimento Web

### Inicialização

- [ ] Criar projeto React + Vite
  ```bash
  npm create vite@latest web -- --template react-ts
  ```
- [ ] Instalar dependências Firebase
  ```bash
  npm install firebase
  ```
- [ ] Instalar dependências UI
  ```bash
  npm install @mui/material @emotion/react @emotion/styled
  npm install @mui/icons-material
  ```
- [ ] Configurar arquivo `.env`
  - Adicionar variáveis Firebase
  - Prefixo: `VITE_`

### Estrutura de Arquivos

- [ ] Criar `src/types/Item.ts`
  - Interface Item (mesma do mobile)
- [ ] Criar `src/services/firebase.ts`
  - Configuração Firebase (mesmo do mobile)
- [ ] Criar `src/hooks/useItems.ts`
  - Custom hook (mesmo do mobile)
- [ ] Criar `src/components/ItemList.tsx`
- [ ] Criar `src/components/ItemInput.tsx`
- [ ] Criar `src/components/ItemCard.tsx`
- [ ] Criar `src/components/Header.tsx`
- [ ] Criar `src/pages/HomePage.tsx`

### Funcionalidades

- [ ] Implementar adicionar item
- [ ] Implementar listar itens (real-time)
- [ ] Implementar remover item
- [ ] Implementar limpar lista
- [ ] Design responsivo (mobile-first)
- [ ] Loading states
- [ ] Error handling
- [ ] Feedback visual

### Testes Local

- [ ] Testar em Chrome
- [ ] Testar em Firefox
- [ ] Testar em Safari (se macOS)
- [ ] Testar modo offline (DevTools → Network → Offline)
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Testar sincronização em múltiplas abas

---

## 🚀 Deploy

### Firebase

- [ ] Deploy Security Rules
  ```bash
  firebase deploy --only firestore:rules
  ```
- [ ] Deploy Indexes
  ```bash
  firebase deploy --only firestore:indexes
  ```
- [ ] Verificar no Firebase Console
  - Rules ativas
  - Indexes criados

### Web (Vercel)

- [ ] Build local para testar
  ```bash
  npm run build
  npm run preview
  ```
- [ ] Configurar variáveis de ambiente no Vercel
  - Todas as `VITE_FIREBASE_*`
- [ ] Deploy
  ```bash
  vercel --prod
  ```
- [ ] Verificar deploy
  - Abrir URL fornecida
  - Testar funcionalidades
- [ ] Configurar domínio customizado (opcional)

### Mobile (Expo)

- [ ] Configurar `app.json`
  - Nome do app
  - Bundle identifier
  - Versão
  - Ícone e splash screen
- [ ] Build Android
  ```bash
  npx eas build --platform android --profile preview
  ```
- [ ] Build iOS (se tiver conta Apple Developer)
  ```bash
  npx eas build --platform ios --profile preview
  ```
- [ ] Baixar e testar APK/IPA
- [ ] Distribuir para testers

---

## 🧪 Testes Finais

### Funcionalidades

- [ ] Adicionar item funciona (mobile e web)
- [ ] Listar itens funciona (mobile e web)
- [ ] Remover item funciona (mobile e web)
- [ ] Limpar lista funciona (mobile e web)
- [ ] Validações funcionam (nome vazio, muito longo)

### Sincronização

- [ ] Adicionar no mobile → aparece no web (real-time)
- [ ] Adicionar no web → aparece no mobile (real-time)
- [ ] Remover no mobile → remove no web (real-time)
- [ ] Remover no web → remove no mobile (real-time)

### Offline

- [ ] Mobile offline → adicionar item → online → sincroniza
- [ ] Web offline → adicionar item → online → sincroniza
- [ ] Múltiplas alterações offline → sincroniza ao voltar online

### Performance

- [ ] App carrega rápido (< 3s)
- [ ] Transições suaves
- [ ] Sem travamentos
- [ ] Consumo de dados razoável

---

## 📚 Documentação

- [ ] README.md do projeto
- [ ] README.md do mobile
- [ ] README.md do web
- [ ] Comentários no código
- [ ] Instruções de instalação
- [ ] Instruções de deploy

---

## 🎉 Lançamento

### Preparação

- [ ] Criar ícone do app (1024x1024)
- [ ] Criar splash screen
- [ ] Definir nome final
- [ ] Preparar screenshots
- [ ] Escrever descrição

### App Stores (opcional, tem custo)

- [ ] Google Play Console ($25 taxa única)
  - Criar conta desenvolvedor
  - Upload APK
  - Preencher informações
  - Publicar
- [ ] Apple App Store ($99/ano)
  - Criar conta Apple Developer
  - Upload IPA via TestFlight
  - Preencher informações
  - Enviar para review

### Divulgação

- [ ] Compartilhar link do site (Vercel)
- [ ] Compartilhar APK (para Android, sem Play Store)
- [ ] Coletar feedback

---

## 📊 Monitoramento

### Firebase Console

- [ ] Verificar uso diário
  - Leituras
  - Escritas
  - Armazenamento
- [ ] Monitorar erros
- [ ] Verificar performance

### Vercel Dashboard

- [ ] Verificar analytics
- [ ] Monitorar bandwidth
- [ ] Verificar builds

### Expo Dashboard

- [ ] Verificar downloads
- [ ] Monitorar crashes (se configurado)
- [ ] Verificar atualizações OTA

---

## 🔄 Melhorias Futuras

### Recursos Extras

- [ ] Autenticação (Firebase Auth)
- [ ] Múltiplas listas por usuário
- [ ] Compartilhar lista com outros usuários
- [ ] Categorias de itens
- [ ] Quantidade de itens
- [ ] Marcar item como comprado (checkbox)
- [ ] Fotos de produtos
- [ ] Estimativa de preço
- [ ] Histórico de compras
- [ ] Notificações push

### Otimizações

- [ ] Cache de imagens
- [ ] Lazy loading
- [ ] Pagination (se muitos itens)
- [ ] Debounce em buscas
- [ ] Service Worker (PWA)

---

## 💰 Custos

**Atual:** R$ 0,00/mês ✅

**Se precisar escalar:**

- Firebase Blaze (pay-as-you-go): ~R$25-50/mês para milhares de usuários
- Vercel Pro: $20/mês (somente se precisar de mais bandwidth)
- Expo: Grátis (sempre)
- Google Play: $25 (taxa única)
- Apple Developer: $99/ano

---

## 🎓 Próximos Aprendizados

- [ ] Cloud Functions (Firebase)
- [ ] Push Notifications
- [ ] Analytics avançado
- [ ] A/B Testing
- [ ] CI/CD com GitHub Actions
- [ ] Testes automatizados (Jest, Testing Library)
- [ ] SEO para web
- [ ] PWA (Progressive Web App)

---

**Boa sorte no desenvolvimento! 🚀**
