# Guia de Implantação do PREV+ com Firebase

Este guia contém instruções detalhadas para implantar a aplicação PREV+ com Firebase, garantindo que todos os usuários do condomínio possam acessar e compartilhar os mesmos dados em tempo real.

## Pré-requisitos

1. Uma conta no [Firebase](https://firebase.google.com) (você pode se cadastrar gratuitamente com uma conta Google)
2. O pacote da aplicação PREV+ (este arquivo está incluído no pacote)

## Passos para Implantação

### 1. Configurar o Firebase

Siga as instruções detalhadas no arquivo `CONFIGURACAO_FIREBASE.md` para:
- Criar uma conta no Firebase
- Criar um novo projeto
- Configurar o Realtime Database
- Obter as credenciais de configuração

### 2. Configurar a Aplicação PREV+

1. Abra o arquivo `js/firebase-config.js` em um editor de texto
2. Substitua o objeto `firebaseConfig` pelas suas próprias credenciais obtidas no console do Firebase
3. Salve o arquivo

### 3. Testar Localmente (Opcional)

Para testar a aplicação localmente antes de publicá-la:
1. Abra o arquivo `index.html` em um navegador web
2. Verifique se todas as funcionalidades estão funcionando corretamente

### 4. Publicar a Aplicação

Existem várias opções gratuitas para hospedar a aplicação:

#### Opção 1: GitHub Pages (Recomendado)

1. Crie uma conta no [GitHub](https://github.com) se ainda não tiver
2. Crie um novo repositório público
3. Faça upload de todos os arquivos da aplicação PREV+ para o repositório
4. Vá para "Settings" > "Pages"
5. Em "Source", selecione "main" e clique em "Save"
6. Aguarde alguns minutos e sua aplicação estará disponível em `https://seu-usuario.github.io/nome-do-repositorio`

#### Opção 2: Netlify

1. Crie uma conta no [Netlify](https://netlify.com)
2. Clique em "New site from Git" ou arraste e solte a pasta da aplicação na área indicada
3. Siga as instruções para publicar o site
4. Sua aplicação estará disponível em um domínio fornecido pelo Netlify

#### Opção 3: Firebase Hosting

1. No console do Firebase, clique em "Hosting" no menu lateral
2. Clique em "Get started" ou "Começar"
3. Siga as instruções para instalar o Firebase CLI e publicar o site
4. Sua aplicação estará disponível em `https://seu-projeto.web.app`

### 5. Compartilhar com os Moradores

Após a publicação, compartilhe o link da aplicação com todos os moradores do condomínio. Todos poderão:
- Visualizar pedidos existentes
- Criar novos pedidos
- Ver atualizações em tempo real

O administrador (usando a senha 480013) poderá:
- Concluir pedidos
- Excluir pedidos (tanto abertos quanto concluídos)

## Manutenção e Suporte

### Alterando a Senha de Administrador

Para alterar a senha de administrador:
1. Acesse o console do Firebase
2. Vá para "Realtime Database"
3. Navegue até `config/admin_password`
4. Edite o valor para a nova senha

### Backup dos Dados

O Firebase mantém seus dados seguros, mas você pode fazer backups periódicos:
1. No console do Firebase, vá para "Realtime Database"
2. Clique nos três pontos verticais (menu)
3. Selecione "Export JSON" para baixar uma cópia dos dados

### Limites do Plano Gratuito

O plano gratuito do Firebase inclui:
- 1GB de armazenamento
- 10GB de transferência de dados por mês
- 100 conexões simultâneas

Estes limites são mais que suficientes para o uso normal de um condomínio.

## Solução de Problemas

Se encontrar problemas durante a implantação:

1. Verifique se as credenciais do Firebase foram configuradas corretamente
2. Certifique-se de que o Realtime Database foi criado e está no modo de teste
3. Verifique se todos os arquivos foram publicados corretamente
4. Limpe o cache do navegador se estiver vendo dados antigos

Para problemas persistentes, consulte a [documentação oficial do Firebase](https://firebase.google.com/docs).
