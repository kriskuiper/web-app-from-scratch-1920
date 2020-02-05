export default (uri, queryParams) => {
	return queryParams
		? `${uri}?${queryParams}`
		: uri
}
