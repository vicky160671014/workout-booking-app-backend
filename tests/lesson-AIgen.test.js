const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../models')
const { Trainer, Record, Comment } = db
const timeTool = require('../helpers/time-helpers')
const { getLesson, postAppointment } = require('../services/lesson-services')

describe('getLesson', () => {
  // Successfully retrieves trainer details by trainerId
  it('should retrieve trainer details when given a valid trainerId', async () => {
    const req = { params: { trainerId: 1 } }
    const cb = sinon.spy()

    const trainerMock = { id: 1, name: 'John Doe', appointment: [], duringTime: 60 }
    const recordMock = [{ startTime: '2023-10-10T10:00:00' }]
    const commentMock = [{ scores: 5 }]
    const avgScoreMock = { avgScores: '4.5' }

    sinon.stub(Trainer, 'findByPk').resolves(trainerMock)
    sinon.stub(Record, 'findAll').resolves(recordMock)
    sinon.stub(Comment, 'findAll').resolves(commentMock)
    sinon.stub(Comment, 'findOne').resolves(avgScoreMock)
    sinon.stub(timeTool, 'currentTaipeiTime').returns(new Date())
    sinon.stub(timeTool, 'availableReserve').returns(['2023-10-11T10:00:00'])

    await getLesson(req, cb)

    expect(cb.calledOnce).to.be.true
    expect(cb.firstCall.args[0]).to.be.null
    expect(cb.firstCall.args[1]).to.deep.equal({
      trainer: {
        ...trainerMock,
        availableReserveTime: ['2023-10-11T10:00:00']
      },
      highComment: commentMock[0],
      lowComment: null,
      avgCommentScore: avgScoreMock
    })

    Trainer.findByPk.restore()
    Record.findAll.restore()
    Comment.findAll.restore()
    Comment.findOne.restore()
    timeTool.currentTaipeiTime.restore()
    timeTool.availableReserve.restore()
  })

  // Trainer does not exist for the given trainerId
  it('should return an error when trainer does not exist', async () => {
    const req = { params: { trainerId: 999 } }
    const cb = sinon.spy()

    sinon.stub(Trainer, 'findByPk').resolves(null)

    await getLesson(req, cb)

    expect(cb.calledOnce).to.be.true
    expect(cb.firstCall.args[0]).to.be.an('error')
    expect(cb.firstCall.args[0].message).to.equal("Trainer didn't exist!")

    Trainer.findByPk.restore()
  })
})

describe('postAppointment', () => {
  // Successfully creates a new appointment when all inputs are valid
  it('should create a new appointment when all inputs are valid', async () => {
    const req = {
      user: { id: 1 },
      body: { trainerId: 2, appointment: '2023-10-10T10:00:00Z' }
    }
    const cb = sinon.spy()
    const trainer = { id: 2, userId: 3, appointment: '2023-10-10T10:00:00Z', duringTime: 60 }
    const userRecord = []
    const trainerRecord = []

    sinon.stub(Trainer, 'findByPk').resolves(trainer)
    sinon.stub(Record, 'findAll').resolves([])
    sinon.stub(Record, 'create').resolves({ id: 1, startTime: '2023-10-10T10:00:00Z', duringTime: 60, userId: 1, trainerId: 2 })
    sinon.stub(timeTool, 'appointmentFormat').returns('2023-10-10T10:00:00Z')
    sinon.stub(timeTool, 'startTimeAvailable').returns(true)
    sinon.stub(timeTool, 'bookedCheck').returns(false)
    sinon.stub(timeTool, 'userOverlappingCheck').returns(false)

    await postAppointment(req, cb)

    expect(cb.calledOnce).to.be.true
    expect(cb.firstCall.args[0]).to.be.null
    expect(cb.firstCall.args[1]).to.have.property('record')

    Trainer.findByPk.restore()
    Record.findAll.restore()
    Record.create.restore()
    timeTool.appointmentFormat.restore()
    timeTool.startTimeAvailable.restore()
    timeTool.bookedCheck.restore()
    timeTool.userOverlappingCheck.restore()
  })

  // Throws an error when required fields are missing
  it('should throw an error when required fields are missing', async () => {
    const req = {
      user: { id: 1 },
      body: { trainerId: null, appointment: null }
    }
    const cb = sinon.spy()

    await postAppointment(req, cb)

    expect(cb.calledOnce).to.be.true
    expect(cb.firstCall.args[0]).to.be.an('error')
    expect(cb.firstCall.args[0].message).to.equal('All fields are required')
  })

  // Confirms no overlapping appointments for the trainer
  it('should not allow overlapping appointments for the trainer', async () => {
    const req = {
      user: { id: 1 },
      body: { trainerId: 2, appointment: '2023-10-10T10:00:00Z' }
    }
    const cb = sinon.spy()
    const trainer = { id: 2, userId: 3, appointment: '2023-10-10T10:00:00Z', duringTime: 60 }
    const userRecord = []
    const trainerRecord = [{ startTime: '2023-10-10T10:00:00Z', duringTime: 60, userId: 1, trainerId: 2 }]

    sinon.stub(Trainer, 'findByPk').resolves(trainer)
    sinon.stub(Record, 'findAll').resolves([])
    sinon.stub(Record, 'create').resolves({ id: 1, startTime: '2023-10-10T10:00:00Z', duringTime: 60, userId: 1, trainerId: 2 })
    sinon.stub(timeTool, 'appointmentFormat').returns('2023-10-10T10:00:00Z')
    sinon.stub(timeTool, 'startTimeAvailable').returns(true)
    sinon.stub(timeTool, 'bookedCheck').returns(true)
    sinon.stub(timeTool, 'userOverlappingCheck').returns(false)

    await postAppointment(req, cb)

    expect(cb.calledOnce).to.be.true
    expect(cb.firstCall.args[0]).to.be.an('Error')

    Trainer.findByPk.restore()
    Record.findAll.restore()
    Record.create.restore()
    timeTool.appointmentFormat.restore()
    timeTool.startTimeAvailable.restore()
    timeTool.bookedCheck.restore()
    timeTool.userOverlappingCheck.restore()
  })

  // Confirms no overlapping appointments for the user
  it('should confirm no overlapping appointments for the user', async () => {
    const req = {
      user: { id: 1 },
      body: { trainerId: 2, appointment: '2023-10-10T10:00:00Z' }
    }
    const cb = sinon.spy()
    const trainer = { id: 2, userId: 3, appointment: '2023-10-10T10:00:00Z', duringTime: 60 }
    const userRecord = []
    const trainerRecord = []

    sinon.stub(Trainer, 'findByPk').resolves(trainer)
    sinon.stub(Record, 'findAll').resolves([])
    sinon.stub(Record, 'create').resolves({ id: 1, startTime: '2023-10-10T10:00:00Z', duringTime: 60, userId: 1, trainerId: 2 })
    sinon.stub(timeTool, 'appointmentFormat').returns('2023-10-10T10:00:00Z')
    sinon.stub(timeTool, 'startTimeAvailable').returns(true)
    sinon.stub(timeTool, 'bookedCheck').returns(false)
    sinon.stub(timeTool, 'userOverlappingCheck').returns(false)

    await postAppointment(req, cb)

    expect(cb.calledOnce).to.be.true
    expect(cb.firstCall.args[0]).to.be.null
    expect(cb.firstCall.args[1]).to.have.property('record')

    Trainer.findByPk.restore()
    Record.findAll.restore()
    Record.create.restore()
    timeTool.appointmentFormat.restore()
    timeTool.startTimeAvailable.restore()
    timeTool.bookedCheck.restore()
    timeTool.userOverlappingCheck.restore()
  })

  // Throws an error if the appointment time slot is already reserved by another user
  it('should throw an error if appointment time slot is already reserved', async () => {
    const req = {
      user: { id: 1 },
      body: { trainerId: 2, appointment: '2023-10-10T10:00:00Z' }
    }
    const cb = sinon.spy()
    const trainer = { id: 2, userId: 3, appointment: '2023-10-10T10:00:00Z', duringTime: 60 }
    const userRecord = []
    const trainerRecord = [{ startTime: '2023-10-10T10:00:00Z' }]

    sinon.stub(Trainer, 'findByPk').resolves(trainer)
    sinon.stub(Record, 'findAll').resolves([])
    sinon.stub(Record, 'create').resolves({ id: 1, startTime: '2023-10-10T10:00:00Z', duringTime: 60, userId: 1, trainerId: 2 })
    sinon.stub(timeTool, 'appointmentFormat').returns('2023-10-10T10:00:00Z')
    sinon.stub(timeTool, 'startTimeAvailable').returns(true)
    sinon.stub(timeTool, 'bookedCheck').returns(true)
    sinon.stub(timeTool, 'userOverlappingCheck').returns(false)

    await postAppointment(req, cb)

    expect(cb.calledOnce).to.be.true
    expect(cb.firstCall.args[0]).to.be.an('Error')

    Trainer.findByPk.restore()
    Record.findAll.restore()
    Record.create.restore()
    timeTool.appointmentFormat.restore()
    timeTool.startTimeAvailable.restore()
    timeTool.bookedCheck.restore()
    timeTool.userOverlappingCheck.restore()
  })
})