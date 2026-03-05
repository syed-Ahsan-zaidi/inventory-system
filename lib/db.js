import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inventory_db', 
  password: '1234', // Apna pgAdmin password yahan likhein
  port: 5432,
});

export default pool;