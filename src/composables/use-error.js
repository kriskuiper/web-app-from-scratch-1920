import store from '../store'

export default (message) => {
	return store.dispatch('setError', { message })
}
