## API Dados Produtos

> Pequena API em Node.js/Express para gerenciar produtos, usuários e carrinho.

### Visão Geral

Esta API fornece endpoints para listar produtos e usuários, adicionar usuários e manipular itens do carrinho.

Projeto localizado em `backend/` (Node.js, ES Modules).

---

## Pré-requisitos

- Node.js 18+ (recomenda-se LTS);
- npm;
- Banco de dados PostgreSQL acessível (ou ajuste `db.js` conforme necessidade).

## Instalação

1. Abra um terminal na pasta do projeto e vá para o diretório backend:

```powershell
cd backend
```

2. Instale dependências:

```powershell
npm install
```

3. Crie um arquivo `.env` na pasta `backend/` com as variáveis de ambiente (exemplo abaixo).

## Variáveis de ambiente (exemplo `.env`)

```
PORT=3000
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=seu_banco
```

Observação: `db.js` configura `ssl: { rejectUnauthorized: false }` por padrão — ajuste conforme o ambiente.

## Como executar

```powershell
cd backend
npm start
```

Por padrão o servidor escuta na porta `3000` a menos que `PORT` esteja definido.

## Endpoints

Lista dos endpoints disponíveis (base: http://localhost:3000):

- GET /produtos
  - Retorna todos os produtos.

- GET /usuarios
  - Retorna todos os usuários.

- POST /usuarios
  - Cria um novo usuário.
  - Body (JSON): { "gmail": "email@exemplo.com", "senha": "senha", "nome": "Nome" }

- POST /carrinho
  - Adiciona item ao carrinho.
  - Body (JSON): { "usuario_id": number, "produto_id": number, "quantidade": number }

- GET /carrinho/:usuarioId
  - Retorna os itens do carrinho do usuário (informa title, price, image e quantidade).

## Exemplos de requisições

Usando curl:

```bash
# Listar produtos
curl http://localhost:3000/produtos

# Adicionar usuário
curl -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" -d '{"gmail":"user@ex.com","senha":"123","nome":"Usuário"}'

# Adicionar ao carrinho
curl -X POST http://localhost:3000/carrinho -H "Content-Type: application/json" -d '{"usuario_id":1,"produto_id":2,"quantidade":1}'

# Buscar carrinho (usuarioId = 1)
curl http://localhost:3000/carrinho/1
```

Usando PowerShell (Invoke-RestMethod):

```powershell
# Listar produtos
Invoke-RestMethod -Method GET -Uri http://localhost:3000/produtos

# Adicionar usuário
Invoke-RestMethod -Method POST -Uri http://localhost:3000/usuarios -Body (@{ gmail = 'user@ex.com'; senha = '123'; nome = 'Usuário' } | ConvertTo-Json) -ContentType 'application/json'
```

## Esquema de banco (exemplo mínimo)

Seguem statements SQL de exemplo para criar as tabelas usadas pelo código. Ajuste tipos e constraints conforme sua necessidade.

```sql
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  title TEXT,
  image TEXT,
  price NUMERIC,
  description TEXT,
  category TEXT
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  gmail TEXT UNIQUE,
  senha TEXT,
  nome TEXT
);

CREATE TABLE carrinho (
  id SERIAL PRIMARY KEY,
  usuarios_id INTEGER REFERENCES usuarios(id),
  produtos_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER DEFAULT 1
);
```

## Observações e dicas

- O projeto usa ES Modules (`type: "module"` em `backend/package.json`).
- `db.js` usa `dotenv` para ler variáveis de ambiente. Garanta que `.env` esteja configurado.
- Há código comentado em `server.js` para importar produtos de uma API externa (fakestoreapi) — se quiser usar, instale `node-fetch` e remova o comentário.
- Senhas estão sendo gravadas em texto no exemplo — para produção use hashing (ex.: bcrypt) e validação adequada.

## Próximos passos sugeridos

- Adicionar validação de entradas (ex.: Joi ou express-validator).
- Implementar autenticação (JWT) para rotas de usuário e carrinho.
- Adicionar testes automatizados.

---

Se quiser, eu posso:

- adicionar um script `npm run dev` com nodemon;
- gerar um arquivo `.env.example` e um script de criação do banco;
- ou atualizar a documentação em inglês também.

Fale o que prefere que eu faça em seguida.
