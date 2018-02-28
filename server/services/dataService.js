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

  storeData(data) {
    return new Promise((resolve, reject) => {
      let sql = ''
      let paramIncrement = 1
      let params = []
      const dataKeys = Object.keys(data)

      if (data.id) {
        delete dataKeys.id
        sql = `UPDATE entries (${dataKeys
          .map(key => `"${key}"`)
          .join(", ")}) VALUES (${dataKeys
          .map((key, index) => `$${index+1}`)
          .join(", ")})`
        params = dataKeys.map(key => data[key])
      } else {
        sql = `INSERT INTO entries (${dataKeys
          .map(key => `"${key}"`)
          .join(", ")}) VALUES (${dataKeys
          .map((key, index) => `$${index+1}`)
          .join(", ")})
          RETURNING id`
          params = dataKeys.map(key => data[key])
      }

      this.pool.query(sql, params)
        .then(result => {
          const newId = data.id ? data.id : ((result && result.rows) ? result.rows[0].id : null)
          resolve({ id:newId, ...data })
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = DataService
