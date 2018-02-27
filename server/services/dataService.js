'use strict';

const pg = require('pg')

class DataService {
  constructor(databaseConfig) {
    if (databaseConfig) {
      this.pool = new pg.Pool(databaseConfig)
    }
  }

  getAllData(sortBy, sortOrder, filterStartDate = null, filterEndDate = null) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM entries'
      const params = []

      if (filterStartDate && filterEndDate) {
        sql += ` WHERE start_date::date >= $1 AND end_date::date <= $2`
        params.push(filterStartDate)
        params.push(filterEndDate)
      }
      sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`

      this.pool.query(sql, params)
        .then(result => {
          resolve( (result && result.rows) ? result.rows : [])
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = DataService
