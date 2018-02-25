'use strict';

// Get modules
const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const bunyan = require('bunyan')
const config = require('./config.js')

const validationService = require('./services/validationService')
const DataService = require('./services/DataService.js')
const ListController = require('./controllers/list.js')

// Create express app
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('X-HTTP-Method-Override'))

// Create logger (using JSON format)
const logger = bunyan.createLogger({
  name: 'simple-fullstack-app',
  level: config.logLevel || 'info'
})

// DataService instance (Postgres data connection)
const dataService = new DataService(config.database)

// Controller instances
const listController = new ListController(config, dataService, validationService)

// GET Verb: list data
app.get('/api/data', listController.request.bind(listController))


// Invalid routes (404 Not Found)
app.all('*', (req, res, next) => {
  res.status(404).json({ success:false, message:'Not Found' })
})

// Error Handler; returning error message (no stack trace)
app.use((err, req, res, next) => {
  // Log complete error with stack trace
  logger.error(err)
  res.status(500).json({ success:false, message:'Internal Server Error' })
})

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    logger.info(`Server started on port ${config.port}`)
  })
}

// Export app
module.exports = app
