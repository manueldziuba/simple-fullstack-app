'use strict';

class CreateController {
  constructor(config, dataService, validationService, isUpdate = false) {
    this.config = config
    this.dataService = dataService
    this.validationService = validationService
    this.isUpdate = isUpdate
  }

  validateRequest(data) {
    const result = this.validationService.validateEntryModel(data, this.isUpdate)
    const resultError = result.error ? result.error.message : undefined
    return { valid:(result.error === null), data:result.value, error:resultError }
  }

  storeData(req) {
    if (req.params && req.params.id) {
      req.body.id = req.params.id
    }
    return new Promise((resolve, reject) => {
      // Validate data
      const validationResult = this.validateRequest(req.body)
      if (validationResult.valid === false) {
        const err = new Error(`Bad Request; invalid param(s): ${validationResult.error}`)
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

  request /* istanbul ignore next */ (req, res, next) {
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
