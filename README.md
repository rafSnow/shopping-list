# 🛒 App de Lista de Compras Compartilhada

> Aplicativo multiplataforma para gerenciar lista de compras em tempo real - **100% Gratuito** ✨

[![React Native](https://img.shields.io/badge/React%20Native-0.73-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~50-000020)](https://expo.dev/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Latest-black)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📋 Sobre o Projeto

Este é um aplicativo completo de lista de compras que permite compartilhamento em tempo real:

- ✅ **Adicionar itens** durante a semana conforme consumirem
- ✅ **Sincronização em tempo real** entre todos os dispositivos (automática)
- ✅ **Funciona offline** nativamente e sincroniza quando tiver internet
- ✅ **Notificações em tempo real** quando alguém adicionar/remover itens
- ✅ **Limpar lista** com um botão para começar nova semana
- ✅ **Interface moderna e intuitiva**
- 🎉 **100% Gratuito** - Sem custos de servidor!

### 🎯 Plataformas Suportadas

- 📱 **Mobile:** Android e iOS (React Native + Expo)
- 💻 **Web:** Navegadores modernos (React + Vercel)
- � **Backend:** Firebase (Serverless - BaaS)

---

## 🏗️ Arquitetura Serverless

```
┌──────────────────────────────────────────┐
│   Mobile App (Expo)                      │
│   React Native + TypeScript              │
│   ✓ iOS + Android                        │
│   ✓ Builds gratuitos na nuvem            │
└──────────────┬───────────────────────────┘
               │
               │  Firebase SDK
               │
┌──────────────▼───────────────────────────┐
│   Web App (Vercel)                       │
│   React + Vite + TypeScript              │


**Custo Total: R$ 0,00/mês** 🎉

---

## 💰 Por que Zero Custos?

| Serviço        | Plano          | Custo      | Limites Gratuitos                |
| -------------- | -------------- | ---------- | -------------------------------- |
| Firebase       | Spark (Free)   | R$ 0,00    | 50k leituras, 20k escritas/dia   |
| Vercel         | Hobby (Free)   | R$ 0,00    | 100 GB bandwidth/mês             |
| Expo           | Free           | R$ 0,00    | Builds ilimitados                |
| **TOTAL**      |                | **R$ 0,00**| Suporta milhares de usuários     |

---

## 📁 Estrutura do Projeto

```

shopping-list-app/
├── docs/ # 📄 Documentação completa
│ ├── 00-RESUMO-ARQUITETURA.md # ⭐ Comece aqui!
│ ├── 01-SRS-Documento-de-Requisitos.md
│ ├── 02-Documento-de-Arquitetura.md
│ ├── 03-Casos-de-Uso.md
│ ├── 04-Modelo-de-Dados-e-API.md
│ └── 05-Guia-de-Desenvolvimento.md
├── mobile/ # 📱 React Native (Expo)
├── web/ # 💻 React (Vite)
├── firebase/ # � Configurações Firebase
└── CHECKLIST-DESENVOLVIMENTO.md # ✅ Tarefas

````

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Google (para Firebase)
- Conta GitHub (para Vercel)

### 1. Clone o repositório

```bash
git clone https://github.com/rafSnow/shopping-list.git
cd shopping-list-app
````

### 2. Setup Firebase

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Criar projeto no Firebase Console
# https://console.firebase.google.com

# Inicializar Firebase
firebase init
```

### 3. Mobile (Expo)

```bash
cd mobile
npm install

# Criar arquivo .env com credenciais Firebase
# EXPO_PUBLIC_FIREBASE_API_KEY=...
# EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
# etc.

# Rodar app
npx expo start

# Escanear QR Code com Expo Go app
# ou pressione 'a' para Android, 'i' para iOS
```

### 4. Web (Vite + Vercel)

```bash
cd web
npm install

# Criar arquivo .env com credenciais Firebase
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_PROJECT_ID=...
# etc.

# Dev
npm run dev

# Build
npm run build

# Deploy (Vercel)
npm i -g vercel
vercel --prod
```

---

## 📚 Documentação

Toda a documentação de engenharia de software está na pasta `docs/`:

### 🎯 Comece Aqui

0. **[📋 Resumo da Arquitetura](docs/00-RESUMO-ARQUITETURA.md)** ⭐ **LEIA PRIMEIRO!**
   - Visão geral da arquitetura serverless
   - Por que Firebase + Vercel?
   - Limites e capacidades gratuitas

### 📖 Documentação Técnica

1. **[Documento de Requisitos](docs/01-SRS-Documento-de-Requisitos.md)**

   - Requisitos funcionais e não-funcionais
   - Casos de uso
   - Personas

2. **[Documento de Arquitetura](docs/02-Documento-de-Arquitetura.md)**

   - Arquitetura serverless detalhada
   - Componentes do sistema (Firebase, Vercel, Expo)
   - Fluxo de dados e sincronização
   - Padrões de design

3. **[Casos de Uso](docs/03-Casos-de-Uso.md)**

   - Diagramas UML
   - Cenários detalhados
   - Fluxos alternativos

4. **[Modelo de Dados e Firebase](docs/04-Modelo-de-Dados-e-API.md)**

   - Estrutura do Firestore
   - Security Rules
   - Operações CRUD
   - Exemplos de código

5. **[Guia de Desenvolvimento](docs/05-Guia-de-Desenvolvimento.md)**
   - Setup completo Firebase, Vercel e Expo
   - Configurações
   - Deploy
   - Troubleshooting

### ✅ Desenvolvimento

- **[Checklist de Desenvolvimento](CHECKLIST-DESENVOLVIMENTO.md)**
  - Tarefas organizadas por fase
  - Setup, desenvolvimento, deploy
  - Testes e monitoramento

---

## 🛠️ Stack Tecnológica

### Frontend Mobile

- **Framework:** React Native 0.73+
- **Platform:** Expo ~50
- **Language:** TypeScript 5.x
- **Database:** Firebase Firestore SDK
- **UI:** React Native Paper

### Frontend Web

- **Framework:** React 18.x
- **Bundler:** Vite 5.x
- **Language:** TypeScript 5.x
- **Database:** Firebase Web SDK
- **UI:** Material-UI (MUI)
- **Hosting:** Vercel

### Backend (Serverless)

- **Database:** Firebase Firestore (NoSQL)
- **Authentication:** Firebase Auth (opcional)
- **Storage:** Firebase Cloud Storage (se necessário)
- **Real-time:** Native Firestore listeners
- **Offline:** Native offline persistence

---

## ✨ Funcionalidades

### ✅ Implementadas (MVP)

- [x] Adicionar item à lista
- [x] Visualizar todos os itens
- [x] Remover item específico
- [x] Limpar toda a lista
- [x] Sincronização em tempo real (automática)
- [x] Suporte offline (nativo)
- [x] Validação de campos
- [x] Interface responsiva

### 🚧 Roadmap Futuro

- [ ] Autenticação de usuários (Firebase Auth)
- [ ] Múltiplas listas por usuário
- [ ] Compartilhar lista com outros usuários
- [ ] Categorias de itens
- [ ] Marcar item como comprado (checkbox)
- [ ] Quantidade de itens
- [ ] Fotos de produtos
- [ ] Estimativa de preço
- [ ] Notificações push
- [ ] Histórico de compras

---

## 🧪 Testes

### Manual Testing

```bash
# Mobile
cd mobile
npx expo start
# Testar em device ou emulator

# Web
cd web
npm run dev
# Abrir http://localhost:5173
```

### Testar Sincronização

1. Abrir app mobile em um device
2. Abrir web app em navegador
3. Adicionar item no mobile → deve aparecer no web (real-time)
4. Adicionar item no web → deve aparecer no mobile (real-time)

### Testar Modo Offline

1. Mobile: Ativar modo avião
2. Adicionar itens
3. Desativar modo avião
4. Itens devem sincronizar automaticamente

---

## 📊 Monitoramento

### Firebase Console

- **URL:** https://console.firebase.google.com
- Monitorar uso de Firestore (leituras/escritas)
- Verificar erros
- Analytics (se configurado)

### Vercel Dashboard

- **URL:** https://vercel.com/dashboard
- Monitorar deploys
- Analytics de acesso
- Performance

### Expo Dashboard

- **URL:** https://expo.dev
- Monitorar builds
- Distribuição de apps
- OTA updates

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

**Rafael Snow**

- GitHub: [@rafSnow](https://github.com/rafSnow)

---

## 🙏 Agradecimentos

- [Firebase](https://firebase.google.com) - Backend serverless gratuito
- [Vercel](https://vercel.com) - Hospedagem web gratuita
- [Expo](https://expo.dev) - Plataforma mobile gratuita
- [React](https://react.dev) - Framework incrível
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

## 📞 Suporte

Se tiver problemas ou dúvidas:

1. Consulte a [documentação](docs/)
2. Verifique o [checklist](CHECKLIST-DESENVOLVIMENTO.md)
3. Abra uma [issue](https://github.com/rafSnow/shopping-list/issues)

---

**Desenvolvido com ❤️ e ☕**

**Custo: R$ 0,00/mês** 🎉

- Casos de uso detalhados
- Critérios de aceitação

2. **[Documento de Arquitetura](docs/02-Documento-de-Arquitetura.md)**

   - Arquitetura do sistema
   - Decisões tecnológicas
   - Padrões de design
   - Escalabilidade

3. **[Casos de Uso](docs/03-Casos-de-Uso.md)**

   - Fluxos principais e alternativos
   - Diagramas de casos de uso
   - Regras de negócio

4. **[Modelo de Dados e API](docs/04-Modelo-de-Dados-e-API.md)**

   - Modelo de dados
   - Especificação da API REST
   - Documentação WebSocket
   - Exemplos de uso

5. **[Guia de Desenvolvimento](docs/05-Guia-de-Desenvolvimento.md)**
   - Setup de ambiente
   - Comandos úteis
   - Deploy
   - Troubleshooting

---

## 🔌 API Endpoints

### REST API

| Método | Endpoint           | Descrição               |
| ------ | ------------------ | ----------------------- |
| GET    | `/api/items`       | Listar todos os itens   |
| POST   | `/api/items`       | Adicionar novo item     |
| DELETE | `/api/items/{id}`  | Remover item específico |
| DELETE | `/api/items/clear` | Limpar toda a lista     |
| GET    | `/api/health`      | Health check            |

### WebSocket

- **Endpoint:** `ws://localhost:8080/ws/items`
- **Eventos:** `ITEM_ADDED`, `ITEM_REMOVED`, `LIST_CLEARED`

Veja documentação completa em [Modelo de Dados e API](docs/04-Modelo-de-Dados-e-API.md).

---

## 🎨 Features

### ✨ Funcionalidades Principais

- [x] Adicionar itens à lista
- [x] Remover itens individuais
- [x] Limpar lista completa
- [x] Sincronização em tempo real via WebSocket
- [x] Funcionamento offline com sincronização posterior
- [x] Notificações push quando parceiro adicionar itens
- [x] Interface responsiva e moderna
- [x] Suporte multiplataforma (Android, iOS, Web)

### 🔮 Roadmap Futuro

- [ ] Adicionar código PIN para segurança
- [ ] Modo escuro
- [ ] Múltiplas listas (compras, farmácia, etc)
- [ ] Sugestões baseadas em histórico
- [ ] Widget para tela inicial (mobile)
- [ ] Compartilhar lista via link

---

## 🛠️ Tecnologias Utilizadas

### Backend

- Java 17
- Spring Boot 3.2
- Spring Data JPA
- Spring WebSocket
- PostgreSQL / H2
- Maven

### Mobile

- React Native 0.73
- TypeScript 5
- Redux Toolkit
- React Navigation
- Socket.io
- AsyncStorage

### Web

- React 18
- TypeScript 5
- Vite
- Redux Toolkit
- Material-UI
- Socket.io

---

## 🧪 Testes

```bash
# Backend
cd backend
mvn test

# Mobile
cd mobile
npm test

# Web
cd web
npm test
```

---

## 📦 Deploy

### Backend

```bash
cd backend
mvn clean package
java -jar target/shopping-list-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Mobile

```bash
# Android
cd mobile/android
./gradlew assembleRelease

# iOS
cd mobile/ios
xcodebuild -workspace ShoppingList.xcworkspace -scheme ShoppingList -configuration Release
```

### Web

```bash
cd web
npm run build
# Deploy pasta dist/ para Vercel, Netlify, etc.
```

Veja guia completo em [Guia de Desenvolvimento](docs/05-Guia-de-Desenvolvimento.md).

---

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é de uso pessoal.

---

## 👥 Autores

- **Desenvolvedor Principal** - _Desenvolvimento completo_

---

## 🙏 Agradecimentos

- Comunidade Spring Boot
- Comunidade React Native
- Comunidade React
- Inspiração: necessidade real de organizar compras domésticas

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique a [documentação](docs/)
2. Veja a seção [Troubleshooting](docs/05-Guia-de-Desenvolvimento.md#9-troubleshooting)
3. Abra uma issue

---

**Feito com ❤️ para facilitar as compras do casal!**
