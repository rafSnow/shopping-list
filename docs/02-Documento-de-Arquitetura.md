# Documento de Arquitetura de Software

## App de Lista de Compras Compartilhada

**Versão:** 1.0  
**Data:** 16 de outubro de 2025

---

## 1. Visão Geral da Arquitetura

### 1.1 Arquitetura Geral

O sistema segue uma arquitetura **Cliente-Servidor** com três camadas principais:

```
┌─────────────────────────────────────────────────────────┐
│                    CAMADA CLIENTE                        │
├──────────────────────┬──────────────────────────────────┤
│   React Native App   │      React Web App               │
│   (iOS + Android)    │      (Navegadores)               │
└──────────────────────┴──────────────────────────────────┘
                          ↕ HTTPS/WebSocket
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE SERVIDOR                      │
├─────────────────────────────────────────────────────────┤
│              Java Spring Boot REST API                   │
│  ┌─────────────┬──────────────┬────────────────┐        │
│  │ Controllers │  Services    │  Repositories  │        │
│  └─────────────┴──────────────┴────────────────┘        │
└─────────────────────────────────────────────────────────┘
                          ↕ JDBC
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE DADOS                         │
├─────────────────────────────────────────────────────────┤
│              PostgreSQL / H2 Database                    │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Estilo Arquitetural

- **Backend:** Arquitetura em Camadas (Layered Architecture)
- **Frontend:** Component-Based Architecture (React/React Native)
- **Comunicação:** RESTful API + WebSocket para real-time
- **Dados:** Offline-First com sincronização

---

## 2. Componentes do Sistema

### 2.1 Backend - Spring Boot

#### 2.1.1 Camada de Controller (API Layer)

```
com.shoppinglist.controller
├── ItemController.java
│   ├── GET    /api/items          (Listar todos)
│   ├── POST   /api/items          (Adicionar item)
│   ├── DELETE /api/items/{id}     (Remover item)
│   └── DELETE /api/items/clear    (Limpar lista)
└── WebSocketController.java
    └── /ws/items                   (Notificações real-time)
```

#### 2.1.2 Camada de Service (Business Logic)

```
com.shoppinglist.service
├── ItemService.java
│   ├── getAllItems()
│   ├── addItem(ItemDTO)
│   ├── removeItem(UUID)
│   ├── clearAllItems()
│   └── syncItems(List<ItemDTO>)
└── NotificationService.java
    └── notifyClients(ItemEvent)
```

#### 2.1.3 Camada de Repository (Data Access)

```
com.shoppinglist.repository
└── ItemRepository.java
    extends JpaRepository<Item, UUID>
```

#### 2.1.4 Camada de Model (Domain)

```
com.shoppinglist.model
├── Item.java
│   ├── UUID id
│   ├── String name
│   ├── LocalDateTime createdAt
│   └── LocalDateTime updatedAt
└── ItemDTO.java
    ├── String id
    ├── String name
    ├── String createdAt
    └── boolean synced
```

### 2.2 Frontend Mobile - React Native

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
│   │   ├── api.ts                (Cliente HTTP)
│   │   ├── websocket.ts          (WebSocket client)
│   │   └── storage.ts            (AsyncStorage)
│   ├── store/
│   │   ├── itemsSlice.ts         (Redux slice)
│   │   └── store.ts              (Redux store)
│   ├── hooks/
│   │   ├── useItems.ts           (Hook personalizado)
│   │   └── useSync.ts            (Hook de sincronização)
│   └── utils/
│       ├── syncManager.ts        (Gerenciador offline)
│       └── notifications.ts      (Push notifications)
└── App.tsx
```

### 2.3 Frontend Web - React

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
│   │   ├── api.ts
│   │   └── websocket.ts
│   ├── store/
│   │   ├── itemsSlice.ts
│   │   └── store.ts
│   ├── hooks/
│   │   └── useItems.ts
│   └── styles/
│       └── global.css
└── App.tsx
```

---

## 3. Fluxo de Dados

### 3.1 Adicionar Item (Online)

```
1. Usuário digita item → ItemInput
2. ItemInput → dispatch(addItem)
3. Redux store atualizado (otimistic update)
4. API call → POST /api/items
5. Backend valida e persiste
6. Backend notifica via WebSocket
7. Outros clientes recebem e atualizam
```

### 3.2 Adicionar Item (Offline)

```
1. Usuário digita item → ItemInput
2. ItemInput → dispatch(addItem)
3. Redux store atualizado
4. Item salvo em AsyncStorage/localStorage
5. Item marcado como não sincronizado
6. Quando online: syncManager envia ao backend
7. Backend confirma → item marcado como sincronizado
```

### 3.3 Sincronização em Tempo Real

```
┌──────────┐                   ┌──────────┐
│ Cliente A│                   │ Cliente B│
└────┬─────┘                   └────┬─────┘
     │                              │
     │ POST /api/items              │
     ├────────────────────┐         │
     │                    ↓         │
     │              ┌──────────┐    │
     │              │  Backend │    │
     │              └──────────┘    │
     │                    │         │
     │                    │ WebSocket Broadcast
     │                    ├─────────┤
     │                    ↓         ↓
     │ ← Item adicionado  │  Item adicionado →
```

---

## 4. Decisões Arquiteturais

### 4.1 Tecnologias Escolhidas

| Componente         | Tecnologia                | Justificativa                           |
| ------------------ | ------------------------- | --------------------------------------- |
| Backend Framework  | Spring Boot               | Robusto, maduro, fácil configuração     |
| Linguagem Backend  | Java 17                   | Performance, tipagem forte, ecossistema |
| Banco de Dados     | PostgreSQL                | Confiável, open-source, suporte a JSON  |
| BD Desenvolvimento | H2                        | Rápido, em memória, fácil setup         |
| Frontend Mobile    | React Native              | Código compartilhado iOS/Android        |
| Frontend Web       | React                     | Componentização, vasto ecossistema      |
| Estado Global      | Redux Toolkit             | Gerenciamento previsível de estado      |
| Comunicação        | REST + WebSocket          | REST para operações, WS para real-time  |
| Storage Local      | AsyncStorage/localStorage | Suporte offline nativo                  |

### 4.2 Padrões de Design

#### 4.2.1 Backend

- **MVC (Model-View-Controller):** Separação clara de responsabilidades
- **Repository Pattern:** Abstração de acesso a dados
- **DTO (Data Transfer Object):** Separação entre entidades e API
- **Dependency Injection:** Gerenciado pelo Spring
- **Observer Pattern:** WebSocket para notificações

#### 4.2.2 Frontend

- **Component Pattern:** Componentes reutilizáveis
- **Container/Presenter:** Separação lógica/apresentação
- **Custom Hooks:** Lógica reutilizável
- **Redux Pattern:** Fluxo unidirecional de dados
- **Optimistic Update:** Melhor UX

---

## 5. Sincronização e Conflitos

### 5.1 Estratégia de Sincronização

#### Online:

- **WebSocket** para notificações instantâneas
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
