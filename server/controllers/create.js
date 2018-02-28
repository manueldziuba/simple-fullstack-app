'use strict';

class CreateController {
  constructor(config, dataService, validationService) {
    this.config = config
    this.dataService = dataService
    this.validationService = validationService
  }

  validateRequest(data) {
    let result = this.validationService.validateEntryModel(data)
    return { valid:(result.error === null), data:result.value }
  }

  storeData(req) {
    return new Promise((resolve, reject) => {
      // Validate data
      const validationResult = this.validateRequest(req.body)
      console.log('validationResult', validationResult)
      if (validationResult.valid === false) {
        const err = new Error('Invalid params')
        err.httpStatusCode = 400
        return reject(err)
      }

      // Store data
      this.dataService.storeData(validationResult.data)
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  request (req, res, next) {
    this.storeData(req)
      .then(data => {
        res.json({ success:true, data:data })
      })
      .catch(err => {
        if (err.httpStatusCode) {
          res.status(err.httpStatusCode).json({ success:false, message:err.message })
        } else {
          next(err)
        }
      })
  }
}

module.exports = CreateController
