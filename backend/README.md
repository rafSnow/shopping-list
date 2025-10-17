# Shopping List Backend API

Backend Spring Boot para aplicação de lista de compras compartilhada.

## 🚀 Tecnologias

- Java 17
- Spring Boot 3.2
- Spring Data JPA
- Spring WebSocket
- PostgreSQL (produção)
- H2 Database (desenvolvimento)
- Maven

## 📋 Pré-requisitos

- Java JDK 17 ou superior
- Maven 3.9+
- PostgreSQL 15+ (para produção)

## ⚙️ Configuração

### Desenvolvimento (H2 Database)

```bash
# Executar com profile dev (padrão)
mvn spring-boot:run
```

A aplicação estará disponível em `http://localhost:8080`

Console H2: `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:shoppinglist`
- Username: `sa`
- Password: (vazio)

### Produção (PostgreSQL)

Configure as variáveis de ambiente:

```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/shoppinglist
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
export ALLOWED_ORIGINS=https://your-frontend.com
export WS_ALLOWED_ORIGINS=https://your-frontend.com
```

Execute com profile prod:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## 📡 Endpoints da API

### REST API

| Método | Endpoint           | Descrição             |
| ------ | ------------------ | --------------------- |
| GET    | `/api/items`       | Listar todos os itens |
| POST   | `/api/items`       | Adicionar item        |
| DELETE | `/api/items/{id}`  | Remover item          |
| DELETE | `/api/items/clear` | Limpar lista          |
| GET    | `/actuator/health` | Health check          |

### Exemplos de Requisição

#### Listar Itens

```bash
curl http://localhost:8080/api/items
```

#### Adicionar Item

```bash
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Leite"}'
```

#### Remover Item

```bash
curl -X DELETE http://localhost:8080/api/items/{uuid}
```

#### Limpar Lista

```bash
curl -X DELETE http://localhost:8080/api/items/clear
```

### WebSocket

**Endpoint:** `ws://localhost:8080/ws/items`

Eventos enviados:

- `ITEM_ADDED`: Quando item é adicionado
- `ITEM_REMOVED`: Quando item é removido
- `LIST_CLEARED`: Quando lista é limpa

## 🧪 Testes

```bash
# Executar todos os testes
mvn test

# Executar com coverage
mvn clean test jacoco:report

# Pular testes no build
mvn clean package -DskipTests
```

## 📦 Build

```bash
# Gerar JAR
mvn clean package

# O JAR estará em target/shopping-list-backend-1.0.0.jar

# Executar JAR
java -jar target/shopping-list-backend-1.0.0.jar
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t shopping-list-api .

# Executar container
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL=jdbc:postgresql://host:5432/db \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=password \
  shopping-list-api
```

## 📊 Monitoramento

### Actuator Endpoints

- Health: `http://localhost:8080/actuator/health`
- Info: `http://localhost:8080/actuator/info`
- Metrics: `http://localhost:8080/actuator/metrics`

## 🗄️ Estrutura do Projeto

```
src/main/java/com/shoppinglist/
├── ShoppingListApplication.java     # Classe principal
├── config/                          # Configurações
│   ├── CorsConfig.java
│   └── WebSocketConfig.java
├── controller/                      # Controllers REST
│   └── ItemController.java
├── dto/                            # Data Transfer Objects
│   ├── ApiResponse.java
│   ├── ClearResponse.java
│   ├── ErrorDetails.java
│   ├── ItemCreateRequest.java
│   ├── ItemDTO.java
│   └── ListResponse.java
├── exception/                      # Exceções e handlers
│   ├── GlobalExceptionHandler.java
│   └── ItemNotFoundException.java
├── model/                          # Entidades JPA
│   └── Item.java
├── repository/                     # Repositories
│   └── ItemRepository.java
└── service/                        # Lógica de negócio
    └── ItemService.java
```

## 🔧 Troubleshooting

### Porta já em uso

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Erro de conexão com banco

- Verificar se PostgreSQL está rodando
- Verificar credenciais em application-prod.properties
- Verificar URL de conexão

### WebSocket não conecta

- Verificar CORS em application.properties
- Verificar firewall
- Testar com SockJS fallback

## 📝 Licença

Projeto de uso pessoal.
