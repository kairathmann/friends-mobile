/* eslint-disable no-mixed-spaces-and-tabs*/
import moment from 'moment'

const COMMON_DATE_FORMAT = 'MMM Do, hh:mm'

const pastDayOfWeek = (inputDate, weekAgo, dayOfWeek) => {
	return inputDate.isoWeekday(7 + (weekAgo + 1) * -7 + dayOfWeek)
}

const nextDayOfWeek = (inputDate, weekBefore, dayOfWeek) => {
	return inputDate.isoWeekday(-7 + (weekBefore + 1) * 7 + dayOfWeek)
}

const getRoundBounds = (inputDate = moment(), dayOfWeek = 5) => {
	const dateDayOfWeek = moment(inputDate).isoWeekday()
	return dateDayOfWeek < dayOfWeek
		? [
				pastDayOfWeek(moment(inputDate), 1, dayOfWeek),
				pastDayOfWeek(moment(inputDate), 0, dayOfWeek)
		  ]
		: [
				nextDayOfWeek(moment(inputDate), 0, dayOfWeek),
				nextDayOfWeek(moment(inputDate), 1, dayOfWeek)
		  ]
}

export { COMMON_DATE_FORMAT, getRoundBounds }
/* eslint-enable no-mixed-spaces-and-tabs*/
