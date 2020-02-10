const prefix = num => {
	return num < 10 ? `0${num}` : num
}

export default date => {
	const parsedDate = new Date(date)
	const day = prefix(parsedDate.getDay())
	const month = prefix(parsedDate.getDay())
	const year = parsedDate.getFullYear()

	return `${day}-${month}-${year}`
}
