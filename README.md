## API Dados Produtos

> Pequena API em Node.js/Express para gerenciar produtos, usuários e carrinho.

### Visão Geral

Esta API fornece endpoints para listar produtos e usuários, adicionar usuários e manipular itens do carrinho. Os endpoints de recuperação (retrievers) permitem consultar dados de produtos, usuários e carrinhos de forma eficiente.

Projeto localizado em `backend/` (Node.js, ES Modules).

---

## Pré-requisitos

- Node.js 18+ (recomenda-se LTS);
- npm;
- Banco de dados PostgreSQL acessível (configurado em `db.js`).

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
PGHOST=localhost
PGUSER=seu_usuario
PGPASSWORD=sua_senha
PGDATABASE=seu_banco
PORT=3000
```

Observação: `db.js` configura `ssl: { rejectUnauthorized: false }` por padrão — ajuste conforme o ambiente.

## Como executar

```powershell
cd backend
npm start
```

Por padrão o servidor escuta na porta `3000` a menos que `PORT` esteja definido.

## Endpoints

Lista dos endpoints disponíveis (base: http://localhost:3000). Os endpoints de recuperação (retrievers) estão destacados.

### Recuperação de Dados (Retrievers)

- **GET /produtos**
  - Retorna todos os produtos.
  - **Resposta de sucesso (200)**: Array de objetos JSON com campos `id`, `title`, `image`, `price`, `description`, `category`.
  - **Exemplo de resposta**:
    ```json
    [
      {
        "id": 1,
        "title": "Produto Exemplo",
        "image": "url_da_imagem",
        "price": 99.99,
        "description": "Descrição do produto",
        "category": "Categoria"
      }
    ]
    ```

- **GET /usuarios**
  - Retorna todos os usuários (sem senhas por segurança).
  - **Resposta de sucesso (200)**: Array de objetos JSON com campos `id`, `gmail`, `nome`.
  - **Exemplo de resposta**:
    ```json
    [
      {
        "id": 1,
        "gmail": "user@exemplo.com",
        "nome": "Nome do Usuário"
      }
    ]
    ```

- **GET /carrinho/:usuarioId**
  - Retorna os itens do carrinho do usuário especificado, incluindo detalhes dos produtos.
  - **Parâmetros**: `usuarioId` (número) na URL.
  - **Resposta de sucesso (200)**: Array de objetos JSON com campos `id`, `quantidade`, `title`, `price`, `image`.
  - **Exemplo de resposta**:
    ```json
    [
      {
        "id": 1,
        "quantidade": 2,
        "title": "Produto no Carrinho",
        "price": 49.99,
        "image": "url_da_imagem"
      }
    ]
    ```

### Criação de Dados

- **POST /usuarios**
  - Cria um novo usuário.
  - **Body (JSON)**: `{ "gmail": "email@exemplo.com", "senha": "senha", "nome": "Nome" }`
  - **Resposta de sucesso (201)**: `{ "id": 1, "gmail": "email@exemplo.com", "nome": "Nome" }`
  - **Notas**: Senhas são hashadas com bcrypt para segurança.

- **POST /carrinho**
  - Adiciona item ao carrinho.
  - **Body (JSON)**: `{ "usuario_id": number, "produto_id": number, "quantidade": number }`
  - **Resposta de sucesso (201)**: `{ "message": "Adicionado ao carrinho com sucesso" }`

### Respostas de Erro

Todos os endpoints podem retornar erros no formato:
```json
{
  "error": "Descrição do erro"
}
```
- **Códigos comuns**: 400 (Bad Request), 404 (Not Found), 500 (Internal Server Error).

## Exemplos de requisições

Usando curl:

```bash
# Listar produtos (retriever)
curl http://localhost:3000/produtos

# Adicionar usuário
curl -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" -d '{"gmail":"user@ex.com","senha":"123","nome":"Usuário"}'

# Adicionar ao carrinho
curl -X POST http://localhost:3000/carrinho -H "Content-Type: application/json" -d '{"usuario_id":1,"produto_id":2,"quantidade":1}'

# Buscar carrinho (retriever)
curl http://localhost:3000/carrinho/1
```

Usando PowerShell (Invoke-RestMethod):

```powershell
# Listar produtos (retriever)
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
- Senhas são hashadas com bcrypt para segurança.
- Os retrievers são otimizados para consultas rápidas, utilizando JOINs onde necessário (ex.: no carrinho).

## Próximos passos sugeridos

- Adicionar validação de entradas (ex.: Joi ou express-validator).
- Implementar autenticação (JWT) para rotas de usuário e carrinho.
- Adicionar testes automatizados.
- Implementar paginação para os retrievers de listas grandes.

---

## 👨‍💻 Autor

**Richard Moraes Souza**
- GitHub: [@richardmoraessouza](https://github.com/richardmoraessouza)
- LinkedIn: [Richard Moraes Souza](https://www.linkedin.com/in/richard-moraes-souza/)

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
