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
			If no event is yet present then set it to an empty array so we don't
			have to do any further typechecking and can just push the callback
		*/
		if (!self.events[eventName]) {
			self.events[eventName] = []
		}

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
