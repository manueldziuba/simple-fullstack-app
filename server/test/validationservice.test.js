const assert = require('assert')
const sinon = require('sinon')

const validationService = require('../services/validationService')

describe('ValidationService', done => {
  let mock = {}

  beforeEach(() => {
  })

  afterEach(() => {
  })

  it('instance is a valid object', () => {
    assert.equal(typeof validationService, 'object')
  })

  it('should have sort item keys', () => {
    assert(validationService.SORT_ITEMS != undefined)
  })

  it('should return true on a valid sort param', () => {
    const sort = 'city:asc'
    const result = validationService.isValidSortKey(sort)
    assert.equal(result, true)
  })

  it('should return false on an invalid sort param', () => {
    const sort = 'doesnotexist'
    const result = validationService.isValidSortKey(sort)
    assert.equal(result, false)
  })

  it('should return false on an invalid sort order param', () => {
    const sort = 'city:mumpits'
    const result = validationService.isValidSortKey(sort)
    assert.equal(result, false)
  })

  it('should return true on a valid date', () => {
    const date = '2017-05-01'
    const result = validationService.isValidDate(date)
    assert.equal(result, true)
  })

  it('should return false on an invalid date (non ISO)', () => {
    const date = 'no-valid-date'
    const result = validationService.isValidDate(date)
    assert.equal(result, false)
  })

  it('should return false on an invalid date (invalid date)', () => {
    const date = '2017-02-30'
    const result = validationService.isValidDate(date)
    assert.equal(result, false)
  })

  it('should return true on valid date diff', () => {
    const date1 = '2017-02-01'
    const date2 = '2017-10-01'
    const result = validationService.isDateBefore(date1, date2)
    assert.equal(result, true)
  })

  it('should return false on invalid date diff', () => {
    const date2 = '2017-10-01'
    const date1 = '2017-02-01'
    const result = validationService.isDateBefore(date2, date1)
    assert.equal(result, false)
  })

  it('should return truthy result on valid ENTRY schema for create', () => {
    const payload = {
      city: 'Berlin',
      start_date: '2018-03-01',
      end_date: '2018-12-31',
      price: 10.50,
      status: 'Daily',
      color: '#FFFFFF'
    }
    const result = validationService.validateEntryModel(payload)
    assert.equal(typeof result, 'object', 'result should be an object')
    assert.equal(result.error, null, 'error should be null')
    assert.equal(typeof result.value, 'object', 'values should be returned')
  })

  it('should return falsy result with error on invalid ENTRY schema for create', () => {
    const payload = {
      city: 'Berlin',
      start_date: '2018-03-01',
      end_date: '2018-12-31',
      price: 10.50,
      status: 'STATUS_NOT_EXIST',
      color: '#FFFFFF'
    }
    const result = validationService.validateEntryModel(payload)
    const errType = 'ValidationError'
    const errMsg = 
    assert.equal(typeof result, 'object', 'result should be an object')
    assert.equal(result.error.name, errType, 'error should be of type ValidationError')
    assert(result.error.message.indexOf('"status" must be one of') > 0, 'error message should show enum values')
  })
})
