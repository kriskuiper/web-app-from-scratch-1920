import EventDispatcher from './lib/EventDispatcher'

export default class Store {
	constructor({ initialState, mutations }) {
		/*
			Explicitly set the this context to the store since we're using our
			dispatcher which has another this context.
		*/
		const self = this

		self.mutations = mutations || {}
		self.events = new EventDispatcher

		self.state = new Proxy(initialState || {}, {
			set(state, key, newValue) {
				// Just set the value as you would do with an object
				state[key] = newValue

				// Let all subscribed components know that state has changed
				self.events.dispatch('stateChange', self.state)

				return true
			}
		})
	}

	commit(mutationKey, payload) {
		const self = this

		const isValidMutation = self.mutations[mutationKey] &&
			typeof self.mutations[mutationKey] === 'function'

		if (!isValidMutation) {
			throw new Error(`Mutation ${mutationKey} does not exist.`)
		}

		const updatedState = self.mutations[mutationKey](self.state, payload)

		self.state = {
			...this.state,
			...updatedState
		}
	}
}