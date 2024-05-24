const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)

const timeTool = {
  appointmentFormat: appointment => {
    return dayjs(appointment).format('YYYY-MM-DD HH:mm')
  },
  dateFormatCheck: date => {
    return dayjs(date, 'YYYY-MM-DD HH:mm:ss').isValid()
  },
  getDayOfWeek: date => {
    return dayjs(date).day()
  },
  startTimeAvailable: (startTime, appointment) => {
    // weekday available startTime endTime available
    const startTimeWeek = dayjs(startTime).day()
    return appointment.includes(startTimeWeek)
  },
  bookedCheck: (startTime, trainerRecord) => {
    const allRecordStartTime = trainerRecord.map(record => dayjs(record.startTime).format('YYYY-MM-DD HH:mm'))
    return allRecordStartTime.includes(startTime)
  },
  userOverlappingCheck: (startTime, trainerDuringTime, userRecord) => {
    const endTime = dayjs(startTime).add(parseInt(trainerDuringTime), 'minute').format('YYYY-MM-DD HH:mm')
    const allRecord = userRecord.map(record => ({
      startTime: dayjs(record.startTime).format('YYYY-MM-DD HH:mm'),
      duringTime: parseInt(record.duringTime),
      endTime: dayjs(record.startTime).add(parseInt(record.duringTime), 'minute').format('YYYY-MM-DD HH:mm')
    }))
    for (const record of allRecord) {
      if (dayjs(startTime).isSame(record.startTime) || dayjs(endTime).isSame(record.endTime) || (dayjs(startTime).isAfter(record.startTime) && dayjs(startTime).isBefore(record.endTime))) return true
    }
    return false
  },
  weekdayFormatCheck: appointment => {
    const weekDay = [1, 2, 3, 4, 5, 6, 0]
    for (const x of appointment) {
      if (!weekDay.includes(x)) return true
    }
    return false
  }
}

module.exports = timeTool
