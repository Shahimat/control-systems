import { Pool } from 'pg';

export const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'task',
  user: 'guest',
  password: 'guest'
});