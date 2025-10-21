# 🧪 Guia de Testes - Shopping List App

**Versão:** 1.0 (mobile-new)  
**Data:** 21 de outubro de 2025

---

## 📱 Como Testar o App

### Pré-requisitos

✅ Expo Go instalado no celular Android  
✅ Celular e computador na mesma rede Wi-Fi  
✅ Terminal rodando `npx expo start` na pasta `mobile-new`

---

## ✅ Testes Funcionais

### 1️⃣ **Adicionar Item**

- [ ] Digite "Leite" no campo de texto
- [ ] Pressione o botão verde "+"
- [ ] ✓ Item deve aparecer na lista imediatamente
- [ ] ✓ Contador de itens deve atualizar

### 2️⃣ **Marcar como Comprado**

- [ ] Toque em um item da lista
- [ ] ✓ Texto deve ficar riscado e cinza
- [ ] Toque novamente no mesmo item
- [ ] ✓ Texto deve voltar ao normal

### 3️⃣ **Excluir Item**

- [ ] Toque no ícone 🗑️ ao lado de um item
- [ ] ✓ Item deve desaparecer da lista
- [ ] ✓ Contador de itens deve atualizar

### 4️⃣ **Limpar Lista**

- [ ] Adicione vários itens
- [ ] Toque no botão vermelho "Limpar Lista" no final
- [ ] Confirme na caixa de diálogo
- [ ] ✓ Todos os itens devem ser removidos
- [ ] ✓ Mensagem "Nenhum item na lista" deve aparecer

### 5️⃣ **Sincronização Tempo Real** (precisa de 2 dispositivos)

- [ ] Abra o app em 2 celulares diferentes (ou celular + navegador web no futuro)
- [ ] Adicione um item no celular 1
- [ ] ✓ Item deve aparecer no celular 2 em até 2 segundos
- [ ] Marque como comprado no celular 2
- [ ] ✓ Deve riscar no celular 1 automaticamente

### 6️⃣ **Validações**

- [ ] Tente adicionar item vazio (sem digitar nada)
- [ ] ✓ Deve mostrar alerta "Digite o nome do item"
- [ ] Tente limpar lista vazia
- [ ] ✓ Deve mostrar alerta "A lista já está vazia"

---

## 🐛 Testes de Erro

### Firebase Connection

- [ ] Desconecte o Wi-Fi do celular
- [ ] Tente adicionar um item
- [ ] ⚠️ **Esperado**: Erro "Não foi possível adicionar o item"
- [ ] Reconecte o Wi-Fi
- [ ] ⏳ **Futuro**: Item deve ser sincronizado automaticamente (offline support)

### Limite de Caracteres

- [ ] Digite um nome muito longo (200+ caracteres)
- [ ] Adicione o item
- [ ] ✓ Deve aceitar normalmente (sem limite atual)

---

## 📊 Testes de Performance

### Carga de Itens

- [ ] Adicione 50 itens rapidamente
- [ ] ✓ App deve continuar responsivo
- [ ] ✓ Scroll deve ser suave
- [ ] ✓ Sincronização deve funcionar

### Tempo de Resposta

- [ ] Adicionar item: < 500ms ✅
- [ ] Marcar comprado: < 300ms ✅
- [ ] Excluir item: < 300ms ✅
- [ ] Sincronização: < 2s ✅

---

## 🎨 Testes de Interface

### Layout Mobile

- [ ] Interface se ajusta a diferentes tamanhos de tela
- [ ] Botões são fáceis de tocar (tamanho adequado)
- [ ] Cores e contrastes são adequados
- [ ] Texto é legível

### Feedback Visual

- [ ] Botão "+" fica opaco quando carregando
- [ ] Itens comprados ficam riscados e cinzas
- [ ] Alertas aparecem com mensagens claras
- [ ] Lista vazia mostra mensagem amigável

---

## 🔐 Teste de Segurança Firebase

### Regras do Firestore

Verifique no console Firebase se as regras estão:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{document=**} {
      allow read, write: if true;  // ⚠️ Apenas para desenvolvimento
    }
  }
}
```

⚠️ **ATENÇÃO**: Essas regras permitem acesso público. Para produção, adicione autenticação.

---

## 📝 Checklist de Qualidade

### Funcional

- [x] Adicionar item
- [x] Visualizar lista
- [x] Marcar como comprado
- [x] Excluir item
- [x] Limpar lista
- [x] Sincronização tempo real
- [ ] Modo offline (em desenvolvimento)
- [ ] Notificações push (não implementado)

### Não-Funcional

- [x] Performance adequada
- [x] Interface intuitiva
- [x] Validação de entrada
- [x] Feedback ao usuário
- [ ] Acessibilidade (voz, talkback)
- [ ] Testes automatizados

---

## 🚀 Próximos Testes

Quando implementarmos:

### Notificações Push

- [ ] Adicionar item no celular 1
- [ ] Verificar se notificação aparece no celular 2
- [ ] Tocar na notificação
- [ ] Verificar se abre o app

### Modo Offline

- [ ] Desconectar internet
- [ ] Adicionar 3 itens
- [ ] Reconectar internet
- [ ] Verificar se os 3 itens foram sincronizados

### App Web (Futuro)

- [ ] Abrir app no navegador
- [ ] Testar todas as funcionalidades
- [ ] Verificar responsividade
- [ ] Testar sincronização mobile <-> web

---

## 📞 Reportar Bugs

Se encontrar problemas:

1. **Console do Expo**: Verifique erros no terminal onde o Expo está rodando
2. **Logs do Firebase**: Acesse Firebase Console > Firestore > Dados
3. **Screenshot**: Tire foto do erro
4. **Reproduzir**: Anote os passos para reproduzir o bug

---

**Status Atual**: ✅ App funcional para uso básico | ⏳ Faltam notificações e offline
