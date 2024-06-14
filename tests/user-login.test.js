// const chai = require('chai')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const url = `/api/signin`

describe(`POST ${url}`, function() {
  it('Successful login: responds with JWT token', function(done) {
    api.post(url)
      .send({
        email: 'user1@example.com',
        password: '12345678'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        if (!res.body.data.token) throw new Error('No token')
      })
      .end(err => {
        if (err) return done(err)
        return done()
      })
  })

  it('Wrong password: return error code 500', function(done) {
    api.post(url)
      .send({
        email: 'user1@example.com',
        password: '12345678999'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
      .end(err => {
        if (err) return done(err)
        return done()
      })
  })

  it('Wrong email: return error code 500', function(done) {
    api.post(url)
      .send({
        email: 'user123456@example.com',
        password: '12345678'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
      .end(err => {
        if (err) return done(err)
        return done()
      })
  })
})