# Modelo de Dados e Firebase

## App de Lista de Compras Compartilhada

**Versão:** 2.0
**Data:** 17 de outubro de 2025
**Backend:** Firebase Firestore (NoSQL)

---

## 1. Modelo de Dados (Firestore)

### 1.1 Estrutura do Banco de Dados

```
Firestore Database
└── items (Collection)
    └── {itemId} (Document - Auto-generated ID)
        ├── name: string
        ├── createdAt: timestamp
        ├── updatedAt: timestamp
        └── deleted: boolean
```

### 1.2 Descrição dos Campos

#### Collection: items

| Campo     | Tipo      | Obrigatório | Indexado | Descrição                       |
| --------- | --------- | ----------- | -------- | ------------------------------- |
| id        | string    | Sim (auto)  | Sim      | ID gerado automaticamente       |
| name      | string    | Sim         | Não      | Nome do produto (1-200 chars)   |
| createdAt | timestamp | Sim         | Sim      | Data/hora de criação            |
| updatedAt | timestamp | Sim         | Não      | Data/hora da última atualização |
| deleted   | boolean   | Sim         | Sim      | Soft delete (false = ativo)     |

**Validações:**

- `name`: 1-200 caracteres, não vazio após trim
- `deleted`: padrão false
- `createdAt`: auto-gerado no cliente
- `updatedAt`: auto-gerado no cliente

---

## 2. Firebase Security Rules

### 2.1 Regras de Segurança (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Função auxiliar para validar item
    function validateItem() {
      let item = request.resource.data;
      return item.name is string
        && item.name.size() >= 1
        && item.name.size() <= 200
        && item.deleted is bool
        && item.createdAt is timestamp
        && item.updatedAt is timestamp;
    }

    // Regras para collection 'items'
    match /items/{itemId} {
      // MVP: Acesso público (sem autenticação)
      allow read: if true;
      allow create: if validateItem();
      allow update: if validateItem();
      allow delete: if true;

      // Para produção (com autenticação):
      // allow read: if request.auth != null;
      // allow create: if request.auth != null && validateItem();
      // allow update: if request.auth != null && validateItem();
      // allow delete: if request.auth != null;
    }
  }
}
```

### 2.2 Índices do Firestore

O Firestore criará índices automaticamente, mas você pode otimizar:

```
Collection: items
Campos indexados:
  - deleted (Ascending)
  - createdAt (Descending)

Query necessária:
  where('deleted', '==', false).orderBy('createdAt', 'desc')
```

**Criar índice composto via Firebase Console:**

1. Acesse Firebase Console → Firestore → Indexes
2. Crie índice composto:
   - Collection: `items`
   - Fields: `deleted (Ascending)`, `createdAt (Descending)`
   - Query scope: `Collection`

---

## 3. Operações com Firebase SDK

### 3.1 Configuração do Firebase

**TypeScript (Web e Mobile):**

```typescript
// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 3.2 CRUD Operations

#### 3.2.1 Criar Item (Create)

```typescript
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

async function createItem(name: string) {
  try {
    const docRef = await addDoc(collection(db, "items"), {
      name: name.trim(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deleted: false,
    });

    console.log("Item criado com ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar item:", error);
    throw error;
  }
}
```

#### 3.2.2 Listar Itens (Read) - Real-time

```typescript
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

function listenToItems(callback: (items: Item[]) => void) {
  const q = query(
    collection(db, "items"),
    where("deleted", "==", false),
    orderBy("createdAt", "desc")
  );

  // Real-time listener
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];

      callback(items);
    },
    (error) => {
      console.error("Erro ao escutar itens:", error);
    }
  );

  // Retorna função para cancelar listener
  return unsubscribe;
}

// Uso:
const unsubscribe = listenToItems((items) => {
  console.log("Itens atualizados:", items);
  updateUI(items);
});

// Cancelar quando não precisar mais
unsubscribe();
```

#### 3.2.3 Atualizar Item (Update)

```typescript
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

async function updateItem(itemId: string, newName: string) {
  try {
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, {
      name: newName.trim(),
      updatedAt: Timestamp.now(),
    });

    console.log("Item atualizado");
  } catch (error) {
    console.error("Erro ao atualizar item:", error);
    throw error;
  }
}
```

#### 3.2.4 Remover Item (Delete - Soft)

```typescript
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

async function deleteItem(itemId: string) {
  try {
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, {
      deleted: true,
      updatedAt: Timestamp.now(),
    });

    console.log("Item removido (soft delete)");
  } catch (error) {
    console.error("Erro ao remover item:", error);
    throw error;
  }
}
```

#### 3.2.5 Limpar Toda Lista (Clear All)

```typescript
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

async function clearAllItems() {
  try {
    const q = query(collection(db, "items"), where("deleted", "==", false));

    const snapshot = await getDocs(q);

    // Usar batch para operação atômica
    const batch = writeBatch(db);

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        deleted: true,
        updatedAt: Timestamp.now(),
      });
    });

    await batch.commit();
    console.log(`${snapshot.size} itens removidos`);
  } catch (error) {
    console.error("Erro ao limpar lista:", error);
    throw error;
  }
}
```

INSERT INTO items (name)
VALUES ('Leite')
RETURNING id, name, created_at, updated_at;

-- Remover item (soft delete)
UPDATE items
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = 'uuid-aqui'
AND deleted_at IS NULL
RETURNING id;

-- Limpar toda a lista
UPDATE items
SET deleted_at = CURRENT_TIMESTAMP
WHERE deleted_at IS NULL
RETURNING COUNT(\*);

-- Buscar itens atualizados após determinado timestamp (sincronização)
SELECT id, name, created_at, updated_at, deleted_at
FROM items
WHERE updated_at > '2025-10-16 10:00:00'
ORDER BY updated_at ASC;

-- Hard delete de itens antigos (cleanup - executar periodicamente)
DELETE FROM items
WHERE deleted_at IS NOT NULL
AND deleted_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

-- Estatísticas
SELECT
COUNT(_) FILTER (WHERE deleted_at IS NULL) as items_ativos,
COUNT(_) FILTER (WHERE deleted_at IS NOT NULL) as items_deletados,
COUNT(\*) as total
FROM items;

```

---

## 3. API REST Specification

### 3.1 Informações Gerais

**Base URL:** `http://localhost:8080/api`
**Produção:** `https://shopping-list-api.com/api`

**Formato:** JSON
**Charset:** UTF-8
**Versionamento:** `/api/v1` (futuro)

**Headers Padrão:**

```

Content-Type: application/json
Accept: application/json

````

### 3.2 Códigos de Status HTTP

| Código | Significado           | Uso                                  |
| ------ | --------------------- | ------------------------------------ |
| 200    | OK                    | Sucesso em GET, PUT                  |
| 201    | Created               | Sucesso em POST (criação)            |
| 204    | No Content            | Sucesso em DELETE                    |
| 400    | Bad Request           | Dados inválidos                      |
| 404    | Not Found             | Recurso não encontrado               |
| 500    | Internal Server Error | Erro no servidor                     |
| 503    | Service Unavailable   | Serviço temporariamente indisponível |

### 3.3 Estrutura de Resposta Padrão

#### Sucesso

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-10-16T10:30:00Z"
}
````

#### Erro

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Nome do item não pode ser vazio",
    "details": {}
  },
  "timestamp": "2025-10-16T10:30:00Z"
}
```

---

## 4. Endpoints da API

### 4.1 GET /api/items

**Descrição:** Retorna todos os itens ativos da lista

**Request:**

```http
GET /api/items HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| since | ISO8601 DateTime | Não | - | Retorna apenas itens atualizados após este timestamp |
| includeDeleted | Boolean | Não | false | Inclui itens deletados |

**Response 200 OK:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Leite",
      "createdAt": "2025-10-16T10:30:00Z",
      "updatedAt": "2025-10-16T10:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Pão",
      "createdAt": "2025-10-16T10:32:00Z",
      "updatedAt": "2025-10-16T10:32:00Z"
    }
  ],
  "count": 2,
  "timestamp": "2025-10-16T10:35:00Z"
}
```

**Response 500 Internal Server Error:**

```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Erro ao buscar itens"
  },
  "timestamp": "2025-10-16T10:35:00Z"
}
```

**Exemplo cURL:**

```bash
curl -X GET "http://localhost:8080/api/items" \
  -H "Accept: application/json"
```

---

### 4.2 POST /api/items

**Descrição:** Adiciona um novo item à lista

**Request:**

```http
POST /api/items HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Accept: application/json

{
  "name": "Arroz"
}
```

**Request Body:**

```json
{
  "name": "string (1-200 caracteres, obrigatório)"
}
```

**Validações:**

- `name` não pode ser vazio
- `name` não pode exceder 200 caracteres
- Espaços em branco são removidos (trim)

**Response 201 Created:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Arroz",
    "createdAt": "2025-10-16T10:40:00Z",
    "updatedAt": "2025-10-16T10:40:00Z"
  },
  "timestamp": "2025-10-16T10:40:00Z"
}
```

**Response 400 Bad Request:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Nome do item não pode ser vazio",
    "details": {
      "field": "name",
      "value": "",
      "constraint": "notEmpty"
    }
  },
  "timestamp": "2025-10-16T10:40:00Z"
}
```

**Exemplo cURL:**

```bash
curl -X POST "http://localhost:8080/api/items" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Arroz"}'
```

---

### 4.3 DELETE /api/items/{id}

**Descrição:** Remove um item específico da lista (soft delete)

**Request:**

```http
DELETE /api/items/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Path Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | UUID | ID do item a ser removido |

**Response 204 No Content:**

```
(Corpo vazio)
```

**Response 404 Not Found:**

```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Item não encontrado",
    "details": {
      "itemId": "550e8400-e29b-41d4-a716-446655440000"
    }
  },
  "timestamp": "2025-10-16T10:45:00Z"
}
```

**Response 400 Bad Request:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_UUID",
    "message": "ID inválido",
    "details": {
      "itemId": "invalid-uuid"
    }
  },
  "timestamp": "2025-10-16T10:45:00Z"
}
```

**Exemplo cURL:**

```bash
curl -X DELETE "http://localhost:8080/api/items/550e8400-e29b-41d4-a716-446655440000" \
  -H "Accept: application/json"
```

---

### 4.4 DELETE /api/items/clear

**Descrição:** Remove todos os itens da lista (limpar lista)

**Request:**

```http
DELETE /api/items/clear HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Response 200 OK:**

```json
{
  "success": true,
  "data": {
    "message": "Lista limpa com sucesso",
    "deletedCount": 15
  },
  "timestamp": "2025-10-16T10:50:00Z"
}
```

**Response 200 OK (lista já vazia):**

```json
{
  "success": true,
  "data": {
    "message": "Lista já estava vazia",
    "deletedCount": 0
  },
  "timestamp": "2025-10-16T10:50:00Z"
}
```

**Exemplo cURL:**

```bash
curl -X DELETE "http://localhost:8080/api/items/clear" \
  -H "Accept: application/json"
```

---

### 4.5 GET /api/health

**Descrição:** Health check do servidor (para monitoramento)

**Request:**

```http
GET /api/health HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Response 200 OK:**

```json
{
  "status": "UP",
  "timestamp": "2025-10-16T10:55:00Z",
  "components": {
    "database": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validConnection": true
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 500000000000,
        "free": 250000000000
      }
    }
  }
}
```

---

## 5. WebSocket API

### 5.1 Conexão WebSocket

**Endpoint:** `ws://localhost:8080/ws/items`
**Produção:** `wss://shopping-list-api.com/ws/items`

**Protocolo:** WebSocket (RFC 6455)

**Conexão:**

```javascript
const ws = new WebSocket("ws://localhost:8080/ws/items");

ws.onopen = () => {
  console.log("Conectado ao WebSocket");
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("Mensagem recebida:", message);
};

ws.onerror = (error) => {
  console.error("Erro WebSocket:", error);
};

ws.onclose = () => {
  console.log("Conexão fechada");
};
```

### 5.2 Mensagens do Servidor para Cliente

#### Evento: Item Adicionado

```json
{
  "type": "ITEM_ADDED",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Café",
    "createdAt": "2025-10-16T11:00:00Z",
    "updatedAt": "2025-10-16T11:00:00Z"
  },
  "timestamp": "2025-10-16T11:00:00Z",
  "deviceId": "device-123" // ID do dispositivo que fez a alteração
}
```

#### Evento: Item Removido

```json
{
  "type": "ITEM_REMOVED",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  },
  "timestamp": "2025-10-16T11:05:00Z",
  "deviceId": "device-123"
}
```

#### Evento: Lista Limpa

```json
{
  "type": "LIST_CLEARED",
  "data": {
    "deletedCount": 12
  },
  "timestamp": "2025-10-16T11:10:00Z",
  "deviceId": "device-123"
}
```

#### Evento: Ping (Keep-Alive)

```json
{
  "type": "PING",
  "timestamp": "2025-10-16T11:15:00Z"
}
```

**Cliente deve responder com:**

```json
{
  "type": "PONG",
  "timestamp": "2025-10-16T11:15:01Z"
}
```

#### Evento: Erro

```json
{
  "type": "ERROR",
  "error": {
    "code": "CONNECTION_ERROR",
    "message": "Erro na conexão"
  },
  "timestamp": "2025-10-16T11:20:00Z"
}
```

### 5.3 Mensagens do Cliente para Servidor

#### Registrar Dispositivo

```json
{
  "type": "REGISTER",
  "deviceId": "device-456",
  "platform": "android|ios|web"
}
```

**Resposta:**

```json
{
  "type": "REGISTERED",
  "deviceId": "device-456",
  "timestamp": "2025-10-16T11:25:00Z"
}
```

---

## 6. DTOs (Data Transfer Objects)

### 6.1 Backend (Java)

```java
// ItemDTO.java
public class ItemDTO {
    private String id;

    @NotBlank(message = "Nome não pode ser vazio")
    @Size(max = 200, message = "Nome não pode exceder 200 caracteres")
    private String name;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters, Setters, Construtores
}

// ItemCreateRequest.java
public class ItemCreateRequest {
    @NotBlank(message = "Nome não pode ser vazio")
    @Size(max = 200, message = "Nome não pode exceder 200 caracteres")
    private String name;

    // Getters, Setters
}

// ApiResponse.java
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private ErrorDetails error;
    private LocalDateTime timestamp;

    // Getters, Setters
}

// ErrorDetails.java
public class ErrorDetails {
    private String code;
    private String message;
    private Map<String, Object> details;

    // Getters, Setters
}
```

### 6.2 Frontend (TypeScript)

```typescript
// types/item.ts
export interface Item {
  id: string;
  name: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  synced?: boolean; // Para controle offline
}

export interface ItemCreateRequest {
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorDetails;
  timestamp: string;
}

export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ListResponse {
  data: Item[];
  count: number;
  timestamp: string;
}

export interface ClearResponse {
  message: string;
  deletedCount: number;
}

// WebSocket messages
export type WebSocketMessageType =
  | "ITEM_ADDED"
  | "ITEM_REMOVED"
  | "LIST_CLEARED"
  | "PING"
  | "PONG"
  | "ERROR";

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data?: any;
  timestamp: string;
  deviceId?: string;
}
```

---

## 7. Regras de Validação

### 7.1 Validação de Item

| Campo | Regra                          | Mensagem de Erro                       |
| ----- | ------------------------------ | -------------------------------------- |
| name  | Obrigatório                    | "Nome não pode ser vazio"              |
| name  | Mínimo 1 caractere (após trim) | "Nome não pode ser vazio"              |
| name  | Máximo 200 caracteres          | "Nome não pode exceder 200 caracteres" |
| name  | Não pode conter apenas espaços | "Nome inválido"                        |

### 7.2 Validação de UUID

```regex
^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$
```

---

## 8. Exemplos de Uso Completo

### 8.1 Fluxo: Adicionar Item

```javascript
// 1. Cliente envia requisição
const response = await fetch("http://localhost:8080/api/items", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Banana" }),
});

const result = await response.json();
// result = {
//   success: true,
//   data: { id: '...', name: 'Banana', ... },
//   timestamp: '2025-10-16T12:00:00Z'
// }

// 2. WebSocket notifica outros clientes
// Outros dispositivos recebem:
// {
//   type: 'ITEM_ADDED',
//   data: { id: '...', name: 'Banana', ... },
//   timestamp: '2025-10-16T12:00:00Z'
// }
```

### 8.2 Fluxo: Sincronização Offline

```javascript
// 1. Cliente está offline, adiciona item localmente
const localItem = {
  id: generateUUID(),
  name: "Tomate",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  synced: false,
};
await localStorage.setItem("pendingItems", JSON.stringify([localItem]));

// 2. Cliente volta online
const pendingItems = JSON.parse(await localStorage.getItem("pendingItems"));
for (const item of pendingItems) {
  const response = await fetch("http://localhost:8080/api/items", {
    method: "POST",
    body: JSON.stringify({ name: item.name }),
  });

  if (response.ok) {
    const result = await response.json();
    // Substituir ID local pelo ID do servidor
    item.id = result.data.id;
    item.synced = true;
  }
}
```

---

## 9. Códigos de Erro

| Código           | Mensagem                   | Descrição                    |
| ---------------- | -------------------------- | ---------------------------- |
| VALIDATION_ERROR | "Dados inválidos"          | Erro de validação de entrada |
| ITEM_NOT_FOUND   | "Item não encontrado"      | Item não existe no banco     |
| INVALID_UUID     | "ID inválido"              | UUID mal formatado           |
| DATABASE_ERROR   | "Erro no banco de dados"   | Erro ao acessar BD           |
| INTERNAL_ERROR   | "Erro interno do servidor" | Erro não esperado            |
| CONNECTION_ERROR | "Erro de conexão"          | WebSocket desconectado       |

---

## 10. Versionamento da API

**Versão Atual:** 1.0.0 (sem prefixo de versão)

**Futura (breaking changes):**

- `/api/v1/items`
- `/api/v2/items`

**Política:**

- Mudanças compatíveis: sem nova versão
- Breaking changes: nova versão (v2, v3...)
- Versão antiga mantida por 6 meses

---

**Fim do Documento**
