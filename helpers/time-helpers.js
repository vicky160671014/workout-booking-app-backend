const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

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
  },
  currentTaipeiTime: () => {
    return dayjs().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
  },
  openLessonTime: (appointment, duringTime) => {
    // input輸入trainer的可預約星期幾(appointment)及課程時長(duringTime)，output為列出兩周內可預約的時間
    let newDay = dayjs()
    const afterTwoWeeks = newDay.add(14, 'day')
    const startTime = '18:00'
    const endTime = '21:30'
    const newAppointmentStartTime = []

    while (newDay.isBefore(afterTwoWeeks)) {
      newDay = newDay.add(1, 'day')
      if (appointment.map(x => parseInt(x)).includes(newDay.day())) {
        let currentTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${startTime}`)
        const endingTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${endTime}`)
        while (currentTime.isBefore(endingTime)) {
          newAppointmentStartTime.push(currentTime.format('YYYY-MM-DD HH:mm'))
          currentTime = currentTime.add(parseInt(duringTime), 'minute')
        }
      }
    }
    return newAppointmentStartTime
  }
}

module.exports = timeTool
