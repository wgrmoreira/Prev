# Guia de Implantação do PREV+ no Render.com

Este guia contém instruções detalhadas para implantar a aplicação PREV+ no Render.com, garantindo que todos os usuários do condomínio possam acessar e compartilhar os mesmos dados.

## Pré-requisitos

1. Uma conta no [Render.com](https://render.com) (você pode se cadastrar gratuitamente)
2. O pacote da aplicação PREV+ (este arquivo está incluído no pacote)

## Passos para Implantação

### 1. Criar uma conta no Render.com

Se você ainda não tem uma conta no Render.com, acesse [https://render.com](https://render.com) e clique em "Sign Up" para criar uma conta gratuita.

### 2. Fazer upload do código para o GitHub (Opcional)

Você pode implantar diretamente do seu computador, mas o GitHub facilita atualizações futuras:

1. Crie um repositório no GitHub
2. Faça upload dos arquivos da aplicação PREV+ para o repositório

### 3. Implantar no Render.com usando o Blueprint

O Render Blueprint permite implantar toda a infraestrutura (aplicação web e banco de dados) de uma só vez:

1. Faça login no Render.com
2. No painel, clique em "New" e selecione "Blueprint"
3. Conecte sua conta do GitHub (se estiver usando) ou selecione "Upload" para enviar o arquivo ZIP
4. Selecione o repositório ou faça upload do arquivo ZIP contendo a aplicação PREV+
5. Clique em "Apply Blueprint"
6. O Render irá detectar automaticamente o arquivo `render.yaml` e configurar todos os serviços necessários
7. Revise as configurações e clique em "Apply" para iniciar a implantação

### 4. Implantação Manual (Alternativa)

Se preferir implantar manualmente:

#### 4.1. Criar o Banco de Dados PostgreSQL

1. No painel do Render, clique em "New" e selecione "PostgreSQL"
2. Preencha os seguintes campos:
   - Name: prev_plus_db
   - Database: prev_plus
   - User: prev_plus_user
3. Selecione o plano gratuito
4. Clique em "Create Database"
5. Após a criação, anote a "Internal Database URL" para usar na próxima etapa

#### 4.2. Criar o Serviço Web

1. No painel do Render, clique em "New" e selecione "Web Service"
2. Conecte seu repositório GitHub ou faça upload do código
3. Preencha os seguintes campos:
   - Name: prev_plus
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn src.app:app`
4. Em "Environment Variables", adicione:
   - `DATABASE_URL`: Cole a URL do banco de dados PostgreSQL (da etapa anterior)
   - `SECRET_KEY`: Gere uma chave aleatória ou deixe o Render gerar automaticamente
5. Selecione o plano gratuito
6. Clique em "Create Web Service"

### 5. Acessar a Aplicação

Após a implantação (que pode levar alguns minutos), o Render fornecerá uma URL para acessar sua aplicação, como:
`https://prev-plus.onrender.com`

Compartilhe esta URL com os moradores do condomínio para que todos possam acessar a aplicação PREV+.

## Informações Importantes

- **Senha de Administrador**: 480013 (você pode alterar isso no arquivo `routes.py` antes da implantação)
- **Plano Gratuito do Render**: O plano gratuito do Render coloca aplicações em modo de espera após 15 minutos de inatividade. Quando alguém acessar novamente, a aplicação será reativada automaticamente (pode levar alguns segundos).
- **Banco de Dados**: O plano gratuito do PostgreSQL no Render inclui 1GB de armazenamento, mais que suficiente para a aplicação PREV+.

## Solução de Problemas

Se encontrar problemas durante a implantação:

1. Verifique os logs no painel do Render para identificar erros
2. Certifique-se de que todas as variáveis de ambiente estão configuradas corretamente
3. Verifique se o banco de dados PostgreSQL está funcionando corretamente

## Suporte

Se precisar de ajuda adicional, você pode:

1. Consultar a [documentação do Render](https://render.com/docs)
2. Entrar em contato com o desenvolvedor da aplicação PREV+
