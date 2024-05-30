import pg from 'pg'

const db = new pg.Pool({
  connectionString: 'postgresql://postgres:password@localhost:5438/bookbites',
});

export default db;