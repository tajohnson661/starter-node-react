// Sequelize database parameters.  Also used by Sequelize-cli for migrations,
// seeds, model creation

module.exports = {
  development: {
    username: 'Tom',
    password: null,
    database: 'db1',
    host: 'localhost',
    dialect: 'postgres'
  },
  test: {
    username: 'Tom',
    password: null,
    database: 'db1-test',
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};

