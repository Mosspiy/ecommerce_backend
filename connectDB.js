const { Pool } =require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'bigbite-db.c3ykqesie5bg.ap-southeast-1.rds.amazonaws.com',
    database: 'E_com',
    password: 'piyawat1',
    port: 5432
});

module.exports = pool   