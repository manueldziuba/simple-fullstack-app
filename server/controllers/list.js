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
      !this.validationService.isValidSortKey(params.sort)) {
        params.sort = 'id' // set default
    }


    // Check filter
    if (params.filter) {
      let filterValuesAreDates = true
      params.filter.forEach(val => {
        if (this.validationService.isValidDate(val) === false) {
          filterValuesAreDates = false
          return false
        }
      })
      const isDateRangeValid = this.validationService.isDateBefore(...params.filter)
      if (filterValuesAreDates === false || isDateRangeValid === false) {
        result = false
      }
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

      // Build arguments
      let args = [validationResult.params.sort]
      if (validationResult.params.filter) {
          args = args.concat(validationResult.params.filter)
      }

      // Get data
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
    this.getData(req.query)
      .then(result => {
        res.json({ success:true, data:result })
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
