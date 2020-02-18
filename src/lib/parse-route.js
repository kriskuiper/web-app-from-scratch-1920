const toObject = (queryString) => {
	const queries = queryString.replace('?', '')
	const splittedQueries = queries.split('&')

	if (queries && splittedQueries) {
		return splittedQueries.reduce((queryObject, splittedQuery) => {
			const keyValuePair = splittedQuery.split('=')

			// Set the key (before the =) equal to the value (after the =)
			queryObject[keyValuePair[0]] = keyValuePair[1]

			return queryObject
		}, {})
	}

	return {}
}

export default (route) => {
	const pathnameRegex = new RegExp(/\/(.*)\//)
	const queryRegex = new RegExp(/\?(.*)/)
	const paramsRegex = new RegExp(/\/(.*)\?/)

	console.log(route.match(pathnameRegex))
	console.log(route.match(paramsRegex))
	console.log(route.match(queryRegex))

	return {

	}
}
