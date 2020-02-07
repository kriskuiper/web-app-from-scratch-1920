const maybePrefixWithZero = num => {
	return num < 10 ? `0${num}` : num
}

export default date => {
	const parsedDate = new Date(date)
	const day = maybePrefixWithZero(parsedDate.getDay())
	const month = maybePrefixWithZero(parsedDate.getDay())
	const year = parsedDate.getFullYear()

	return `${day}-${month}-${year}`
}
