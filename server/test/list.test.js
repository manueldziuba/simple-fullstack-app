const assert = require('assert')
const sinon = require('sinon')

const validationService = require('../services/validationService')
const ListController = require('../controllers/list')

// Fixtures to test
const fixtureDataServiceResults = {
  byId:         require('./dataServiceResultById'),
  byCity:       require('./dataServiceResultByCity'),
  byStartDate:  require('./dataServiceResultByStartdate'),
  byEndDate:    require('./dataServiceResultByEnddate'),
  byPrice:      require('./dataServiceResultByPrice'),
  byStatus:     require('./dataServiceResultByStatus'),
  byColor:      require('./dataServiceResultByColor')
}

describe('GET /api/data', done => {
  let listController
  let mock = {}

  beforeEach(() => {
    mock.config = {

    }
    mock.logger = {
      info: sinon.stub(),
      warn: sinon.stub()
    }
    mock.dataService = {
      getAllData: sinon.stub().resolves()
    }

    listController = new ListController(mock.config, mock.dataService, validationService)
  })

  afterEach(() => {
    listController = null
    mock.dataService.getAllData = null
  })

  it('should query with "sorting by id" when no "sort" param given', done => {
    listController.getData({})
      .then(result => {
        sinon.assert.calledWith(mock.dataService.getAllData, 'id')
        done()
      })
      .catch(err => {
        assert.ifError(err)
        done()
      })
  })

  it('should split up filter params into dates', done => {
    const dates = ['3/16/2017', '9/3/2017']
    const params = {
      sort: 'id',
      filter: dates.join(',')
    }

    listController.getData(params)
      .then(result => {
        const spyCall = mock.dataService.getAllData.getCall(0)
        assert.equal(spyCall.args[0], 'id', 'First arguments should be "id"')
        assert.equal(spyCall.args[1], dates[0], `Second arguments should be "${dates[0]}"`)
        assert.equal(spyCall.args[2], dates[1], `Second arguments should be "${dates[1]}"`)
        done()
      })
      .catch(err => {
        assert.ifError(err)
        done()
      })
  })

})
