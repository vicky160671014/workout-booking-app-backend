const { expect } = require('chai')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)
let APItoken = null

before((done) => {
  api.post('/api/signin')
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
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          APItoken = `Bearer ${res.body.data.token}`
          done()
        }
      })
})

describe(`GET /api/users/68`, function() {
  it('Should respond with user data', function(done) {
    // Added log to check if token is set
    // console.log('APItoken:', APItoken)

    api.get('/api/users/68')
      .set('authorization', APItoken)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          // Added log to check the response body
          // console.log('Response Body:', res.body)

          // Check if the response body has the expected structure
          expect(res.body.data).to.have.property('user')
          expect(res.body.data.user.isTrainer).to.have.property('name')
          expect(res.body.data).to.have.property('newReservation')
          expect(res.body.data).to.have.property('awaitCommentRecord')
          expect(res.body.data).to.have.property('myRankIndex')
          done()
        }
      })
  })

  it('Should be unauthorized', function(done) {
    api.get('/api/users/68')
      .set('authorization', APItoken + 123)
      .expect(401, done)
  })
  })