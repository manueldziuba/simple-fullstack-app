'use strict';

class DeleteController {
  constructor(config, dataService, validationService) {
    this.config = config
    this.dataService = dataService
    this.validationService = validationService
  }

  validateRequest(data) {
    const result = this.validationService.validateId(data)
    const resultError = result.error ? result.error.message : undefined
    return { valid:(result.error === null), data:result.value, error:resultError }
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      // Validate payload
      const validationResult = this.validateRequest({id:id})
      if (validationResult.valid === false) {
        const err = new Error(`Bad Request; invalid param: ${validationResult.error}`)
        err.httpStatusCode = 400
        return reject(err)
      }

      // Delete data
      this.dataService.deleteData(id)
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  request /* istanbul ignore next */ (req, res, next) {
    this.delete(req.params.id)
      .then(result => {
        res.json({ success:result })
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

module.exports = DeleteController
