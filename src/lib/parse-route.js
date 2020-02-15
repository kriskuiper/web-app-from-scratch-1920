const queriesToObject = (queries) => {
	// Remove the ? and split on every & to get seperate queries

	// Create key-value pairs by splitting the = and return key: value

}

export default (route) => {
	const paramsIndex = route.indexOf(':')
	const queryIndex = route.indexOf('?')

	const pathname = route.slice(0, paramsIndex)
	const params = route.slice(paramsIndex, queryIndex)
	const queries = route.slice(queryIndex, route.length)

	return {
		pathname,
		params,
		queriesToObject(queries)
	}
}
