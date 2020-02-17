const prefix = num => {
	return num < 10 ? `0${num}` : num
}

/**
 * @description Formats a date to a string: DD-MM-YYYY
 * @param {Date} date A Javascript date
 */

export default date => {
	const parsedDate = new Date(date)
	const day = prefix(parsedDate.getDay())
	const month = prefix(parsedDate.getDay())
	const year = parsedDate.getFullYear()

	return `${day}-${month}-${year}`
}
