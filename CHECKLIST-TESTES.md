# 🧪 Checklist de Testes - Shopping List App

**Data:** 21 de outubro de 2025  
**Status:** Pronto para testes

---

## ✅ Pré-requisitos para Testes

### 1. Firebase Setup

- [ ] **Projeto criado no Firebase Console**
  - Acesse: https://console.firebase.google.com
  - Verifique se o projeto `shopping-list-app-45bd0` existe
- [ ] **Firestore Database ativado**
  - Firebase Console → Build → Firestore Database
  - Status deve estar "Active"
- [ ] **Security Rules configuradas**
  - Abra Firestore → Rules
  - Copie as regras de `c:\Sistemas\Pessoal\firebase\firestore.rules`
  - Clique em "Publish"
- [ ] **Índices configurados**
  - Firestore → Indexes
  - Importe `c:\Sistemas\Pessoal\firebase\firestore.indexes.json`

### 2. Mobile App Setup

- [ ] **Dependências instaladas**

  ```powershell
  cd c:\Sistemas\Pessoal\mobile
  npm install
  ```

- [ ] **Arquivo .env criado**
  ```powershell
  # Se não existe, criar:
  copy .env.example .env
  ```
- [ ] **Credenciais Firebase no .env**
  - Abra o arquivo `.env`
  - Verifique se todas as variáveis estão preenchidas:
    - `EXPO_PUBLIC_FIREBASE_API_KEY`
    - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
    - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `EXPO_PUBLIC_FIREBASE_APP_ID`

---

## 🔍 Verificação Rápida

Execute estes comandos para verificar o status:

```powershell
# 1. Verificar se está na pasta correta
cd c:\Sistemas\Pessoal\mobile

# 2. Verificar se node_modules existe
dir node_modules

# 3. Verificar se .env existe
dir .env

# 4. Ver conteúdo do .env (sem mostrar credenciais)
type .env | findstr "EXPO_PUBLIC"

# 5. Verificar versão do Expo
npx expo --version

# 6. Verificar se há erros de TypeScript
npx tsc --noEmit
```

---

## 🚀 Como Executar os Testes

### Opção 1: Teste com Expo Go (MAIS RÁPIDO)

1. **Instalar Expo Go no seu celular**

   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. **Iniciar o servidor Expo**

   ```powershell
   cd c:\Sistemas\Pessoal\mobile
   npx expo start
   ```

3. **Conectar o celular**
   - Android: Escanear QR code com o app Expo Go
   - iOS: Escanear QR code com a câmera (abrirá no Expo Go)
4. **Aguardar o build**
   - Primeira vez pode demorar 1-2 minutos
   - App abrirá automaticamente

### Opção 2: Emulador Android

1. **Verificar se Android Studio está instalado**

   ```powershell
   # Verificar se emulador está disponível
   emulator -list-avds
   ```

2. **Iniciar emulador**

   ```powershell
   # Listar emuladores disponíveis
   emulator -list-avds

   # Iniciar um emulador
   emulator -avd Pixel_5_API_30
   ```

3. **Rodar app no emulador**
   ```powershell
   cd c:\Sistemas\Pessoal\mobile
   npx expo start --android
   ```

### Opção 3: Simulator iOS (Apenas macOS)

```bash
cd c:\Sistemas\Pessoal\mobile
npx expo start --ios
```

---

## 🧪 Testes Funcionais

Execute cada teste e marque como concluído:

### 1. Teste de Conexão Firebase

- [ ] **App inicia sem erros**

  - Não deve aparecer erro de "Firebase not configured"
  - Console não deve mostrar erros de autenticação

- [ ] **Firestore conecta**
  - Abra Firebase Console → Firestore → Data
  - Verifique se a collection `items` foi criada
  - Mesmo que vazia, deve aparecer

### 2. Teste de Adicionar Item

- [ ] **Interface carrega**
  - Campo de input visível
  - Botão "+" ou "Adicionar" visível
- [ ] **Adicionar item funciona**
  1. Digite "Leite" no campo
  2. Pressione Enter ou clique em Adicionar
  3. Item aparece na lista
  4. Campo limpa automaticamente
- [ ] **Item aparece no Firebase**

  - Abra Firebase Console → Firestore → items collection
  - Deve haver um documento com `name: "Leite"`
  - Campos `createdAt`, `updatedAt`, `deleted: false`

- [ ] **Validações funcionam**
  - Tente adicionar item vazio → deve mostrar erro
  - Tente adicionar item com apenas espaços → deve mostrar erro

### 3. Teste de Visualizar Lista

- [ ] **Lista carrega ao abrir app**
  - Se há itens no Firebase, devem aparecer
  - Ordem: mais recentes primeiro (ordem decrescente)
- [ ] **Lista vazia mostra mensagem**
  - Se não há itens, deve mostrar "Sua lista está vazia"
  - Ou mensagem similar motivacional

### 4. Teste de Remover Item

- [ ] **Botão de remover visível**
  - Cada item deve ter um ícone de lixeira ou X
- [ ] **Remover item funciona**

  1. Clique no ícone de remover
  2. Item desaparece da lista com animação
  3. Verifique no Firebase: campo `deleted` deve ser `true`

- [ ] **Swipe para remover (opcional)**
  - Deslize item para a esquerda
  - Deve aparecer botão de delete ou remover automaticamente

### 5. Teste de Limpar Lista

- [ ] **Botão "Limpar Lista" visível**
  - Deve estar no topo ou no menu
- [ ] **Confirmação aparece**
  - Ao clicar, deve pedir confirmação
  - "Tem certeza que deseja limpar X itens?"
- [ ] **Limpar funciona**
  1. Adicione 3+ itens
  2. Clique em "Limpar Lista"
  3. Confirme
  4. Todos itens somem
  5. Verifique Firebase: todos com `deleted: true`

### 6. Teste de Sincronização em Tempo Real

- [ ] **Teste com 2 dispositivos** (IMPORTANTE!)
  1. Abra o app em 2 celulares OU 1 celular + 1 emulador
  2. Adicione item no Device A
  3. Item aparece automaticamente no Device B (em 1-2 segundos)
  4. Remova item no Device B
  5. Item some automaticamente no Device A
- [ ] **Adicione item direto no Firebase**
  1. Abra Firebase Console → Firestore
  2. Adicione um documento manualmente na collection `items`:
     ```json
     {
       "name": "Teste Manual",
       "createdAt": (timestamp atual),
       "updatedAt": (timestamp atual),
       "deleted": false
     }
     ```
  3. Item aparece no app automaticamente

### 7. Teste de Performance

- [ ] **App abre rápido**
  - Deve carregar em menos de 3 segundos
- [ ] **Lista rola suavemente**
  - Adicione 20+ itens
  - Rolagem deve ser fluida (60fps)
- [ ] **Adicionar é instantâneo**
  - Feedback visual imediato (optimistic update)
  - Mesmo antes do Firebase confirmar

### 8. Teste de UI/UX

- [ ] **Interface bonita**
  - Cores agradáveis
  - Ícones claros
  - Espaçamento adequado
- [ ] **Responsivo**
  - Teste em diferentes tamanhos de tela
  - Rotacione o dispositivo (landscape)
- [ ] **Feedback visual**
  - Loading ao carregar lista
  - Animação ao adicionar/remover
  - Toast/Snackbar ao limpar lista

---

## 🐛 Resolução de Problemas Comuns

### Problema: "Firebase not configured"

**Solução:**

```powershell
# 1. Verificar se .env existe
cd c:\Sistemas\Pessoal\mobile
dir .env

# 2. Se não existe, criar:
copy .env.example .env

# 3. Preencher com suas credenciais
notepad .env

# 4. Reiniciar Expo
# Pressione Ctrl+C para parar
npx expo start --clear
```

### Problema: "Cannot connect to Firebase"

**Solução:**

1. Verifique internet
2. Abra https://console.firebase.google.com
3. Veja se projeto existe
4. Veja se Firestore está ativo

### Problema: "Module not found: firebase"

**Solução:**

```powershell
cd c:\Sistemas\Pessoal\mobile
npm install firebase
npm install
```

### Problema: "Items não aparecem"

**Solução:**

1. Abra Firebase Console → Firestore → Rules
2. Temporariamente use regras permissivas para teste:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // APENAS PARA TESTE!
       }
     }
   }
   ```
3. Clique "Publish"
4. Teste novamente
5. **IMPORTANTE:** Volte as regras corretas depois!

### Problema: "Expo won't start"

**Solução:**

```powershell
# Limpar cache e reinstalar
cd c:\Sistemas\Pessoal\mobile
rm -rf node_modules
rm package-lock.json
npm install
npx expo start --clear
```

---

## 📊 Checklist de Qualidade

### Performance

- [ ] App abre em < 3 segundos
- [ ] Lista com 50+ itens rola suavemente
- [ ] Sem memory leaks (use React DevTools)

### Funcionalidade

- [ ] Todos os 8 testes funcionais passaram
- [ ] Sincronização funciona em tempo real
- [ ] Persistência funciona (fechar e abrir app)

### UI/UX

- [ ] Interface intuitiva (alguém consegue usar sem explicação)
- [ ] Feedback visual em todas as ações
- [ ] Acessível (tamanhos de fonte adequados)

### Segurança

- [ ] Firestore rules configuradas (não apenas `allow read, write: if true`)
- [ ] Credenciais não commitadas no Git

---

## 🎯 Comandos Úteis para Debug

```powershell
# Ver logs em tempo real
npx expo start

# Ver logs do Android
adb logcat | findstr "ReactNative"

# Limpar cache do Expo
npx expo start --clear

# Verificar erros TypeScript
npx tsc --noEmit

# Ver status do Firebase
firebase projects:list

# Ver regras do Firestore
firebase firestore:rules:list
```

---

## ✅ Critérios de Sucesso

O app está pronto para uso quando:

1. ✅ Todos os 8 testes funcionais passarem
2. ✅ Sincronização funcionar em 2 dispositivos
3. ✅ Sem erros no console
4. ✅ Performance adequada (< 3s para abrir)
5. ✅ UI intuitiva e responsiva
6. ✅ Firebase rules configuradas corretamente

---

## 📝 Próximos Passos Após Testes

Se tudo passar:

1. [ ] Fazer backup do código (commit + push)
2. [ ] Preparar build de produção
3. [ ] Testar com usuários reais (você e sua esposa)
4. [ ] Coletar feedback
5. [ ] Iterar melhorias

---

**Boa sorte com os testes! 🚀**

Se encontrar problemas, consulte a seção "Resolução de Problemas" acima.
