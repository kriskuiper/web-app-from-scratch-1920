export const pushStateIsAvailable = typeof window !== 'undefined'
	&& window.history
	&& window.history.pushState

export const replaceStateIsAvailable = typeof window !== 'undefined'
	&& window.history
	&& window.history.replaceState

export const replaceState = (state, newUri) => {
	window.history.replaceState(state, null, newUri)
}

export const pushState = (state, newUri) => {
	window.history.pushState(state, null, newUri)
}
