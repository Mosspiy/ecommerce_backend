const { Pool } =require('pg');

const pool = new Pool({
    user: 'ecommerce_6fno_user',
    host: 'dpg-d0lihd1r0fns738ducig-a.singapore-postgres.render.com',
    database: 'ecommerce_6fno',
    password: 'CAzMSHfV7BIvQoBfFgh2ThE0ry0R70tC',
    port: 5432,
    ssl: {
        ssl: true,
        rejectUnauthorized: false
    }
});

// ทดสอบการเชื่อมต่อทันที
pool
  .connect()
  .then(() => console.log('✅ Connected to Render PostgreSQL!'))
  .catch((err) => console.error('❌ Connection error:', err.stack));

module.exports = pool;

module.exports = pool   