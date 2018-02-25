'use strict';

class ListController {
  constructor(config, dataService, validationService) {
    this.config = config
    this.dataService = dataService
    this.validationService = validationService
  }

  splitUpFilterParam (value) {
    return (value != null) ? value.split(',') : null
  }

  validateRequest(params) {
    let result = true

    // Check param "sort"
    if (!params.sort ||
      this.validationService.isValidSortKey(params.sort) === -1) {
        params.sort = 'id' // set default
    }

    // Check filter
    if (params.filter) {
      let filterValuesAreDates = true
      params.filter.forEach(val => {
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val) === false) {
          filterValuesAreDates = false
          return false
        }
      })
    }

    return { valid:result, params:params }
  }

  getData(requestParams) {
    return new Promise((resolve, reject) => {
      const params = { ...requestParams }
      params.filter = this.splitUpFilterParam(params.filter || null)

      // Validate params
      const validationResult = this.validateRequest(params)
      if (validationResult.valid === false) {
        const err = new Error('Invalid params')
        err.httpStatusCode = 400
        return reject(err)
      }

      let args = [validationResult.params.sort]
      if (validationResult.params.filter) {
          args = args.concat(validationResult.params.filter)
      }
      this.dataService.getAllData(...args)
        .then(rows => {
          resolve(rows)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  request (req, res, next) {
    this.getData(req.params)
      .then(result => {
        res.json({ success:true, data:rows })
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

module.exports = ListController
