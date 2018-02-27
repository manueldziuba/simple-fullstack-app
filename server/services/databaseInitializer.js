class DatabaseInitializer {
  constructor(pool, dbName, tblName) {
    this.pool = pool
    this.dbName = dbName
    this.tblName = tblName
  }

  runSql(sql) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.pool.query(sql)
        if (!result) {
          const err = new Error(`Could not create data table`)
          reject(err)
          return
        }
        resolve(true)
      } catch (err) {
        reject(err)
      }
    })
  }

  loadData(tblName, jsonData) {
    return new Promise(async (resolve, reject) => {
      let sql = `INSERT INTO ${tblName} 
      (id,city,start_date,end_date,price,status,color) VALUES ($1, $2, $3, $4, $5, $6, $7)`
      
      for (let i=0, len=jsonData.length; i < len; i++) {
        const v = jsonData[i]
        let params = [v.id, v.city, v.start_date, v.end_date, v.price, v.status, v.color]
        await this.pool.query(sql, params)
      }

      resolve();
    })  
  }
}

module.exports = DatabaseInitializer