const assert = require('assert')
const sinon = require('sinon')

const validationService = require('../services/validationService')
const CreateUpdateController = require('../controllers/create_update')

describe('POST /api/data', done => {
  let createController
  let mock = {}

  beforeEach(() => {
    mock.config = {

    }
    mock.dataService = {
      storeData: sinon.stub().resolves()
    }

    createController = new CreateUpdateController(mock.config, mock.dataService, validationService)
  })

  afterEach(() => {
    createController = null
  })

  it('should have set "isUpdate" to false when working as create controller', () => {
    assert.equal(createController.isUpdate, false)
  })

  it('should return true validating a valid payload', () => {
    const payload = {
      city: 'Berlin',
      start_date: '2018-03-01',
      end_date: '2018-12-31',
      price: 10.50,
      status: 'Never',
      color: '#FFFFFF'
    }
    const result = createController.validateRequest(payload)
    assert.equal(typeof result, 'object', 'result should be an object')
    assert.equal(result.valid, true, 'valid should be true')
    assert.equal(result.error, undefined, 'error should not be defined')
  })

  it('should return false validating an invalid payload', () => {
    const payload = {
      city: 400,
      end_date: '2018-12-31',
      price: 'no-numeric',
      status: 'Stuff',
      color: '#FFFFFF'
    }
    const result = createController.validateRequest(payload)
    assert.equal(typeof result, 'object', 'result should be an object')
    assert.equal(result.valid, false, 'valid should be false')
    assert(typeof result.error !== undefined, 'error should be defined')
  })

  it('should successful store valid data and resolve the Promise', done => {
    const req = {
      body: {
        city: 'Berlin',
        start_date: '2018-03-01',
        end_date: '2018-12-31',
        price: 10.50,
        status: 'Never',
        color: '#ffffff'
      }
    }
    createController.storeData(req)
      .then(result => {
        const spyCallData = mock.dataService.storeData.getCall(0).args[0]
        assert.equal(mock.dataService.storeData.calledOnce, true)
        assert.equal(spyCallData.city, req.body.city)
        assert.equal(spyCallData.price, req.body.price)
        assert.equal(spyCallData.status, req.body.status)
        assert.equal(spyCallData.color, req.body.color)
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
    const req = {
      body: {
        city: 99499488383,
        start_date: '2018-03-01',
        price: 'STRING_NOT_NUMERIC',
        status: 'NOT_EXISTING_STATUS',
        color: '#ffffff'
      }
    }
    createController.storeData(req)
      .then(result => {
        done()
      }, err => {
        assert.equal(typeof err.message, 'string')
        done()
      })
  })

  it('should fail on dataservice exception with rejecting the Promise', done => {
    const req = {
      body: {
        city: 99499488383,
        start_date: '2018-03-01',
        price: 'STRING_NOT_NUMERIC',
        status: 'NOT_EXISTING_STATUS',
        color: '#ffffff'
      }
    }
    createController.validateRequest = sinon.stub().returns({ valid:true, data:'STRING_INSTEAD_OF_OBJECT' })
    createController.storeData(req)
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
