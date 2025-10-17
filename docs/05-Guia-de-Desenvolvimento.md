# Guia de Desenvolvimento e Deploy

## App de Lista de Compras Compartilhada

**Versão:** 1.0  
**Data:** 16 de outubro de 2025

---

## 1. Visão Geral do Projeto

### 1.1 Estrutura de Diretórios

```
shopping-list-app/
├── docs/                          # Documentação
│   ├── 01-SRS-Documento-de-Requisitos.md
│   ├── 02-Documento-de-Arquitetura.md
│   ├── 03-Casos-de-Uso.md
│   ├── 04-Modelo-de-Dados-e-API.md
│   └── 05-Guia-de-Desenvolvimento.md
│
├── backend/                       # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/shoppinglist/
│   │   │   │   ├── ShoppingListApplication.java
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── model/
│   │   │   │   ├── dto/
│   │   │   │   ├── config/
│   │   │   │   └── exception/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       └── application-prod.properties
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── mobile/                        # React Native App
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   └── constants/
│   ├── android/
│   ├── ios/
│   ├── package.json
│   ├── tsconfig.json
│   ├── app.json
│   └── README.md
│
├── web/                          # React Web App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── database/                     # Scripts SQL
│   ├── schema.sql
│   ├── seeds.sql
│   └── migrations/
│
└── README.md                     # Documentação principal
```

---

## 2. Tecnologias e Versões

### 2.1 Backend

| Tecnologia       | Versão | Propósito               |
| ---------------- | ------ | ----------------------- |
| Java             | 17 LTS | Linguagem principal     |
| Spring Boot      | 3.2.x  | Framework               |
| Spring Web       | -      | REST API                |
| Spring Data JPA  | -      | Acesso a dados          |
| Spring WebSocket | -      | Real-time communication |
| PostgreSQL       | 15+    | Banco de dados produção |
| H2 Database      | -      | Banco desenvolvimento   |
| Lombok           | -      | Redução de boilerplate  |
| MapStruct        | -      | Mapeamento DTO/Entity   |
| JUnit 5          | -      | Testes unitários        |
| Mockito          | -      | Mocks para testes       |
| Maven            | 3.9+   | Build tool              |

### 2.2 Frontend Mobile

| Tecnologia                     | Versão | Propósito               |
| ------------------------------ | ------ | ----------------------- |
| React Native                   | 0.73+  | Framework mobile        |
| TypeScript                     | 5.x    | Linguagem               |
| Redux Toolkit                  | 2.x    | Gerenciamento de estado |
| React Navigation               | 6.x    | Navegação               |
| Axios                          | 1.x    | Cliente HTTP            |
| AsyncStorage                   | -      | Storage local           |
| React Native Paper             | 5.x    | UI components           |
| Socket.io Client               | 4.x    | WebSocket               |
| React Native Push Notification | -      | Notificações            |

### 2.3 Frontend Web

| Tecnologia        | Versão | Propósito     |
| ----------------- | ------ | ------------- |
| React             | 18.x   | Framework     |
| TypeScript        | 5.x    | Linguagem     |
| Vite              | 5.x    | Build tool    |
| Redux Toolkit     | 2.x    | Estado global |
| React Router      | 6.x    | Roteamento    |
| Axios             | 1.x    | Cliente HTTP  |
| Socket.io Client  | 4.x    | WebSocket     |
| Material-UI (MUI) | 5.x    | UI components |
| Styled Components | 6.x    | Estilos       |

---

## 3. Configuração do Ambiente de Desenvolvimento

### 3.1 Pré-requisitos

#### Para Backend:

- Java JDK 17 ou superior
- Maven 3.9+
- PostgreSQL 15+ (ou usar H2 para dev)
- IDE: IntelliJ IDEA / Eclipse / VS Code

#### Para Mobile:

- Node.js 18+ e npm/yarn
- React Native CLI
- Android Studio (para Android)
- Xcode 14+ (para iOS - apenas macOS)
- Dispositivo físico ou emulador

#### Para Web:

- Node.js 18+ e npm/yarn
- Navegador moderno
- IDE: VS Code

### 3.2 Instalação - Backend

```bash
# 1. Clonar repositório
cd shopping-list-app/backend

# 2. Configurar banco de dados (dev usa H2, prod usa PostgreSQL)
# Editar src/main/resources/application-dev.properties se necessário

# 3. Build do projeto
mvn clean install

# 4. Executar aplicação
mvn spring-boot:run

# Ou executar com profile específico
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Aplicação estará disponível em http://localhost:8080
```

### 3.3 Instalação - Mobile

```bash
# 1. Navegar para pasta mobile
cd shopping-list-app/mobile

# 2. Instalar dependências
npm install
# ou
yarn install

# 3. Para iOS (apenas macOS)
cd ios && pod install && cd ..

# 4. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com a URL da API

# 5. Executar no Android
npm run android
# ou
yarn android

# 6. Executar no iOS
npm run ios
# ou
yarn ios

# Para executar com device específico
npm run android -- --deviceId=emulator-5554
npm run ios -- --simulator="iPhone 14 Pro"
```

### 3.4 Instalação - Web

```bash
# 1. Navegar para pasta web
cd shopping-list-app/web

# 2. Instalar dependências
npm install
# ou
yarn install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com a URL da API

# 4. Executar em modo desenvolvimento
npm run dev
# ou
yarn dev

# Aplicação estará disponível em http://localhost:5173
```

---

## 4. Configurações

### 4.1 Backend - application.properties

#### Desenvolvimento (application-dev.properties)

```properties
# Server
server.port=8080
spring.application.name=shopping-list-api

# Database H2 (in-memory para desenvolvimento)
spring.datasource.url=jdbc:h2:mem:shoppinglist
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# H2 Console (http://localhost:8080/h2-console)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# WebSocket
spring.websocket.allowed-origins=http://localhost:5173,http://localhost:3000

# Logging
logging.level.root=INFO
logging.level.com.shoppinglist=DEBUG
logging.level.org.springframework.web=DEBUG

# CORS
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

#### Produção (application-prod.properties)

```properties
# Server
server.port=${PORT:8080}
spring.application.name=shopping-list-api

# Database PostgreSQL
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# WebSocket
spring.websocket.allowed-origins=${WS_ALLOWED_ORIGINS}

# Logging
logging.level.root=WARN
logging.level.com.shoppinglist=INFO

# Security
server.ssl.enabled=true

# CORS
app.cors.allowed-origins=${ALLOWED_ORIGINS}
```

### 4.2 Mobile - .env

```bash
# API Configuration
API_BASE_URL=http://localhost:8080/api
WS_URL=ws://localhost:8080/ws

# Para device físico, use o IP da máquina
# API_BASE_URL=http://192.168.1.100:8080/api
# WS_URL=ws://192.168.1.100:8080/ws

# Production
# API_BASE_URL=https://shopping-list-api.com/api
# WS_URL=wss://shopping-list-api.com/ws

# Features
ENABLE_NOTIFICATIONS=true
SYNC_INTERVAL=30000
```

### 4.3 Web - .env

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws

# Production
# VITE_API_BASE_URL=https://shopping-list-api.com/api
# VITE_WS_URL=wss://shopping-list-api.com/ws

# Features
VITE_ENABLE_NOTIFICATIONS=true
VITE_SYNC_INTERVAL=30000
```

---

## 5. Comandos Úteis

### 5.1 Backend

```bash
# Compilar sem executar testes
mvn clean package -DskipTests

# Executar apenas testes
mvn test

# Executar com coverage
mvn clean test jacoco:report

# Gerar JAR
mvn clean package

# Executar JAR
java -jar target/shopping-list-0.0.1-SNAPSHOT.jar

# Executar com profile específico
java -jar target/shopping-list-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# Verificar dependências desatualizadas
mvn versions:display-dependency-updates
```

### 5.2 Mobile

```bash
# Limpar cache
npm start -- --reset-cache

# Build Android APK (debug)
cd android && ./gradlew assembleDebug

# Build Android APK (release)
cd android && ./gradlew assembleRelease

# Build iOS (release)
cd ios && xcodebuild -workspace ShoppingList.xcworkspace -scheme ShoppingList -configuration Release

# Logs em tempo real
# Android
adb logcat *:S ReactNative:V ReactNativeJS:V

# iOS
react-native log-ios

# Listar devices conectados
adb devices  # Android
xcrun simctl list  # iOS
```

### 5.3 Web

```bash
# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint

# Type check
npm run type-check

# Analisar bundle
npm run build -- --analyze
```

---

## 6. Testes

### 6.1 Backend - Estrutura de Testes

```java
// Unit Test Example
@SpringBootTest
class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemService itemService;

    @Test
    void shouldAddItemSuccessfully() {
        // Arrange
        ItemCreateRequest request = new ItemCreateRequest("Leite");
        Item item = new Item("Leite");
        when(itemRepository.save(any())).thenReturn(item);

        // Act
        ItemDTO result = itemService.addItem(request);

        // Assert
        assertNotNull(result);
        assertEquals("Leite", result.getName());
    }
}

// Integration Test Example
@SpringBootTest
@AutoConfigureMockMvc
class ItemControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnAllItems() throws Exception {
        mockMvc.perform(get("/api/items"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").isArray());
    }
}
```

### 6.2 Frontend - Estrutura de Testes

```typescript
// Component Test (React Testing Library)
import { render, screen, fireEvent } from '@testing-library/react';
import ItemInput from '../ItemInput';

describe('ItemInput', () => {
  it('should add item when form is submitted', () => {
    const onAdd = jest.fn();
    render(<ItemInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('Adicionar item...');
    fireEvent.change(input, { target: { value: 'Arroz' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(onAdd).toHaveBeenCalledWith('Arroz');
  });
});

// Redux Test
import itemsReducer, { addItem } from '../itemsSlice';

describe('itemsSlice', () => {
  it('should add item to state', () => {
    const previousState = { items: [], loading: false };
    const newState = itemsReducer(
      previousState,
      addItem({
        id: '1',
        name: 'Leite',
        createdAt: '2025-10-16T10:00:00Z',
        updatedAt: '2025-10-16T10:00:00Z',
      }),
    );

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].name).toBe('Leite');
  });
});
```

---

## 7. Deploy

### 7.1 Backend - Deploy em Servidor

#### Opção 1: JAR direto

```bash
# 1. Build
mvn clean package -DskipTests

# 2. Copiar para servidor
scp target/shopping-list-0.0.1-SNAPSHOT.jar user@server:/opt/shopping-list/

# 3. Executar no servidor
java -jar /opt/shopping-list/shopping-list-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  --server.port=8080
```

#### Opção 2: Docker

```dockerfile
# Dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/shopping-list-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
```

```bash
# Build imagem
docker build -t shopping-list-api .

# Executar container
docker run -d \
  -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://db:5432/shoppinglist \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=secret \
  --name shopping-list-api \
  shopping-list-api
```

#### Opção 3: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: shoppinglist
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  api:
    build: ./backend
    ports:
      - '8080:8080'
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DATABASE_URL: jdbc:postgresql://db:5432/shoppinglist
      DB_USERNAME: postgres
      DB_PASSWORD: secret
    depends_on:
      - db

volumes:
  postgres-data:
```

```bash
# Executar
docker-compose up -d

# Parar
docker-compose down
```

### 7.2 Mobile - Deploy

#### Android (Google Play)

```bash
# 1. Gerar keystore (apenas primeira vez)
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# 2. Configurar android/gradle.properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=******
MYAPP_RELEASE_KEY_PASSWORD=******

# 3. Build AAB (Android App Bundle)
cd android
./gradlew bundleRelease

# 4. AAB estará em: android/app/build/outputs/bundle/release/app-release.aab
# 5. Upload para Google Play Console
```

#### iOS (App Store)

```bash
# 1. Abrir Xcode
open ios/ShoppingList.xcworkspace

# 2. Configurar certificados e provisioning profiles
# 3. Selecionar "Generic iOS Device"
# 4. Product > Archive
# 5. Upload para App Store Connect via Organizer
```

### 7.3 Web - Deploy

#### Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
cd web
vercel

# Production
vercel --prod
```

#### Netlify

```bash
# 1. Build
npm run build

# 2. Instalar Netlify CLI
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=dist
```

#### Nginx (Servidor próprio)

```bash
# 1. Build
npm run build

# 2. Copiar para servidor
scp -r dist/* user@server:/var/www/shopping-list/

# 3. Configurar Nginx
```

```nginx
# /etc/nginx/sites-available/shopping-list
server {
    listen 80;
    server_name shopping-list.com;

    root /var/www/shopping-list;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

---

## 8. Monitoramento e Logs

### 8.1 Backend Logs

```bash
# Ver logs em tempo real
tail -f /var/log/shopping-list/application.log

# Buscar erros
grep "ERROR" /var/log/shopping-list/application.log

# Últimas 100 linhas
tail -n 100 /var/log/shopping-list/application.log
```

### 8.2 Spring Boot Actuator

```properties
# application.properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

**Endpoints:**

- `GET /actuator/health` - Status da aplicação
- `GET /actuator/info` - Informações da aplicação
- `GET /actuator/metrics` - Métricas

### 8.3 Database Monitoring

```sql
-- Ver conexões ativas
SELECT * FROM pg_stat_activity;

-- Ver tamanho do banco
SELECT pg_size_pretty(pg_database_size('shoppinglist'));

-- Ver tabelas e tamanhos
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 9. Troubleshooting

### 9.1 Backend

**Problema:** Erro ao conectar no banco de dados

```
Solution: Verificar credenciais em application.properties
          Verificar se PostgreSQL está rodando
          Verificar firewall/portas
```

**Problema:** WebSocket não conecta

```
Solution: Verificar CORS configuration
          Verificar se porta está aberta
          Verificar se cliente está usando protocolo correto (ws/wss)
```

### 9.2 Mobile

**Problema:** Não conecta na API (erro de rede)

```
Solution: Android - adicionar permissão INTERNET no AndroidManifest.xml
          iOS - configurar App Transport Security
          Verificar se API_BASE_URL está correta
          Para device físico, usar IP da máquina, não localhost
```

**Problema:** App crasha ao abrir

```
Solution: Limpar cache: npm start -- --reset-cache
          Reinstalar node_modules: rm -rf node_modules && npm install
          Rebuild: cd android && ./gradlew clean
```

### 9.3 Web

**Problema:** CORS error

```
Solution: Configurar CORS no backend
          Verificar se URL da API está correta
          Verificar se backend está rodando
```

---

## 10. Boas Práticas

### 10.1 Código

- ✅ Seguir convenções de nomenclatura
- ✅ Escrever testes para novas features
- ✅ Comentar código complexo
- ✅ Usar TypeScript no frontend
- ✅ Validar inputs no backend e frontend

### 10.2 Git

```bash
# Commits semânticos
feat: adiciona filtro de busca
fix: corrige bug ao remover item
docs: atualiza documentação da API
refactor: refatora serviço de sincronização
test: adiciona testes para ItemController
```

### 10.3 Segurança

- ✅ Nunca commitar senhas ou tokens
- ✅ Usar variáveis de ambiente
- ✅ Validar todos os inputs
- ✅ Usar HTTPS em produção
- ✅ Manter dependências atualizadas

---

**Fim do Documento**
