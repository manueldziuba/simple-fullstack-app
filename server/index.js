'use strict';

// Get modules
const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const bunyan = require('bunyan')
const config = require('./config.js')

// Create express app
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('X-HTTP-Method-Override'))

// Create logger (using JSON format)
const logger = bunyan.createLogger({
  name: 'simple-fullstack-app',
  level: config.logLevel || 'info'
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
