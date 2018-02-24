const assert = require('assert')
const sinon = require('sinon')
const request = require('supertest')

// The application
const app = require('../index')

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

describe('App server', done => {
  let mock = {}

  beforeEach(() => {
    mock.logger = {
      info: sinon.stub(),
      warn: sinon.stub()
    }
    mock.dataService = {
      getDataFromDb: sinon.stub().resolves()
    }
  })

  afterEach(() => {
  })

  it('should return HTTP status 404 on invalid path', done => {
    request(app)
      .get('/invalid')
      .expect(404)
      .end((err, res) => {
        assert.deepEqual(res.body, { success: false, message: 'Not Found' })
        done()
      })
  })

  it('should return HTTP status 200 on GET /api/data', done => {
    request(app)
      .get('/api/data')
      .expect(200)
      .end((err, res) => {
        assert(res.body.success, true, 'Response JSON should have key "success" with value TRUE')
        done()
      })
  })

  it('should return data sorted by "id" when no "sort" param given on GET /api/data', done => {
    request(app)
      .get('/api/data')
      .expect(200)
      .end((err, res) => {
        assert.deepEqual(res.body, fixtureDataServiceResults.byId)
        done()
      })
  })

  it('should return data sorted by "id" on GET /api/data', done => {
    request(app)
      .get('/api/data?sort=id')
      .expect(200)
      .end((err, res) => {
        assert.deepEqual(res.body, fixtureDataServiceResults.byId)
        done()
      })
  })

  it('should return data sorted by "city" on GET /api/data', done => {
    request(app)
      .get('/api/data?sort=city')
      .expect(200)
      .end((err, res) => {
        assert.deepEqual(res.body, fixtureDataServiceResults.byCity)
        done()
      })
  })

  it('should return data sorted by "start_date" on GET /api/data', done => {
    request(app)
      .get('/api/data?sort=start_date')
      .expect(200)
      .end((err, res) => {
        assert.deepEqual(res.body, fixtureDataServiceResults.byStartDate)
        done()
      })
  })

  it('should return data sorted by "end_date" on GET /api/data', done => {
    request(app)
      .get('/api/data?sort=end_date')
      .expect(200)
      .end((err, res) => {
        assert.deepEqual(res.body, fixtureDataServiceResults.byEndDate)
        done()
      })
  })

  it('should return data sorted by "price" on GET /api/data', done => {
    request(app)
      .get('/api/data?sort=price')
      .expect(200)
      .end((err, res) => {
        assert.deepEqual(res.body, fixtureDataServiceResults.byPrice)
        done()
      })
  })

  it('should return data sorted by "status" on GET /api/data', done => {
    request(app)
      .get('/api/data?sort=status')
      .expect(200)
      .end((err, res) => {
        assert.deepEqual(res.body, fixtureDataServiceResults.byStatus)
        done()
      })
  })

  it('should return data sorted by "color" on GET /api/data', done => {
    request(app)
      .get('/api/data?sort=color')
      .expect(200)
      .end((err, res) => {
        assert.deepEqual(res.body, fixtureDataServiceResults.byColor)
        done()
      })
  })

})
