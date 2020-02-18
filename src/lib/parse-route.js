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

const stripHash = (hashRoute) => {
	return hashRoute.replace('#/', '')
}

const getQueries = (route) => {
	const queryIndex = route.indexOf('?')

	if (queryIndex !== -1) {
		return route.slice(queryIndex, route.length)
	}

	return ''
}

const getParams = (route) => {
	// Capture a group from / to ? of a query
	const paramsToQueryRegex = new RegExp(/\/(.*)\?/)

	// Capture a group from / to the end of input
	const paramsToEndRegex = new RegExp(/\/(.*)$/)

	const matchesToQuery = route.match(paramsToQueryRegex)
	const matchesToEnd = route.match(paramsToEndRegex)

	if (matchesToQuery) {
		return matchesToQuery[1]
	}

	else if (matchesToEnd) {
		return matchesToEnd[1]
	}

	else {
		return ''
	}
}

const getPathname = (route) => {
	const splittedRouteName = route.split('/')

	return `/${splittedRouteName[0]}`
}

export default (hashRoute) => {
	const withoutHash = stripHash(hashRoute)
	const queries = getQueries(withoutHash)
	const params = getParams(withoutHash)
	const pathname = getPathname(withoutHash)

	return {
		pathname,
		params,
		queries: toObject(queries)
	}
}
