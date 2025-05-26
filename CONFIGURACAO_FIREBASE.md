# Guia de Configuração do Firebase para PREV+

Este guia contém instruções detalhadas para configurar o Firebase Realtime Database para a aplicação PREV+ do condomínio.

## 1. Criar uma Conta no Firebase

1. Acesse [firebase.google.com](https://firebase.google.com/)
2. Clique em "Começar" ou "Get Started"
3. Faça login com sua conta Google (crie uma se necessário)

## 2. Criar um Novo Projeto

1. No console do Firebase, clique em "Adicionar projeto" ou "Add project"
2. Digite um nome para o projeto (ex: "prev-plus-condominio")
3. Desative o Google Analytics (opcional)
4. Clique em "Criar projeto" ou "Create project"
5. Aguarde a criação do projeto e clique em "Continuar" ou "Continue"

## 3. Configurar o Realtime Database

1. No menu lateral esquerdo, clique em "Realtime Database"
2. Clique em "Criar banco de dados" ou "Create database"
3. Selecione a região mais próxima (ex: "us-central1")
4. Inicie no "modo de teste" para facilitar o desenvolvimento
   - Isso permitirá acesso de leitura/escrita sem autenticação por 30 dias
   - Você pode ajustar as regras de segurança posteriormente
5. Clique em "Ativar" ou "Enable"

## 4. Configurar Regras de Segurança (Opcional)

Para maior segurança, você pode configurar regras de acesso:

1. Na página do Realtime Database, clique na aba "Regras" ou "Rules"
2. Substitua as regras existentes por:

```json
{
  "rules": {
    ".read": true,
    ".write": true,
    "pedidos": {
      ".read": true,
      ".write": true
    },
    "config": {
      ".read": true,
      ".write": false
    }
  }
}
```

3. Clique em "Publicar" ou "Publish"

## 5. Obter Credenciais de Configuração

1. No menu lateral esquerdo, clique em "Visão geral do projeto" ou "Project overview"
2. Clique no ícone da web (</>) para adicionar um aplicativo da web
3. Registre seu aplicativo com um nome (ex: "prev-plus-web")
4. Não é necessário configurar o Firebase Hosting
5. Clique em "Registrar aplicativo" ou "Register app"
6. Você verá um bloco de código com as credenciais de configuração. Ele se parece com:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA1234567890abcdefghijklmnopqrstuvwxyz",
  authDomain: "prev-plus-condominio.firebaseapp.com",
  databaseURL: "https://prev-plus-condominio-default-rtdb.firebaseio.com",
  projectId: "prev-plus-condominio",
  storageBucket: "prev-plus-condominio.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};
```

7. Copie este bloco de configuração, você precisará dele para integrar o Firebase à aplicação PREV+

## 6. Inicializar a Estrutura de Dados (Opcional)

Para inicializar a estrutura de dados básica:

1. Na página do Realtime Database, clique na aba "Dados" ou "Data"
2. Clique no ícone "+" ao lado do nome do seu projeto
3. Adicione a chave "config" e clique em "Adicionar" ou "Add"
4. Clique no ícone "+" ao lado de "config"
5. Adicione a chave "admin_password" com o valor "480013" e clique em "Adicionar" ou "Add"
6. Clique no ícone "+" ao lado do nome do seu projeto novamente
7. Adicione a chave "pedidos" e clique em "Adicionar" ou "Add"

## 7. Próximos Passos

Após concluir a configuração do Firebase:

1. Substitua as credenciais no arquivo `firebase-config.js` da aplicação PREV+
2. Faça upload dos arquivos da aplicação para um serviço de hospedagem estática
3. Compartilhe o link da aplicação com os moradores do condomínio

## Observações Importantes

- O plano gratuito do Firebase inclui:
  - 1GB de armazenamento
  - 10GB de transferência de dados por mês
  - 100 conexões simultâneas
- Estes limites são mais que suficientes para o uso normal de um condomínio
- Não é necessário fornecer cartão de crédito para o plano gratuito
- As regras de segurança no modo de teste expiram após 30 dias, mas podem ser estendidas facilmente
