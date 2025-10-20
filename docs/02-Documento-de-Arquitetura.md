# Documento de Arquitetura de Software

## App de Lista de Compras Compartilhada

**Versão:** 2.0
**Data:** 17 de outubro de 2025
**Arquitetura:** Firebase + Vercel (100% Gratuita)

---

## 1. Visão Geral da Arquitetura

### 1.1 Arquitetura Geral

O sistema segue uma arquitetura **Serverless BaaS (Backend as a Service)** totalmente gratuita:

```
┌──────────────────────────────────────────────────────────────────┐
│                      CAMADA CLIENTE                               │
├────────────────────────────┬─────────────────────────────────────┤
│   React Native App (Expo)  │   React Web App (Vercel)            │
│   (iOS + Android)          │   (Navegadores)                     │
│   ✓ Gratuito               │   ✓ Gratuito                        │
└────────────────────────────┴─────────────────────────────────────┘
                          ↕ HTTPS (Firebase SDK)
┌──────────────────────────────────────────────────────────────────┐
│                    FIREBASE SERVICES (Gratuito)                   │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────┬───────────────────┬──────────────────┐         │
│  │ Firestore    │  Authentication   │  Cloud Storage   │         │
│  │ (Database)   │  (Auth)           │  (Files)         │         │
│  │ Real-time    │  Anonymous/Email  │  5GB             │         │
│  │ 50k/dia      │  10k/mês          │  1GB/dia         │         │
│  └──────────────┴───────────────────┴──────────────────┘         │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 Estilo Arquitetural

- **Backend:** BaaS (Backend as a Service) - Serverless
- **Frontend:** Component-Based Architecture (React/React Native)
- **Comunicação:** Firebase SDK (Real-time Database/Firestore)
- **Dados:** Offline-First nativo com sincronização automática
- **Hospedagem Web:** Vercel (CDN Global)
- **Hospedagem Mobile:** Expo (Build e distribuição gratuita)

---

## 2. Componentes do Sistema

### 2.1 Firebase Backend (Serverless)

#### 2.1.1 Cloud Firestore (Database)

```
shopping-list (Collection)
├── items (Collection)
│   └── {itemId} (Document)
│       ├── id: string (auto-generated)
│       ├── name: string
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       └── deleted: boolean
```

**Características:**

- ✅ Real-time sincronização automática
- ✅ Offline persistence nativa
- ✅ 50k leituras/dia (gratuito)
- ✅ 20k escritas/dia (gratuito)
- ✅ 1GB armazenamento (gratuito)

#### 2.1.2 Firebase Authentication (Opcional)

```
Métodos disponíveis:
├── Anonymous (recomendado para MVP)
├── Email/Password
└── Google Sign-In
```

**Características:**

- ✅ 10k autenticações/mês (gratuito)
- ✅ Configuração simples
- ✅ Segurança integrada

#### 2.1.3 Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      // Permitir leitura e escrita para todos (MVP)
      allow read, write: if true;

      // Para produção com autenticação:
      // allow read: if request.auth != null;
      // allow create: if request.auth != null && validateItem();
      // allow update, delete: if request.auth != null;
    }
  }
}
```

### 2.2 Frontend Mobile - React Native (Expo)

```
shopping-list-mobile/
├── src/
│   ├── components/
│   │   ├── ItemList.tsx          (Lista de itens)
│   │   ├── ItemInput.tsx         (Campo de entrada)
│   │   ├── ItemCard.tsx          (Card individual)
│   │   └── ClearButton.tsx       (Botão limpar)
│   ├── screens/
│   │   └── HomeScreen.tsx        (Tela principal)
│   ├── services/
│   │   └── firebase.ts           (Firebase config & services)
│   ├── hooks/
│   │   ├── useItems.ts           (Hook para itens)
│   │   └── useFirestore.ts       (Hook Firestore)
│   └── types/
│       └── Item.ts               (Tipos TypeScript)
├── app.json                      (Expo config)
├── firebase.json                 (Firebase config)
└── App.tsx
```

**Dependências principais:**

- `firebase` - SDK Firebase
- `@react-native-firebase/app` - Firebase core
- `@react-native-firebase/firestore` - Firestore
- `expo` - Build e distribuição

### 2.3 Frontend Web - React (Vercel)

```
shopping-list-web/
├── src/
│   ├── components/
│   │   ├── ItemList.tsx
│   │   ├── ItemInput.tsx
│   │   ├── ItemCard.tsx
│   │   ├── Header.tsx
│   │   └── ClearButton.tsx
│   ├── pages/
│   │   └── HomePage.tsx
│   ├── services/
│   │   └── firebase.ts           (Firebase config)
│   ├── hooks/
│   │   └── useItems.ts
│   └── styles/
│       └── global.css
├── firebase.json                 (Firebase config)
├── vercel.json                   (Vercel config)
└── App.tsx
```

**Dependências principais:**

- `firebase` - SDK Firebase (Web)
- `react` - Framework
- `vite` - Build tool

---

## 3. Fluxo de Dados

### 3.1 Adicionar Item (Online/Offline - Automático)

```
1. Usuário digita item → ItemInput
2. ItemInput → firebase.firestore().collection('items').add()
3. Firebase SDK adiciona localmente (cache)
4. Interface atualizada instantaneamente (optimistic update)
5. Firebase sincroniza com servidor quando online
6. Outros clientes recebem atualização em tempo real
```

**Vantagens:**

- ✅ Funciona offline automaticamente
- ✅ Sincronização transparente
- ✅ Sem código de sincronização manual
- ✅ Real-time out-of-the-box

### 3.2 Sincronização em Tempo Real (Nativa)

```
┌──────────┐                   ┌──────────┐
│ Cliente A│                   │ Cliente B│
└────┬─────┘                   └────┬─────┘
     │                              │
     │ firestore.add()              │
     ├───────────────────┐          │
     │                   ↓          │
     │          ┌─────────────┐     │
     │          │  Firestore  │     │
     │          │  (Cloud)    │     │
     │          └─────────────┘     │
     │                   │          │
     │    Real-time Listener        │
     │  ◄────────┼──────────────────┤
     │           │                  │
     │ Atualizado│         Atualizado
```

### 3.3 Operações CRUD

```typescript
// Adicionar item
await firestore().collection("items").add({
  name: "Leite",
  createdAt: new Date(),
  deleted: false,
});

// Listar itens (com listener real-time)
firestore()
  .collection("items")
  .where("deleted", "==", false)
  .orderBy("createdAt", "desc")
  .onSnapshot((snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    updateUI(items);
  });

// Remover item (soft delete)
await firestore().collection("items").doc(itemId).update({
  deleted: true,
  updatedAt: new Date(),
});

// Limpar lista
const batch = firestore().batch();
snapshot.docs.forEach((doc) => {
  batch.update(doc.ref, { deleted: true });
});
await batch.commit();
```

---

## 4. Decisões Arquiteturais

### 4.1 Tecnologias Escolhidas

| Componente           | Tecnologia       | Justificativa                                   | Custo   |
| -------------------- | ---------------- | ----------------------------------------------- | ------- |
| Backend/Database     | Firebase         | Serverless, real-time, offline-first nativo     | R$ 0,00 |
| Hospedagem Web       | Vercel           | Deploy automático, CDN global, SSL grátis       | R$ 0,00 |
| Mobile Framework     | React Native     | Código compartilhado iOS/Android                | R$ 0,00 |
| Mobile Build/Deploy  | Expo             | Build na nuvem, OTA updates, distribuição fácil | R$ 0,00 |
| Frontend Web         | React + Vite     | Rápido, moderno, otimizado                      | R$ 0,00 |
| Autenticação         | Firebase Auth    | Integrado, seguro, múltiplos providers          | R$ 0,00 |
| Storage (se needed)  | Firebase Storage | Armazenamento de arquivos integrado             | R$ 0,00 |
| Analytics (opcional) | Firebase         | Analytics gratuito integrado                    | R$ 0,00 |

**Total de custos: R$ 0,00 / mês** 🎉

### 4.2 Padrões de Design

#### 4.2.1 Frontend (Mobile e Web)

- **Component Pattern:** Componentes reutilizáveis React
- **Custom Hooks:** Lógica reutilizável (`useItems`, `useFirestore`)
- **Observer Pattern:** Firebase listeners para real-time
- **Optimistic Update:** Firebase SDK gerencia automaticamente
- **Offline-First:** Persistência local automática do Firebase

#### 4.2.2 Firebase

- **NoSQL Document Database:** Firestore collections/documents
- **Real-time Listeners:** onSnapshot para sincronização
- **Security Rules:** Validação no servidor
- **Batch Operations:** Operações em lote para performance

### 4.3 Comparação: Arquitetura Anterior vs Nova

| Aspecto            | Spring Boot + PostgreSQL     | Firebase + Vercel             |
| ------------------ | ---------------------------- | ----------------------------- |
| **Custo**          | Servidor pago (~R$20-50/mês) | **R$ 0,00**                   |
| **Manutenção**     | Alta (servidor, DB, deploy)  | **Zero (gerenciado)**         |
| **Escalabilidade** | Manual                       | **Automática**                |
| **Real-time**      | WebSocket (complexo)         | **Nativo (simples)**          |
| **Offline**        | Implementação manual         | **Nativo (automático)**       |
| **Setup inicial**  | Complexo (~2-3 dias)         | **Rápido (~2-3 horas)**       |
| **Deploy**         | Manual (CI/CD necessário)    | **Automático (git push)**     |
| **Backup**         | Manual                       | **Automático**                |
| **SSL/HTTPS**      | Configuração necessária      | **Incluído**                  |
| **CDN**            | Não incluído                 | **Global CDN incluído**       |
| **Logs/Monitor**   | Implementar                  | **Firebase Console incluído** |

### 4.4 Vantagens da Nova Arquitetura

✅ **Zero custos operacionais**
✅ **Sem servidor para gerenciar**
✅ **Real-time sincronização nativa**
✅ **Offline-first automático**
✅ **Escalabilidade automática**
✅ **Deploy em segundos**
✅ **SSL e CDN incluídos**
✅ **Backup automático**
✅ **Menor complexidade de código**
✅ **Ideal para MVP e validação**

---

## 5. Limites do Plano Gratuito (Firebase Spark)

### 5.1 Firestore

| Recurso               | Limite Gratuito | Suficiente para            |
| --------------------- | --------------- | -------------------------- |
| Leituras/dia          | 50.000          | ~2.000 usuários ativos/dia |
| Escritas/dia          | 20.000          | ~800 atualizações/hora     |
| Exclusões/dia         | 20.000          | ~800 exclusões/hora        |
| Armazenamento         | 1 GB            | ~1 milhão de documentos    |
| Transferência de rede | 10 GB/mês       | ~300.000 operações/mês     |

### 5.2 Vercel

| Recurso         | Limite Gratuito | Suficiente para       |
| --------------- | --------------- | --------------------- |
| Bandwidth       | 100 GB/mês      | ~100.000 visitas/mês  |
| Builds          | Ilimitados      | Deploy a cada commit  |
| Serverless Exec | 100 GB-Horas    | Amplamente suficiente |
| Projetos        | Ilimitados      | Quantos você quiser   |

### 5.3 Expo

| Recurso      | Limite Gratuito | Suficiente para          |
| ------------ | --------------- | ------------------------ |
| Builds       | Ilimitados      | Builds ilimitados        |
| OTA Updates  | Ilimitados      | Updates over-the-air     |
| Distribuição | Gratuito        | TestFlight, Play Console |

### 5.4 Estimativa de Capacidade

**Cenário Realista (Uso Moderado):**

- 100 usuários ativos/dia
- 10 ações por usuário/dia
- Total: 1.000 operações/dia
- **Uso: 2% do limite gratuito** ✅

**Cenário Otimista (Muito Uso):**

- 1.000 usuários ativos/dia
- 20 ações por usuário/dia
- Total: 20.000 operações/dia
- **Uso: 40% do limite gratuito** ✅

**Conclusão:** O plano gratuito é **mais que suficiente** para MVP e primeiros anos de operação!

- **Polling fallback** a cada 30 segundos se WebSocket falhar

#### Offline:

- Todas as operações salvas localmente
- Fila de sincronização (FIFO)
- Ao reconectar: enviar todas as alterações pendentes

### 5.2 Resolução de Conflitos

Como não há autenticação individual, usamos **Last-Write-Wins (LWW)**:

- Cada item tem timestamp de atualização
- Em caso de conflito, a alteração mais recente prevalece
- Remoções têm prioridade sobre adições (soft delete temporário)

```
Cenário de Conflito:
- Device A (offline): adiciona "Leite" às 10:00
- Device B (online): adiciona "Leite" às 10:05
- Device A reconecta às 10:10

Resolução:
- Backend mantém item de Device B (mais recente)
- Device A recebe confirmação e atualiza
```

---

## 6. Segurança

### 6.1 Medidas de Segurança

| Camada           | Medida                | Implementação           |
| ---------------- | --------------------- | ----------------------- |
| Transporte       | HTTPS/WSS             | Certificado SSL/TLS     |
| Input Validation | Sanitização           | Bean Validation + RegEx |
| SQL Injection    | Prepared Statements   | JPA/Hibernate           |
| XSS              | Escape de HTML        | React auto-escape       |
| Rate Limiting    | Limitação de requests | Spring Rate Limiter     |
| CORS             | Cross-Origin          | Spring CORS config      |

### 6.2 Sem Autenticação

⚠️ **Nota:** Sistema sem autenticação por escolha do cliente.

- Lista é pública (qualquer um com URL pode acessar)
- **Recomendação futura:** Adicionar código PIN simples para acesso

---

## 7. Escalabilidade

### 7.1 Arquitetura Atual (MVP)

```
[Clientes] → [Spring Boot App] → [PostgreSQL]
                    ↓
            [WebSocket Server]
```

### 7.2 Escalabilidade Futura

```
[Clientes] → [Load Balancer]
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
    [App Server 1]         [App Server 2]
        ↓                       ↓
    [Redis Pub/Sub] ← → [Redis Pub/Sub]
        ↓                       ↓
        └───────────┬───────────┘
                    ↓
            [PostgreSQL Master]
                    ↓
          [PostgreSQL Replicas]
```

**Melhorias futuras:**

- Cache com Redis
- Load Balancer (Nginx)
- Horizontal scaling do backend
- CDN para assets web
- Database replication

---

## 8. Monitoramento e Logs

### 8.1 Logs

- **Backend:** SLF4J + Logback
- **Níveis:** INFO (operações), ERROR (falhas), DEBUG (desenvolvimento)
- **Formato:** JSON para fácil parsing

### 8.2 Métricas

- Spring Boot Actuator para health checks
- Métricas de API (response time, error rate)
- Conexões WebSocket ativas

### 8.3 Alertas

- Falhas de sincronização
- Erros de banco de dados
- Alta latência de API

---

## 9. Deployment

### 9.1 Backend

```
Ambiente DEV:
- H2 in-memory database
- Spring Profile: dev
- Port: 8080

Ambiente PROD:
- PostgreSQL
- Spring Profile: prod
- Port: 443 (HTTPS)
- Deploy: Docker container ou JAR
```

### 9.2 Mobile

```
Android:
- Build: APK/AAB
- Store: Google Play ou sideload
- Versão mínima: Android 8.0 (API 26)

iOS:
- Build: IPA
- Store: App Store ou TestFlight
- Versão mínima: iOS 13.0
```

### 9.3 Web

```
Build: npm run build
Deploy:
- Vercel / Netlify (recomendado)
- Nginx + servidor próprio
Assets: CDN (opcional)
```

---

## 10. Estrutura do Banco de Dados

### 10.1 Tabela: items

```sql
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX idx_items_deleted_at ON items(deleted_at);
CREATE INDEX idx_items_updated_at ON items(updated_at);
```

**Soft Delete:** Campo `deleted_at` para não perder histórico imediato

---

## 11. API REST Specification

### 11.1 Endpoints

#### GET /api/items

**Descrição:** Retorna todos os itens não deletados

```json
Response 200 OK:
{
  "data": [
    {
      "id": "uuid-v4",
      "name": "Leite",
      "createdAt": "2025-10-16T10:30:00Z",
      "updatedAt": "2025-10-16T10:30:00Z"
    }
  ],
  "count": 1,
  "timestamp": "2025-10-16T10:35:00Z"
}
```

#### POST /api/items

**Descrição:** Adiciona novo item

```json
Request Body:
{
  "name": "Arroz"
}

Response 201 Created:
{
  "data": {
    "id": "uuid-v4",
    "name": "Arroz",
    "createdAt": "2025-10-16T10:30:00Z",
    "updatedAt": "2025-10-16T10:30:00Z"
  }
}
```

#### DELETE /api/items/{id}

**Descrição:** Remove item específico

```json
Response 204 No Content
```

#### DELETE /api/items/clear

**Descrição:** Remove todos os itens (nova semana)

```json
Response 200 OK:
{
  "message": "Lista limpa com sucesso",
  "deletedCount": 15
}
```

### 11.2 WebSocket

#### Endpoint: ws://domain/ws/items

**Eventos:**

```json
// Item adicionado
{
  "type": "ITEM_ADDED",
  "data": {
    "id": "uuid",
    "name": "Banana"
  },
  "timestamp": "2025-10-16T10:30:00Z"
}

// Item removido
{
  "type": "ITEM_REMOVED",
  "data": {
    "id": "uuid"
  },
  "timestamp": "2025-10-16T10:30:00Z"
}

// Lista limpa
{
  "type": "LIST_CLEARED",
  "timestamp": "2025-10-16T10:30:00Z"
}
```

---

## 12. Performance

### 12.1 Requisitos

- Adicionar item: < 500ms
- Carregar lista: < 1s
- Sincronização: < 2s
- Suporte: 500+ itens

### 12.2 Otimizações

- Índices no banco de dados
- Paginação (se lista > 100 itens)
- Compressão Gzip para API
- Lazy loading de componentes
- Memoization no React
- Virtual scrolling para listas grandes

---

## 13. Testes

### 13.1 Backend

- **Unit Tests:** JUnit 5 + Mockito
- **Integration Tests:** Spring Boot Test + TestContainers
- **API Tests:** RestAssured
- **Coverage:** > 80%

### 13.2 Frontend

- **Unit Tests:** Jest + React Testing Library
- **Component Tests:** Storybook
- **E2E Tests:** Detox (mobile) / Cypress (web)
- **Coverage:** > 70%

---

## 14. Diagramas

### 14.1 Diagrama de Sequência - Adicionar Item

```
Usuário    Mobile App    Backend    Database    Outro Device
   │           │            │           │            │
   │  digita   │            │           │            │
   ├──────────>│            │           │            │
   │           │  POST      │           │            │
   │           ├───────────>│           │            │
   │           │            │  INSERT   │            │
   │           │            ├──────────>│            │
   │           │            │<──────────┤            │
   │           │            │  WS Notify│            │
   │           │            ├───────────┼───────────>│
   │           │  201 OK    │           │            │
   │           │<───────────┤           │            │
   │  atualiza │            │           │  atualiza  │
   │<──────────┤            │           │<───────────┤
```

---

**Fim do Documento**
