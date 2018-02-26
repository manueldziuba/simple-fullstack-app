module.exports = {
  port: 5000,
  logLevel: 'info',
  database: {
    host: 'docker_postgres_db',
    port: 5432,
    username: 'postgres',
    password: 'P05tgr3s/pw',
    max: 1,
    idleTimeoutMillis: 30000
  }
}
