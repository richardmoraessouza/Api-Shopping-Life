import db from './db.js';
import express, { Router } from 'express';
import cors from 'cors';


const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.post('/carrinho', (req, res) => {
  const { usuario_id, produto_id, quantidade } = req.body;

  db.query(
    'INSERT INTO carrinho (usuarios_id, produtos_id, quantidade) VALUES (?, ?, ?)',
    [usuario_id, produto_id, quantidade || 1],
    (err, results) => {
      if (err) {
        console.error('Erro ao inserir no carrinho:', err);
        return res.status(500).json(err);
      }
      res.status(201).json({ message: 'Adicionado ao carrinho com sucesso' });
    }
  );
});

app.get('/carrinho/:usuarioId', (req, res) => {
  const usuarioId = req.params.usuarioId;

  const query = `
    SELECT c.id, c.quantidade, p.title, p.price, p.image
    FROM carrinho c
    JOIN produtos p ON c.produtos_id = p.id
    WHERE c.usuarios_id = ?
  `;

  db.query(query, [usuarioId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar carrinho:', err);
      return res.status(500).json({ error: 'Erro ao buscar carrinho' });
    }
    res.json(results); 
  });
});

app.get('/produtos', (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// faz entrar no usuário já existente
app.get('/', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});;


// adicionar um novo usuário
app.post('/', (req, res) => {
  const { gmail , senha , nome} = req.body;
  db.query('INSERT INTO usuarios (gmail, senha, nome) VALUES (?, ?, ?)', [gmail, senha, nome], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ id: results.insertId, gmail, senha, nome})
  });
});



app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});