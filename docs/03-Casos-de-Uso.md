# Diagrama de Casos de Uso

## App de Lista de Compras Compartilhada

**Versão:** 1.0  
**Data:** 16 de outubro de 2025

---

## 1. Atores

### Usuário Principal

- **Descrição:** Pessoa que utiliza o aplicativo para gerenciar lista de compras
- **Exemplos:** Marido, esposa
- **Características:** Uso casual, acesso via mobile ou web

### Sistema (Ator Secundário)

- **Descrição:** Componentes automáticos do sistema
- **Responsabilidades:** Sincronização, notificações, persistência

---

## 2. Diagrama de Casos de Uso

```
                    Sistema de Lista de Compras
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                  ┌─────────────────┐                       │
│                  │  Adicionar Item │                       │
│                  └────────┬────────┘                       │
│                           │                                │
│   ┌──────────┐            │                                │
│   │          │◄───────────┤                                │
│   │ Usuário  │            │         ┌──────────────────┐   │
│   │          │◄───────────┼────────►│  Visualizar      │   │
│   └──────────┘            │         │  Lista           │   │
│        │                  │         └──────────────────┘   │
│        │                  │                                │
│        │                  │         ┌──────────────────┐   │
│        │                  └────────►│  Remover Item    │   │
│        │                            └──────────────────┘   │
│        │                                                    │
│        │                            ┌──────────────────┐   │
│        └───────────────────────────►│  Limpar Lista    │   │
│        │                            └──────────────────┘   │
│        │                                      │             │
│        │                            ┌─────────▼────────┐   │
│        │                            │  Confirmar Ação  │   │
│        │                            └──────────────────┘   │
│        │                            «include»              │
│        │                                                    │
│        │                            ┌──────────────────┐   │
│        └───────────────────────────►│  Receber         │   │
│                                     │  Notificação     │   │
│                                     └──────────────────┘   │
│                                                            │
│                                     ┌──────────────────┐   │
│                                     │  Sincronizar     │   │
│  ┌──────────┐                      │  Dados           │   │
│  │ Sistema  │◄────────────────────►└──────────────────┘   │
│  └──────────┘                            «extends»         │
│                                           │                │
│                                     ┌─────▼──────────┐     │
│                                     │  Sincronizar   │     │
│                                     │  Offline       │     │
│                                     └────────────────┘     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 3. Especificação dos Casos de Uso

### UC001: Adicionar Item

| **Campo**              | **Descrição**                                                            |
| ---------------------- | ------------------------------------------------------------------------ |
| **ID**                 | UC001                                                                    |
| **Nome**               | Adicionar Item à Lista                                                   |
| **Ator Principal**     | Usuário                                                                  |
| **Atores Secundários** | Sistema de Sincronização                                                 |
| **Pré-condições**      | • Aplicativo aberto<br>• Conexão com internet (preferencial)             |
| **Pós-condições**      | • Item adicionado à lista<br>• Item sincronizado com outros dispositivos |
| **Trigger**            | Usuário deseja adicionar item à lista de compras                         |

#### Fluxo Principal

1. Usuário abre o aplicativo
2. Usuário clica no campo de entrada ou botão "+"
3. Usuário digita o nome do item (ex: "Leite")
4. Usuário pressiona Enter ou clica em "Adicionar"
5. Sistema valida o nome do item (não vazio, <= 200 caracteres)
6. Sistema adiciona item à lista local imediatamente (optimistic update)
7. Sistema envia requisição ao backend
8. Backend persiste o item no banco de dados
9. Backend notifica outros dispositivos via WebSocket
10. Sistema exibe confirmação visual (animação/feedback)
11. Outros dispositivos recebem e exibem o novo item

#### Fluxos Alternativos

**A1: Nome vazio**

- 5a. Sistema detecta que o nome está vazio
- 5b. Sistema exibe mensagem de erro: "Por favor, digite o nome do item"
- 5c. Fluxo retorna ao passo 3

**A2: Nome muito longo**

- 5a. Sistema detecta que nome excede 200 caracteres
- 5b. Sistema limita automaticamente ou exibe aviso
- 5c. Fluxo continua no passo 6

**A3: Sem conexão (offline)**

- 7a. Sistema detecta ausência de conexão
- 7b. Sistema salva item localmente com flag "não sincronizado"
- 7c. Sistema exibe indicador "Modo Offline"
- 7d. Quando conexão for restabelecida, Sistema executa passos 7-9

**A4: Erro no backend**

- 8a. Backend retorna erro (500, 503, etc.)
- 8b. Sistema mantém item local
- 8c. Sistema marca item para re-tentativa
- 8d. Sistema exibe mensagem: "Item salvo localmente, sincronizando..."
- 8e. Sistema tenta novamente após 30 segundos

#### Requisitos Especiais

- **Performance:** Feedback visual em < 100ms
- **Usabilidade:** Campo de entrada deve estar sempre acessível
- **Acessibilidade:** Suporte a leitores de tela

#### Frequência de Uso

- Alta (múltiplas vezes por dia)

---

### UC002: Visualizar Lista

| **Campo**              | **Descrição**               |
| ---------------------- | --------------------------- |
| **ID**                 | UC002                       |
| **Nome**               | Visualizar Lista de Compras |
| **Ator Principal**     | Usuário                     |
| **Atores Secundários** | Sistema                     |
| **Pré-condições**      | • Aplicativo instalado      |
| **Pós-condições**      | • Lista exibida na tela     |
| **Trigger**            | Usuário abre o aplicativo   |

#### Fluxo Principal

1. Usuário abre o aplicativo
2. Sistema carrega itens do armazenamento local
3. Sistema exibe lista imediatamente (cache)
4. Sistema verifica conexão com internet
5. Se online, Sistema busca atualizações do backend
6. Sistema mescla dados locais com dados do servidor
7. Sistema atualiza interface com dados mais recentes
8. Sistema exibe indicador de status de sincronização

#### Fluxos Alternativos

**A1: Lista vazia**

- 3a. Sistema detecta que lista está vazia
- 3b. Sistema exibe mensagem amigável: "Sua lista está vazia. Adicione itens para começar!"
- 3c. Sistema destaca campo de entrada

**A2: Primeira vez (sem cache)**

- 2a. Não há dados locais
- 2b. Sistema exibe loading
- 2c. Sistema busca dados do servidor
- 2d. Fluxo continua no passo 7

**A3: Erro ao carregar**

- 5a. Falha na conexão com servidor
- 5b. Sistema exibe dados locais (cache)
- 5c. Sistema exibe aviso: "Usando dados locais"
- 5d. Sistema tenta reconectar em background

---

### UC003: Remover Item

| **Campo**              | **Descrição**                                      |
| ---------------------- | -------------------------------------------------- |
| **ID**                 | UC003                                              |
| **Nome**               | Remover Item da Lista                              |
| **Ator Principal**     | Usuário                                            |
| **Atores Secundários** | Sistema                                            |
| **Pré-condições**      | • Lista contém pelo menos um item                  |
| **Pós-condições**      | • Item removido da lista<br>• Mudança sincronizada |
| **Trigger**            | Usuário comprou o item ou não precisa mais dele    |

#### Fluxo Principal

1. Usuário visualiza a lista
2. Usuário identifica item que deseja remover
3. Usuário realiza ação de remoção:
   - **Mobile:** Desliza item para esquerda (swipe left)
   - **Web:** Clica no ícone de lixeira/X
4. Sistema exibe animação de remoção
5. Sistema remove item da interface imediatamente
6. Sistema envia requisição de remoção ao backend
7. Backend marca item como deletado (soft delete)
8. Backend notifica outros dispositivos
9. Outros dispositivos removem o item da visualização
10. Sistema exibe confirmação sutil (toast)

#### Fluxos Alternativos

**A1: Desfazer remoção**

- 5a. Sistema exibe opção "Desfazer" por 5 segundos
- 5b. Usuário clica em "Desfazer"
- 5c. Sistema cancela requisição (se ainda não enviada)
- 5d. Sistema restaura item na interface
- 5e. Se já enviada, Sistema envia requisição para re-adicionar

**A2: Remoção offline**

- 6a. Sem conexão com internet
- 6b. Sistema marca item como "pendente remoção"
- 6c. Sistema remove da visualização
- 6d. Quando online, Sistema envia remoção ao backend

**A3: Confirmação de remoção**

- 3a. Usuário segura o item por 2 segundos (long press)
- 3b. Sistema exibe diálogo: "Remover [nome do item]?"
- 3c. Usuário confirma ou cancela
- 3d. Se confirmar, fluxo continua no passo 4

---

### UC004: Limpar Lista Completa

| **Campo**              | **Descrição**                                                                  |
| ---------------------- | ------------------------------------------------------------------------------ |
| **ID**                 | UC004                                                                          |
| **Nome**               | Limpar Toda a Lista                                                            |
| **Ator Principal**     | Usuário                                                                        |
| **Atores Secundários** | Sistema                                                                        |
| **Pré-condições**      | • Aplicativo aberto                                                            |
| **Pós-condições**      | • Lista completamente vazia<br>• Mudança sincronizada em todos os dispositivos |
| **Trigger**            | Usuário terminou as compras da semana e quer começar nova lista                |

#### Fluxo Principal

1. Usuário acessa menu ou visualiza botão "Limpar Lista"/"Nova Semana"
2. Usuário clica no botão
3. Sistema exibe diálogo de confirmação:
   - Título: "Limpar toda a lista?"
   - Mensagem: "Isso vai remover X itens. Esta ação não pode ser desfeita."
   - Botões: "Cancelar" | "Limpar"
4. Usuário clica em "Limpar"
5. Sistema remove todos os itens da interface com animação
6. Sistema envia requisição ao backend
7. Backend remove/marca todos os itens como deletados
8. Backend notifica outros dispositivos
9. Outros dispositivos limpam suas listas
10. Sistema exibe mensagem: "Lista limpa com sucesso! ✓"
11. Sistema exibe estado vazio com mensagem motivacional

#### Fluxos Alternativos

**A1: Cancelar operação**

- 4a. Usuário clica em "Cancelar"
- 4b. Sistema fecha diálogo
- 4c. Lista permanece inalterada

**A2: Lista já vazia**

- 1a. Sistema detecta que lista está vazia
- 1b. Botão "Limpar Lista" está desabilitado (grayed out)
- 1c. Fluxo não continua

**A3: Operação offline**

- 6a. Sem conexão com internet
- 6b. Sistema limpa lista localmente
- 6c. Sistema marca operação como "pendente sincronização"
- 6d. Sistema exibe: "Lista limpa localmente, sincronizará quando online"
- 6e. Quando online, Sistema envia comando ao backend

**A4: Erro no servidor**

- 7a. Backend retorna erro
- 7b. Sistema tenta novamente (retry)
- 7c. Se falhar novamente, Sistema exibe erro
- 7d. Sistema oferece opção "Tentar novamente"

---

### UC005: Receber Notificação

| **Campo**              | **Descrição**                                                          |
| ---------------------- | ---------------------------------------------------------------------- |
| **ID**                 | UC005                                                                  |
| **Nome**               | Receber Notificação de Alteração                                       |
| **Ator Principal**     | Usuário                                                                |
| **Atores Secundários** | Sistema de Notificações                                                |
| **Pré-condições**      | • Permissão de notificações concedida<br>• Outro usuário fez alteração |
| **Pós-condições**      | • Usuário é informado da alteração                                     |
| **Trigger**            | Parceiro adiciona/remove item da lista                                 |

#### Fluxo Principal

1. Outro usuário adiciona item à lista
2. Backend recebe a alteração
3. Backend identifica dispositivos conectados
4. Backend envia notificação via WebSocket
5. Sistema do dispositivo recebe notificação
6. **Se app está aberto:**
   - Sistema atualiza lista em tempo real
   - Sistema exibe banner sutil: "Maria adicionou Café ☕"
7. **Se app está em background/fechado:**
   - Sistema envia push notification
   - Usuário vê notificação na tela de lock/barra de notificações
   - Notificação mostra: "Maria adicionou 1 item à lista"
8. Usuário toca na notificação
9. Sistema abre app na lista atualizada

#### Fluxos Alternativos

**A1: Múltiplos itens adicionados**

- 6a. Vários itens adicionados em sequência
- 6b. Sistema agrupa notificações
- 6c. Exibe: "Maria adicionou 3 itens à lista"

**A2: Notificações desabilitadas**

- 5a. Permissões de notificação negadas
- 5b. Sistema não envia push notification
- 5c. Atualização só aparece quando app for aberto

**A3: Lista limpa**

- 1a. Outro usuário limpou toda a lista
- 6a. Sistema exibe: "Maria limpou a lista 🗑️"
- 6b. Interface atualiza para estado vazio

---

### UC006: Sincronizar Dados

| **Campo**              | **Descrição**                              |
| ---------------------- | ------------------------------------------ |
| **ID**                 | UC006                                      |
| **Nome**               | Sincronizar Dados                          |
| **Ator Principal**     | Sistema                                    |
| **Atores Secundários** | Backend                                    |
| **Pré-condições**      | • Alterações locais não sincronizadas      |
| **Pós-condições**      | • Todos os dados sincronizados             |
| **Trigger**            | Reconexão à internet ou intervalo de tempo |

#### Fluxo Principal

1. Sistema detecta conexão à internet
2. Sistema verifica se há alterações locais pendentes
3. Sistema prepara lista de operações pendentes (fila)
4. Para cada operação na fila:
   - 4a. Sistema envia requisição ao backend
   - 4b. Backend processa e retorna confirmação
   - 4c. Sistema marca operação como sincronizada
   - 4d. Sistema remove operação da fila
5. Sistema busca alterações do servidor desde última sincronização
6. Sistema compara timestamps de alterações
7. Sistema aplica mudanças do servidor (se mais recentes)
8. Sistema exibe indicador "Sincronizado ✓"
9. Sistema registra timestamp da última sincronização

#### Fluxos Alternativos

**A1: Conflito de dados**

- 7a. Item foi alterado localmente e no servidor
- 7b. Sistema compara timestamps
- 7c. Sistema aplica regra "last-write-wins"
- 7d. Alteração mais recente prevalece
- 7e. Sistema atualiza interface

**A2: Falha na sincronização**

- 4b. Backend retorna erro
- 4c. Sistema mantém operação na fila
- 4d. Sistema agenda nova tentativa (backoff exponencial)
- 4e. Sistema exibe: "Sincronizando... (tentativa X)"

**A3: Conexão perdida durante sync**

- 4a. Conexão cai durante envio
- 4b. Sistema pausa sincronização
- 4c. Sistema mantém estado da fila
- 4d. Quando reconectar, Sistema retoma do ponto parado

---

### UC007: Sincronizar Offline

| **Campo**              | **Descrição**                                     |
| ---------------------- | ------------------------------------------------- |
| **ID**                 | UC007                                             |
| **Nome**               | Operar em Modo Offline                            |
| **Ator Principal**     | Usuário                                           |
| **Atores Secundários** | Sistema                                           |
| **Pré-condições**      | • Aplicativo aberto<br>• Sem conexão com internet |
| **Pós-condições**      | • Alterações salvas localmente                    |
| **Trigger**            | Perda de conexão ou área sem internet             |

#### Fluxo Principal

1. Sistema detecta perda de conexão
2. Sistema exibe indicador "Modo Offline" discreto
3. Usuário adiciona item
4. Sistema salva item em AsyncStorage/localStorage
5. Sistema marca item com flag `synced: false`
6. Sistema adiciona operação à fila de sincronização
7. Item é exibido normalmente com indicador sutil (⏳)
8. Sistema continua funcionando normalmente
9. Quando conexão retornar:
   - Sistema detecta conexão
   - Sistema executa UC006 (Sincronizar Dados)
   - Indicador "Modo Offline" desaparece
   - Item é marcado como sincronizado (✓)

#### Fluxos Alternativos

**A1: Remoção offline**

- 3a. Usuário remove item offline
- 4a. Sistema marca item como "pendente remoção"
- 5a. Ao sincronizar, Sistema envia DELETE ao backend

**A2: Limpar lista offline**

- 3a. Usuário limpa lista offline
- 4a. Sistema limpa dados locais
- 5a. Sistema registra operação "clear_all"
- 6a. Ao sincronizar, Sistema envia comando ao backend

---

## 4. Matriz de Rastreabilidade

| Caso de Uso | Requisito Funcional | Prioridade | Complexidade |
| ----------- | ------------------- | ---------- | ------------ |
| UC001       | RF001               | Alta       | Média        |
| UC002       | RF002               | Alta       | Baixa        |
| UC003       | RF003               | Alta       | Média        |
| UC004       | RF004               | Alta       | Média        |
| UC005       | RF007               | Média      | Alta         |
| UC006       | RF005               | Alta       | Alta         |
| UC007       | RF006               | Média      | Alta         |

---

## 5. Regras de Negócio

### RN001: Validação de Item

- Nome do item não pode ser vazio
- Nome do item não pode exceder 200 caracteres
- Espaços em branco no início/fim são removidos automaticamente

### RN002: Sincronização

- Alterações locais têm prioridade visual (optimistic update)
- Em conflito, a alteração mais recente prevalece (last-write-wins)
- Sincronização ocorre automaticamente a cada reconexão

### RN003: Notificações

- Notificações são agrupadas se múltiplas em < 10 segundos
- Notificações não são enviadas para o dispositivo que fez a alteração
- Limite: máximo 5 notificações por hora (para evitar spam)

### RN004: Limpeza de Lista

- Requer confirmação explícita do usuário
- Não pode ser desfeita (sem histórico)
- Notifica todos os dispositivos imediatamente

---

## 6. Fluxos de Exceção Globais

### E001: Erro de Rede

- Sistema exibe mensagem amigável
- Operações são salvas localmente
- Sistema tenta reconectar automaticamente

### E002: Erro do Servidor

- Sistema exibe: "Serviço temporariamente indisponível"
- Sistema oferece botão "Tentar Novamente"
- Após 3 tentativas, sugere modo offline

### E003: Dados Corrompidos

- Sistema detecta inconsistência
- Sistema faz backup dos dados locais
- Sistema solicita nova sincronização do servidor

---

**Fim do Documento**
