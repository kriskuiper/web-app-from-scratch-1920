export default (uri, queryParams) => {
	if (!uri) {
		throw new ReferenceError('Please provide a uri')
	}

	return queryParams
		? `${uri}?${queryParams}`
		: uri
}
