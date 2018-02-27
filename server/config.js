module.exports = {
  port: 5000,
  logLevel: 'info',
  database: {
    host: 'docker_postgres_db',
    port: 5432,
    user: 'postgres',
    password: 'P05tgr3s/pw',
    database: 'simple_fullstack_app',
    max: 1,
    idleTimeoutMillis: 30000
  }
}
