module.exports = {
  development: {
    username: 'ecommerce_6fno_user',
    password: 'CAzMSHfV7BIvQoBfFgh2ThE0ry0R70tC',
    database: 'ecommerce_6fno',
    host: 'dpg-d0lihd1r0fns738ducig-a',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      }
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
  }
};
