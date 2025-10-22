import db from './db.js'; 
import express from 'express';
// import fetch from 'node-fetch'
import cors from 'cors';


const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());



// caso eu queria adicionar uma nova api de produtos
// async function importarProdutos() {
//   try {
//     const res = await fetch('https://fakestoreapi.com/products');
//     const produtos = await res.json();

//     for (const prod of produtos) {
//       const { title, image, price, description, category } = prod;

//       await db.query(
//         `INSERT INTO produtos (title, image, price, description, category)
//          VALUES ($1, $2, $3, $4, $5)
//          ON CONFLICT DO NOTHING`,   // opcional, se quiser evitar duplicados
//         [ title, image, price, description, category ]
//       );
//       console.log(`Inserido: ${title}`);
//     }

//     console.log('Importação completa.');
//   } catch (err) {
//     console.error('Erro ao importar produtos:', err);
//   } finally {
//     // se quiser fechar pool/conexão
//     // await db.end();
//   }
// }

// importarProdutos();



// Adicionar item ao carrinho
app.post('/carrinho', async (req, res) => {
  const { usuario_id, produto_id, quantidade = 1 } = req.body;

  try {
    await db.query(
      'INSERT INTO carrinho (usuarios_id, produtos_id, quantidade) VALUES ($1, $2, $3)',
      [usuario_id, produto_id, quantidade]
    );
    res.status(201).json({ message: 'Adicionado ao carrinho com sucesso' });
  } catch (err) {
    console.error('Erro ao inserir no carrinho:', err);
    res.status(500).json({ error: 'Erro ao inserir no carrinho' });
  }
});

// Buscar carrinho do usuário
app.get('/carrinho/:usuarioId', async (req, res) => {
  const usuarioId = req.params.usuarioId;

  const query = `
    SELECT c.id, c.quantidade, p.title, p.price, p.image
    FROM carrinho c
    JOIN produtos p ON c.produtos_id = p.id
    WHERE c.usuarios_id = $1
  `;

  try {
    const { rows } = await db.query(query, [usuarioId]);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar carrinho:', err);
    res.status(500).json({ error: 'Erro ao buscar carrinho' });
  }
});

// Listar produtos
app.get('/produtos', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM produtos');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Listar usuários
app.get('/usuarios', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Adicionar novo usuário
app.post('/usuarios', async (req, res) => {
  const { gmail, senha, nome } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO usuarios (gmail, senha, nome) VALUES ($1, $2, $3) RETURNING id',
      [gmail, senha, nome]
    );
    res.status(201).json({ id: result.rows[0].id, gmail, nome });
  } catch (err) {
    console.error('Erro ao adicionar usuário:', err);
    res.status(500).json({ error: 'Erro ao adicionar usuário' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
