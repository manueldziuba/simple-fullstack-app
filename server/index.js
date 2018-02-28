'use strict';

// Get modules
const path = require('path')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const bunyan = require('bunyan')
const config = require('./config.js')

const validationService = require('./services/validationService')
const DataService = require('./services/DataService.js')
const ListController = require('./controllers/list.js')
const CreateUpdateController = require('./controllers/create_update.js')

// Create express app
const app = express()

// Needed middlewares
app.use(cors({ 'origin': '*', 'methods': 'GET,PATCH,POST,DELETE' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('X-HTTP-Method-Override'))

// Create logger (using JSON format)
const logger = bunyan.createLogger({
  name: 'simple-fullstack-app',
  level: config.logLevel || 'info'
})

// Serve Angular app (frontend)
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))

// DataService instance (Postgres data connection)
const dataService = new DataService(config.database)

// Controller instances
const listController = new ListController(config, dataService, validationService)
const createController = new CreateUpdateController(config, dataService, validationService)
const updateController = new CreateUpdateController(config, dataService, validationService, true)

// GET Verb: list data
app.get('/api/data', listController.request.bind(listController))

// POST Verb: create data
app.post('/api/data', createController.request.bind(createController))

// PATCH Verb: update data
app.patch('/api/data/:id', updateController.request.bind(updateController))

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
  /* istanbul ignore next */
  app.listen(config.port, () => {
    logger.info(`Server started on port ${config.port}`)
  })
}

// Export app
module.exports = app
