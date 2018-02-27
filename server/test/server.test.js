const assert = require('assert')
const sinon = require('sinon')
const request = require('supertest')

// The application
const app = require('../../server')

describe('App Server', done => {

  it('should return HTTP status 404 on invalid api path', done => {
    request(app)
      .get('/api/invalid')
      .expect(404)
      .end((err, res) => {
        assert(res.status === 404, 'HTTP status code should be 404')
        assert.deepEqual(res.body, { success: false, message: 'Not Found' })
        done()
      })
  })

  it('should return HTTP status 200 on root (serving Angular app)', done => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        assert(res.status === 200, 'HTTP status code should be 200')
        assert(res.body.indexOf('<head>') !== -1)
        done()
      })
  })

})
