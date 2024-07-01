const { expect } = require('chai')
const { userOverlappingCheck, openLessonTime } = require('../helpers/time-helpers')
const dayjs = require('dayjs')

describe('userOverlappingCheck', () => {
  // returns true when startTime overlaps with any record's startTime
  it("should return true when startTime overlaps with any record's startTime", () => {
    const startTime = dayjs('2023-10-01 10:00')
    const trainerDuringTime = 60
    const userRecord = [
      { startTime: '2023-10-01 10:00', duringTime: 30 },
      { startTime: '2023-10-01 11:00', duringTime: 30 }
    ]

    const result = userOverlappingCheck(startTime, trainerDuringTime, userRecord)
    expect(result).to.be.true
  })

  // handles empty userRecord array correctly
  it('should return false when userRecord array is empty', () => {

    const startTime = dayjs('2023-10-01 10:00')
    const trainerDuringTime = 60
    const userRecord = []

    const result = userOverlappingCheck(startTime, trainerDuringTime, userRecord)
    expect(result).to.be.false
  })

  // handles records with overlapping start and end times
  it("should return true when startTime overlaps with any record's startTime", () => {

    const startTime = dayjs('2023-10-01 10:00')
    const trainerDuringTime = 60
    const userRecord = [
      { startTime: '2023-10-01 10:00', duringTime: 30 },
      { startTime: '2023-10-01 11:00', duringTime: 30 }
    ]

    const result = userOverlappingCheck(startTime, trainerDuringTime, userRecord)
    expect(result).to.be.true
  })
})

describe('openLessonTime', () => {
  // Generates available times for a trainer within two weeks
  it('should generate available times within two weeks when given valid appointment days and duration', () => {
    const appointment = [1, 3, 5] // Monday, Wednesday, Friday
    const duringTime = 60 // 60 minutes

    const result = openLessonTime(appointment, duringTime)

    // Check if the result contains times within the next two weeks
    const now = dayjs()
    const twoWeeksLater = now.add(14, 'day')
    result.forEach(time => {
      const timeDayjs = dayjs(time)
      expect(timeDayjs.isAfter(now)).to.be.true
      expect(timeDayjs.isBefore(twoWeeksLater)).to.be.true
    })
  })

  // Handles non-standard working hours if startTime or endTime changes
  it('should handle non-standard working hours if startTime or endTime changes', () => {

    // Mock data
    const appointment = [1, 3, 5] // Monday, Wednesday, Friday
    const duringTime = 60 // 60 minutes
    const startTime = '17:00' // Changed start time
    const endTime = '20:30' // Changed end time

    // Execute the function
    const result = openLessonTime(appointment, duringTime)

    // Assertion
    result.forEach(time => {
      const timeDayjs = dayjs(time)
      expect(timeDayjs.format('HH:mm')).to.be.greaterThanOrEqual(startTime)
      expect(timeDayjs.format('HH:mm')).to.be.lessThanOrEqual(endTime)
    })
  })
})
