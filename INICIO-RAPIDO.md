# 🚀 GUIA RÁPIDO - Como Testar o App

**Última atualização:** 21 de outubro de 2025

---

## ⚡ INÍCIO RÁPIDO (3 passos)

### 1️⃣ Execute o script de verificação

```powershell
cd c:\Sistemas\Pessoal
.\verificar-projeto.ps1
```

Este script vai verificar:

- ✅ Se todos os arquivos existem
- ✅ Se as dependências estão instaladas
- ✅ Se o Firebase está configurado
- ✅ Se há erros críticos

### 2️⃣ Corrija problemas (se houver)

O script mostrará os erros. Mais comuns:

#### Se faltar `.env`:

```powershell
cd mobile
copy .env.example .env
notepad .env
# Cole suas credenciais Firebase
```

#### Se faltar `node_modules`:

```powershell
cd mobile
npm install
```

### 3️⃣ Inicie o app

```powershell
cd mobile
npx expo start
```

Escaneie o QR code com:

- **Android**: App "Expo Go"
- **iOS**: Câmera (abre no Expo Go)

---

## 📱 Onde Baixar o Expo Go

- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS**: https://apps.apple.com/app/expo-go/id982107779

---

## 🔥 Configuração Firebase (se ainda não fez)

### 1. Acesse o Firebase Console

https://console.firebase.google.com

### 2. Crie/Abra o projeto

- Se já criou: abra `shopping-list-app-45bd0`
- Se não: crie um novo projeto

### 3. Ative o Firestore

1. Menu lateral → Build → Firestore Database
2. Clique "Create database"
3. Escolha localização: `southamerica-east1 (São Paulo)`
4. Modo: Production (vamos configurar as regras)
5. Clique "Enable"

### 4. Configure as Regras

1. Firestore → Rules
2. Cole isso:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Clique "Publish"

### 5. Pegue as Credenciais

1. ⚙️ Project Settings (ícone de engrenagem)
2. Scroll até "Your apps"
3. Clique no ícone Web `</>`
4. Copie o `firebaseConfig`
5. Cole no arquivo `.env` do mobile

---

## 🧪 Teste Rápido (1 minuto)

Após o app abrir:

1. **Digite "Leite"** no campo
2. **Pressione Enter**
3. **Item aparece na lista?** ✅
4. **Abra Firebase Console → Firestore**
5. **Vê o item lá?** ✅

**Se ambos SIM = FUNCIONOU! 🎉**

---

## 🐛 Problemas Comuns

### "Cannot connect to Firebase"

```powershell
# Verificar .env
cd mobile
type .env

# Se vazio ou com valores exemplo, preencha:
notepad .env
```

### "Module not found: firebase"

```powershell
cd mobile
npm install firebase
npm install
```

### "Expo won't start"

```powershell
cd mobile
npm install
npx expo start --clear
```

### App não carrega no celular

1. Certifique-se que PC e celular estão **na mesma rede WiFi**
2. Desabilite VPN (se tiver)
3. Tente com cabo USB:
   ```powershell
   npx expo start --tunnel
   ```

---

## 📋 Checklist Completo

Para testes detalhados, consulte:

- **CHECKLIST-TESTES.md** - Todos os testes funcionais
- **mobile/SETUP.md** - Setup detalhado do mobile
- **CHECKLIST-DESENVOLVIMENTO.md** - Desenvolvimento completo

---

## 🆘 Precisa de Ajuda?

1. Execute `.\verificar-projeto.ps1` para ver erros
2. Consulte os arquivos markdown na pasta raiz
3. Veja os erros no console do Expo

---

## ✅ Próximo Passo

Depois que testar e funcionar:

```powershell
# 1. Ver o checklist de testes completo
notepad CHECKLIST-TESTES.md

# 2. Testar com 2 dispositivos (sincronização)
# Abra o app em 2 celulares e teste adicionar/remover

# 3. Compartilhar com sua esposa!
# Use o link do Expo ou faça build
```

---

**Boa sorte! 🚀**
