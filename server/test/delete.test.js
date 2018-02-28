const assert = require('assert')
const sinon = require('sinon')

const validationService = require('../services/validationService')
const DeleteController = require('../controllers/delete')

describe('DELETE /api/data', done => {
  let deleteController
  let mock = {}

  beforeEach(() => {
    mock.config = {

    }
    mock.dataService = {
      deleteData: sinon.stub().resolves()
    }

    deleteController = new DeleteController(mock.config, mock.dataService, validationService)
  })

  afterEach(() => {
    deleteController = null
  })

  it('should return true validating a valid payload', () => {
    const payload = {
      id: 1
    }
    const result = deleteController.validateRequest(payload)
    assert.equal(typeof result, 'object', 'result should be an object')
    assert.equal(result.valid, true, 'valid should be true')
    assert.equal(result.error, undefined, 'error should not be defined')
  })

  it('should return false validating an invalid payload', () => {
    const payload = {
      id: 'NOT_NUMERIC!'
    }
    const result = deleteController.validateRequest(payload)
    assert.equal(typeof result, 'object', 'result should be an object')
    assert.equal(result.valid, false, 'valid should be false')
    assert(typeof result.error !== undefined, 'error should be defined')
  })

  it('should return false validating a payload without ID', () => {
    const payload = {}
    const result = deleteController.validateRequest(payload)
    assert.equal(typeof result, 'object', 'result should be an object')
    assert.equal(result.valid, false, 'valid should be false')
    assert(typeof result.error !== undefined, 'error should be defined')
  })

  it('should successful delete entry and resolve the Promise', done => {
    const id = 1000
    deleteController.delete(id)
      .then(result => {
        const spyCallArgs = mock.dataService.deleteData.getCall(0).args
        assert.equal(mock.dataService.deleteData.calledOnce, true)
        assert.equal(spyCallArgs[0], id)
        done()
      }, err => {
        assert.ifError(err)
        done()
      })
      .catch(err => {
        assert.ifError(err)
        done()
      })
  })

  it('should fail on store invalid data with rejecting the Promise', done => {
    deleteController.delete()
      .then(result => {
        done()
      }, err => {
        assert.equal(typeof err.message, 'string')
        done()
      })
  })

  it('should fail on dataservice exception with rejecting the Promise', done => {
    const id = 1000
    deleteController.validateRequest = sinon.stub().returns({ valid:true, data:'STRING_INSTEAD_OF_OBJECT' })
    deleteController.delete(id)
      .then(result => {
        done()
      }, err => {
        done()
      })
      .catch(err => {
        assert.equal(typeof err.message, 'string')
      })
  })
})
