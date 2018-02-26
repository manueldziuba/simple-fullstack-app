'use strict';

const fs = require('fs')
const path = require('path')
const pg = require('pg')
const Promise = require('bluebird')
const config = require('../server/config')
const DatabaseInitializer = require('../server/services/databaseInitializer')
const data = require('./data.json')

const dbName = config.database.database
const tblName = 'entries'
const dbInitFile = path.join(__dirname, 'db_init.sql')

// Promisify fs.readFile to use async/await
var readFileAsync = Promise.promisify(require('fs').readFile)

async function readSqlFile(filePath, dbName, tblName) {
  let txt = await readFileAsync(filePath, 'utf8')
  return txt
}

/*
const readSqlFile = (filePath, dbName, tblName) => {
  return new Promise((resolve, reject) => {
    readFileAsync(filePath, 'utf8')
      .then(content => {
        console.warn('HIER')
        content = content
          .replace('%DBNAME%', dbName)
          .replace('%TBLNAME%', tblName)
        console.log('CONTENT', content)
        resolve(content)
      })
      .catch(err => {
        reject(err)
      })
  })
}
*/

console.log('Initializing the database......\n')

try {
  const pgPool = pg.Pool(config.database)
  const dbInitializer = new DatabaseInitializer(pgPool, dbName)

  // Read init SQL from static file
  const dbSql = readSqlFile(dbInitFile, dbName, tblName)
  console.log('dbSql = ', dbSql)

  /*
    .then(dbSql => {
      console.log(`Run SQL to initialize db (in Docker):`, dbSql)

      dbInitializer.runSql(dbSql)
        .then(success => {

        })
      
    })
  */
  
  
  console.log(`Successfully initialized database structure`)

} catch (err) {
  console.error(err)
  process.exit(1)
}

process.exit(0)