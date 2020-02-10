export default class EventDispatcher {
	constructor() {
		this.events = {}
	}

	subscribe(eventName, callback) {
		/*
			Explicitly set the this context because we use our EventDispatcher
			inside the store which has another this context
		*/
		const self = this

		/*
			One event is equal to an array of callbacks that have to be fired.

			If the event name is not known yet we set the value of that event to
			an empty array so we can push the callback without having to do any
			typechecking.
		*/
		if (!self.events.eventName) {
			self.events[eventName] = []
		}

		/*
			We can now safely push the callback to the events from
			our dispatcher
		*/
		console.log('subscribing... ', callback)
		self.events[eventName].push(callback)
	}

	dispatch(eventName, payload = {}) {
		const self = this

		if (!self.events[eventName]) {
			throw new ReferenceError(`Event with name: ${eventName} is not present in store. Are you sure you've subscribed something to that event?`)
		}

		/*
			Fire off a callback for every subscriber that's subscribed
			to the eventName
		*/
		self.events[eventName].map(callback => callback(payload))
	}
}
