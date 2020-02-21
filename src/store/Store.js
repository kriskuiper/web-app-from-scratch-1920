import EventDispatcher from './lib/EventDispatcher'

export default class Store {
	constructor({ initialState, mutations, actions }) {
		/*
			Explicitly set the this context to the store since we're using our
			dispatcher which has another this context.
		*/
		const self = this

		self.mutations = mutations || {}
		self.actions = actions || {}
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

	dispatch(actionKey, payload) {
		const self = this

		const isValidAction = self.actions[actionKey] &&
			typeof self.actions[actionKey] === 'function'

		if (isValidAction) {
			return self.actions[actionKey](self, payload)
		}

		throw new Error(`Action ${actionKey} does not exist.`)
	}

	commit(mutationKey, payload) {
		const self = this

		const isValidMutation = self.mutations[mutationKey] &&
			typeof self.mutations[mutationKey] === 'function'

		if (isValidMutation) {
			const updatedState = self.mutations[mutationKey](self.state, payload)

			self.state = Object.assign(self.state, updatedState)

			return self.state
		}

		throw new Error(`Mutation ${mutationKey} does not exist.`)
	}
}
