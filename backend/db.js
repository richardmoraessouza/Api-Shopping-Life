// db.js ou connection.js
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});


pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Erro ao conectar ao PostgreSQL:', err.stack);
  }
  console.log('✅ Conectado ao banco de dados PostgreSQL!');
  release();
});

export default pool;
