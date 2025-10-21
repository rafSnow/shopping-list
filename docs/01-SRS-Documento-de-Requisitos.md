# Especificação de Requisitos de Software (SRS)

## App de Lista de Compras Compartilhada

**Versão:** 1.0  
**Data:** 16 de outubro de 2025  
**Autor:** Equipe de Desenvolvimento

---

## 1. Introdução

### 1.1 Propósito

Este documento descreve os requisitos funcionais e não-funcionais do aplicativo de lista de compras compartilhada, desenvolvido para auxiliar casais a gerenciar suas compras domésticas de forma colaborativa.

### 1.2 Escopo

O sistema permitirá que dois usuários (casal) compartilhem uma lista de compras em tempo real, podendo adicionar, visualizar e remover itens durante a semana, facilitando as compras do fim de semana.

### 1.3 Definições e Acrônimos

- **Item**: Produto a ser comprado
- **Lista**: Conjunto de itens de compras
- **Sincronização**: Atualização automática dos dados entre dispositivos
- **Offline-first**: Funcionalidade que permite uso sem conexão

---

## 2. Descrição Geral

### 2.1 Perspectiva do Produto

Sistema multiplataforma composto por:

- **✅ Implementado:** Aplicativo móvel (React Native + Expo SDK 54) para Android e iOS
- **⏳ Planejado:** Aplicação web (React + Vite)
- **✅ Implementado:** Backend serverless (Firebase Firestore)
- **✅ Implementado:** Sincronização em tempo real (Firebase Real-time)

### 2.2 Funções do Produto

- ✅ Adicionar itens à lista de compras
- ✅ Visualizar todos os itens da lista
- ✅ Marcar itens como comprados (riscar)
- ✅ Remover itens específicos da lista
- ✅ Limpar toda a lista (botão "Limpar Lista")
- ✅ Sincronização em tempo real entre dispositivos (Firebase)
- ⏳ Funcionamento offline com sincronização posterior (Firebase cache)
- ❌ Notificações sobre alterações na lista (não implementado)

### 2.3 Características dos Usuários

- Usuários domésticos (casal)
- Idade: Adultos
- Experiência técnica: Básica a intermediária
- Uso diário/semanal do aplicativo

### 2.4 Restrições

- Sem autenticação (lista compartilhada aberta)
- Sem categorização de produtos
- Sem histórico de compras
- Sem controle de preços
- Sem fotos de produtos
- Sem controle de quantidades

---

## 3. Requisitos Específicos

### 3.1 Requisitos Funcionais

#### RF001 - Adicionar Item

**Prioridade:** Alta  
**Descrição:** O usuário deve poder adicionar um novo item à lista de compras.

- **Entrada:** Nome do item (texto)
- **Processamento:** Validar nome não vazio, adicionar à lista
- **Saída:** Item adicionado à lista visível para todos os dispositivos

#### RF002 - Visualizar Lista

**Prioridade:** Alta  
**Descrição:** O usuário deve poder visualizar todos os itens da lista atual.

- **Entrada:** Abertura do app
- **Processamento:** Carregar lista do banco de dados
- **Saída:** Exibição de todos os itens em ordem de adição

#### RF003 - Remover Item

**Prioridade:** Alta  
**Descrição:** O usuário deve poder remover um item específico da lista.

- **Entrada:** Seleção do item a remover
- **Processamento:** Remover item do banco de dados
- **Saída:** Item removido da visualização em todos os dispositivos

#### RF004 - Limpar Lista Completa

**Prioridade:** Alta  
**Descrição:** O usuário deve poder limpar toda a lista de uma vez.

- **Entrada:** Clique no botão "Limpar Lista" ou "Nova Semana"
- **Processamento:** Confirmação de ação, remoção de todos os itens
- **Saída:** Lista vazia em todos os dispositivos

#### RF005 - Sincronização em Tempo Real

**Prioridade:** Alta  
**Descrição:** Alterações na lista devem aparecer automaticamente em todos os dispositivos conectados.

- **Entrada:** Qualquer alteração (adicionar/remover)
- **Processamento:** Envio de atualização via WebSocket ou polling
- **Saída:** Atualização instantânea em todos os dispositivos online

#### RF006 - Funcionamento Offline

**Prioridade:** Média  
**Descrição:** O app deve funcionar sem conexão à internet.

- **Entrada:** Uso do app sem internet
- **Processamento:** Armazenamento local das alterações
- **Saída:** Sincronização automática quando conexão for restabelecida

#### RF007 - Notificações

**Prioridade:** Média  
**Descrição:** O usuário deve receber notificações quando o parceiro adicionar itens à lista.

- **Entrada:** Alteração na lista por outro dispositivo
- **Processamento:** Envio de notificação push
- **Saída:** Notificação no dispositivo do usuário

---

### 3.2 Requisitos Não-Funcionais

#### RNF001 - Usabilidade

- Interface intuitiva e moderna
- Tempo de aprendizado máximo: 5 minutos
- Acessibilidade em diferentes tamanhos de tela

#### RNF002 - Performance

- Tempo de resposta para adicionar item: < 500ms
- Tempo de sincronização: < 2 segundos
- Suporte a pelo menos 500 itens na lista

#### RNF003 - Confiabilidade

- Disponibilidade do sistema: 99%
- Recuperação automática de falhas de conexão
- Backup automático dos dados

#### RNF004 - Segurança

- Comunicação HTTPS entre app e servidor
- Validação de entrada para prevenir injeção de código
- Armazenamento seguro de dados locais

#### RNF005 - Compatibilidade

- Android: versão 8.0 ou superior
- iOS: versão 13.0 ou superior
- Navegadores web: Chrome, Firefox, Safari, Edge (últimas 2 versões)

#### RNF006 - Manutenibilidade

- Código modular e bem documentado
- Arquitetura escalável
- Logs de erro detalhados

#### RNF007 - Portabilidade

- Mesmo código React Native para Android e iOS
- Interface responsiva para web (desktop e mobile)

---

## 4. Casos de Uso

### UC001 - Adicionar Item à Lista

**Ator:** Usuário  
**Pré-condição:** App aberto  
**Fluxo Principal:**

1. Usuário clica em "Adicionar Item" ou campo de entrada
2. Usuário digita nome do item
3. Usuário confirma (Enter ou botão)
4. Sistema valida entrada
5. Sistema adiciona item à lista
6. Sistema sincroniza com outros dispositivos
7. Sistema exibe mensagem de sucesso

**Fluxo Alternativo:**

- 4a. Nome vazio: Sistema exibe mensagem de erro

### UC002 - Remover Item da Lista

**Ator:** Usuário  
**Pré-condição:** Lista com pelo menos um item  
**Fluxo Principal:**

1. Usuário visualiza a lista
2. Usuário clica no ícone de remover (ou desliza o item)
3. Sistema remove o item
4. Sistema sincroniza com outros dispositivos
5. Sistema atualiza visualização

### UC003 - Limpar Toda a Lista

**Ator:** Usuário  
**Pré-condição:** App aberto  
**Fluxo Principal:**

1. Usuário clica no botão "Limpar Lista"
2. Sistema exibe confirmação
3. Usuário confirma ação
4. Sistema remove todos os itens
5. Sistema sincroniza com outros dispositivos
6. Sistema exibe lista vazia

**Fluxo Alternativo:**

- 3a. Usuário cancela: Sistema mantém lista atual

### UC004 - Sincronizar Dados Offline

**Ator:** Sistema  
**Pré-condição:** Dispositivo esteve offline e alterações foram feitas  
**Fluxo Principal:**

1. Sistema detecta conexão à internet
2. Sistema verifica alterações locais pendentes
3. Sistema envia alterações ao servidor
4. Sistema recebe atualizações do servidor
5. Sistema resolve conflitos (se houver)
6. Sistema atualiza interface

---

## 5. Requisitos de Interface

### 5.1 Interface Mobile

- Tela principal: Lista de itens com campo de entrada no topo
- Botão flutuante "+" para adicionar
- Swipe para remover item
- Menu com opção "Limpar Lista"
- Indicador de status de sincronização

### 5.2 Interface Web

- Layout responsivo
- Sidebar ou header com controles
- Lista centralizada
- Campo de entrada destacado
- Confirmações visuais de ações

---

## 6. Requisitos de Dados

### 6.1 Modelo de Dados

**Entidade: Item**

- id: UUID (identificador único)
- nome: String (1-200 caracteres)
- dataCriacao: DateTime
- sincronizado: Boolean

**Entidade: Lista**

- id: UUID
- items: List<Item>
- ultimaAtualizacao: DateTime

---

## 7. Critérios de Aceitação

1. ✅ Usuário consegue adicionar item em menos de 3 segundos
2. ✅ Alterações aparecem no outro dispositivo em até 2 segundos (online)
3. ✅ App funciona completamente offline
4. ✅ Interface é intuitiva e não requer tutorial
5. ✅ Notificações são recebidas quando parceiro adiciona itens
6. ✅ Lista pode ser limpa com um botão
7. ✅ Sistema funciona em Android, iOS e Web

---

## 8. Dependências e Premissas

### 8.1 Dependências

- Servidor backend disponível
- Conexão à internet para sincronização
- Permissões de notificação no dispositivo

### 8.2 Premissas

- Apenas dois usuários utilizarão a lista
- Itens são identificados apenas pelo nome
- Sem necessidade de login/autenticação
- Lista única compartilhada

---

## 9. Riscos

| Risco                          | Probabilidade | Impacto | Mitigação                                |
| ------------------------------ | ------------- | ------- | ---------------------------------------- |
| Conflitos de sincronização     | Média         | Alto    | Implementar estratégia "last-write-wins" |
| Perda de dados offline         | Baixa         | Alto    | Persistência local robusta               |
| Notificações não recebidas     | Média         | Médio   | Implementar fallback com polling         |
| Abuso por terceiros (sem auth) | Alta          | Baixo   | Considerar código de acesso simples      |

---

## 10. Aprovações

**Stakeholders:**

- [ ] Cliente (Usuário final)
- [ ] Desenvolvedor Backend
- [ ] Desenvolvedor Frontend/Mobile
- [ ] QA/Testes

---

**Fim do Documento**
