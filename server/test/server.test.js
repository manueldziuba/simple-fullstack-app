const assert = require('assert')
const sinon = require('sinon')
const request = require('supertest')

// The application
const app = require('../../server')

describe('App Server', done => {

  it('should return HTTP status 404 on invalid path', done => {
    request(app)
      .get('/invalid')
      .expect(404)
      .end((err, res) => {
        assert(res.status === 404, 'HTTP status code should be 404')
        assert.deepEqual(res.body, { success: false, message: 'Not Found' })
        done()
      })
  })

})
