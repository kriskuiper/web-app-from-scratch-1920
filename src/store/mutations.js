export const setData = (state, payload) => {
	state.launches = payload.launches

	return state
}

export const setLaunch = (state, payload) => {
	state.launch = payload.launch

	return state
}
