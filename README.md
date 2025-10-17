# 🛒 App de Lista de Compras Compartilhada

> Aplicativo multiplataforma para gerenciar lista de compras em tempo real entre você e sua esposa.

[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)](https://spring.io/projects/spring-boot)
[![React Native](https://img.shields.io/badge/React%20Native-0.73-blue)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

---

## 📋 Sobre o Projeto

Este é um aplicativo completo de lista de compras que permite a você e sua esposa:

- ✅ **Adicionar itens** durante a semana conforme consumirem
- ✅ **Sincronização em tempo real** entre todos os dispositivos
- ✅ **Funciona offline** e sincroniza quando tiver internet
- ✅ **Notificações** quando o parceiro adicionar itens
- ✅ **Limpar lista** com um botão para começar nova semana
- ✅ **Interface moderna e intuitiva**

### 🎯 Plataformas Suportadas

- 📱 **Mobile:** Android e iOS (React Native)
- 💻 **Web:** Navegadores modernos (React)
- 🖥️ **Backend:** API REST com Java Spring Boot

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────┐
│   Mobile (React Native)             │
│   iOS + Android                     │
└──────────────┬──────────────────────┘
               │
               │  HTTPS/WebSocket
               │
┌──────────────▼──────────────────────┐
│   Web (React)                       │
│   Navegadores                       │
└──────────────┬──────────────────────┘
               │
               │  REST API
               │
┌──────────────▼──────────────────────┐
│   Backend (Spring Boot)             │
│   Java 17 + WebSocket               │
└──────────────┬──────────────────────┘
               │
               │  JDBC
               │
┌──────────────▼──────────────────────┐
│   Database (PostgreSQL)             │
└─────────────────────────────────────┘
```

---

## 📁 Estrutura do Projeto

```
shopping-list-app/
├── docs/                    # 📄 Documentação completa
│   ├── 01-SRS-Documento-de-Requisitos.md
│   ├── 02-Documento-de-Arquitetura.md
│   ├── 03-Casos-de-Uso.md
│   ├── 04-Modelo-de-Dados-e-API.md
│   └── 05-Guia-de-Desenvolvimento.md
├── backend/                 # ☕ Spring Boot API
├── mobile/                  # 📱 React Native App
├── web/                     # 💻 React Web App
└── database/                # 🗄️ Scripts SQL
```

---

## 🚀 Quick Start

### Pré-requisitos

- **Backend:** Java 17+, Maven 3.9+
- **Mobile:** Node.js 18+, React Native CLI
- **Web:** Node.js 18+
- **Database:** PostgreSQL 15+ (ou H2 para dev)

### 1. Clone o repositório

```bash
git clone <repository-url>
cd shopping-list-app
```

### 2. Backend (API)

```bash
cd backend
mvn spring-boot:run

# API rodando em http://localhost:8080
```

### 3. Mobile

```bash
cd mobile
npm install

# Android
npm run android

# iOS (macOS apenas)
npm run ios
```

### 4. Web

```bash
cd web
npm install
npm run dev

# Web rodando em http://localhost:5173
```

---

## 📚 Documentação

Toda a documentação de engenharia de software está na pasta `docs/`:

1. **[Documento de Requisitos](docs/01-SRS-Documento-de-Requisitos.md)**

   - Requisitos funcionais e não-funcionais
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
