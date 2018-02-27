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
const dbInitFile = path.join(__dirname, 'db_init.sql');

// Promisify fs.readFile to use async/await
var readFileAsync = Promise.promisify(fs.readFile);

const readSqlFile = (filePath, dbName, tblName) => {
  return new Promise(async (resolve, reject) => {
    try {
      let content = await readFileAsync(filePath, 'utf8')
      content = content
        .replace('%DBNAME%', dbName)
        .replace('%TBLNAME%', tblName)
      resolve(content)
    } catch(err) {
      reject(err)
    }
  })
}

console.log('Initializing the database......\n')

try {
  const pgPool = pg.Pool(config.database)
  const dbInitializer = new DatabaseInitializer(pgPool, dbName, tblName)

  readSqlFile(dbInitFile, dbName, tblName)
    .then(dbInitializer.runSql.bind(dbInitializer))
    .then(dbInitializer.loadData.bind(dbInitializer, tblName, data))
    .then(() => {
      console.log(`Successfully initialized database structure`)
      process.exit(0)
    })
    .catch(err => {
      throw err
    })

} catch (err) {
  console.error(err)
  process.exit(1)
}