import db from './db.js'; 
import express from 'express';
// import fetch from 'node-fetch'
import cors from 'cors';
import bcrypt from "bcrypt"


const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

// async function importarProdutosDummy() {
//   try {
//     // Pegando todos os produtos (limit=0 traz a lista completa)
//     const res = await fetch('https://dummyjson.com/products?limit=0');
//     const data = await res.json();
//     const produtos = data.products;

//     for (const prod of produtos) {
//       // Desestruturando a API conforme a interface que você mandou
//       const {
//         title, description, category, price, discountPercentage,
//         rating, stock, brand, sku, weight, dimensions,
//         warrantyInformation, shippingInformation, availabilityStatus,
//         returnPolicy, minimumOrderQuantity, thumbnail, images,
//         reviews, meta, tags
//       } = prod;

//       await db.query(
//   `INSERT INTO shoppinglife.produtos (
//     title, description, category, price, discountpercentage, 
//     rating, stock, brand, sku, weight, 
//     width, height, depth, 
//     warrantyinformation, shippinginformation, availabilitystatus, 
//     returnpolicy, minimumorderquantity, 
//     thumbnail, images, reviews, tags, 
//     createdat, updatedat, barcode, qrcode
//   ) VALUES (
//     $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
//     $11, $12, $13, $14, $15, $16, $17, $18, 
//     $19, $20, $21, $22, $23, $24, $25, $26
//   ) ON CONFLICT DO NOTHING`, // Se der erro de duplicata, ele apenas pula o item
//   [
//     title, description, category, price, discountPercentage,
//     rating, stock, brand, sku, weight,
//     dimensions.width, dimensions.height, dimensions.depth,
//     warrantyInformation, shippingInformation, availabilityStatus,
//     returnPolicy, minimumOrderQuantity,
//     thumbnail, 
//     JSON.stringify(images),
//     JSON.stringify(reviews),
//     JSON.stringify(tags),
//     meta.createdAt, meta.updatedAt, meta.barcode, meta.qrCode
//   ]
// );
      
//       console.log(`✅ Inserido/Atualizado: ${title}`);
//     }

//     console.log('🚀 Importação da DummyJSON completa!');
//   } catch (err) {
//     console.error('❌ Erro feio na importação:', err);
//   }
// }

// importarProdutosDummy();

app.post('/carrinho', async (req, res) => {
  const { usuario_id, produto_id, quantidade = 1 } = req.body;

  try {
    await db.query(
      'INSERT INTO shoppinglife.carrinho (usuarios_id, produtos_id, quantidade) VALUES ($1, $2, $3)',
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
    SELECT c.id, c.quantidade, p.title, p.price, p.produtos_id, p.images
    FROM shoppinglife.carrinho c
    JOIN shoppinglife.produtos p ON c.produtos_id = p.id
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
    const { rows } = await db.query('SELECT * FROM shoppinglife.produtos');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Listar usuários
app.get('/usuarios', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM shoppinglife.usuarios');
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
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds)

    const result = await db.query(
      'INSERT INTO shoppinglife.usuarios (gmail, senha, nome) VALUES ($1, $2, $3) RETURNING id',
      [gmail, senhaHash, nome]
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
