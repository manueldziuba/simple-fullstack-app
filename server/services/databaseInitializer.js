class DatabaseInitializer {
  constructor(pool, dbName, tblName) {
    this.pool = pool
    this.dbName = dbName
    this.tblName = tblName
  }

  async runSql(sql) {
    const result = await this.pool.query(sql)
    if (!result) {
      const err = new Error(`Could not create data table`)
      throw err
    }
  }

  async loadData(tblName, jsonData) {
    return
  }
}

module.exports = DatabaseInitializer