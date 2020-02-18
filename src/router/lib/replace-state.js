const replaceStateIsAvailable = typeof window !== 'undefined' &&
	window.history &&
	window.history.replaceState

export default (uri) => {
	if (replaceStateIsAvailable) {
		return window.history.replaceState({ page: uri }, null, uri)
	}

	throw new Error('Replace state is not available, please update your browser.')
}
