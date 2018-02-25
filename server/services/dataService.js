'use strict';

const pg = require('pg')

class DataService {
  constructor(databaseConfig) {
    this.pool = new pg.Pool(databaseConfig)
  }

  getAllData(sortBy, filterStartDate = null, filterEndDate = null) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM datatbl'
      let paramIterator = 1
      let params = []

      if (filterStartDate && filterEndDate) {
        sql += `
        WHERE start_date >= $${paramIterator++}
        AND end_date <= $${paramIterator++}`
        params = [filterStartDate, filterEndDate]
      }
      sql += ` ORDER BY $${paramIterator++}`
      params.push(sortBy)

      this.pool.query(sql, params)
        .then(result => {
          if (result && result.rows) {
            return resolve(result.rows)
          }
          reject()
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = DataService
