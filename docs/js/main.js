import { wrap } from 'https://unpkg.com/comlink@alpha/dist/esm/comlink.mjs';

class Route {
	constructor(pathname, component) {
		this.pathname = `#${pathname}`;
		this.component = component;
	}

	render() {
		return this.component.render()
	}
}

var getCorrectedUri = (uri, queryParams) => {
	return queryParams
		? `${uri}?${queryParams}`
		: uri
};

const pushStateIsAvailable = typeof window !== 'undefined'
	&& window.history
	&& window.history.pushState;

const replaceStateIsAvailable = typeof window !== 'undefined'
	&& window.history
	&& window.history.replaceState;

const replaceState = (state, newUri) => {
	window.history.replaceState(state, null, newUri);
};

const pushState = (state, newUri) => {
	window.history.pushState(state, null, newUri);
};

class RouterView {
	constructor(router) {
		this.hasRouteListener = false;
		this.router = router;
		this.element = document.createElement('div');
		this.element.setAttribute('data-router-link', true);
	}

	/**
	 * @description - Updates the view inside element with a new page component
	 */
	update() {
		this.router.routes.forEach(route => {
			if (route.pathname === this.router.currentUri) {
				this.element.innerHTML = route.render();
			}
		});

		// Listen for router links on the page if the router isn't listening yet
		if (!this.hasRouteListener) {
			this.element.addEventListener('click', event => {
				const { target } = event;
				const isRouterLink = target.getAttribute('data-router-link') !== null;

				if (isRouterLink) {
					event.preventDefault();

					/*
						TODO:
						This maybe has to be refactored as it's not really 'seperation
						of concerns'. Now the router view is dependent on a push method
						on the router
					*/
					this.router.push(target.hash);
				}
			});

			this.hasRouteListener = true;
		}
	}
}

class Router {
	constructor(...routes) {
		this.hasRouteListener = false;
		this.currentUri = window.location.hash;
		this.routes = routes;
		this.view = new RouterView(this);

		if (!pushStateIsAvailable || !replaceStateIsAvailable) {
			throw new Error('Push state is not available here, router will not work as expected...')
		}

		/*
			If there's no hash present, then replace / with #home
		*/
		if (!this.currentUri) {
			this.replace('#home');
		}

		this.replace(this.currentUri);

		/*
			Update the routerView when an `onpopstate` event fires (usually
			happens when the user clicks browser buttons).
		*/
		window.onpopstate = event => {
			this.currentUri = event.state
				? event.state.page
				: this.currentUri;

			this.view.update(this.currentUri);
		};
	}

	/**
	 * @description - Pushes a new entry to the users' history
	 * @param {string} uri - The hash to push to
	 * @param {string} queryParams - queryParams to add to the hash
	 * @example - Router.push('#home', '?js-enabled=true)
	 */
	push(uri, queryParams) {
		this.currentUri = getCorrectedUri(uri, queryParams);

		pushState({ page: this.currentUri }, this.currentUri);

		this.view.update(this.currentUri);
	}

	/**
	 * @description - Replaces the current hash
	 * @param {string} uri - The uri to replace the hash with
	 * @param {string} queryParams - queryParams to add to the hash
	 * @example - Router.replace('#home', '?my-query=awesome')
	 */
	replace(uri, queryParams) {
		this.currentUri = getCorrectedUri(uri, queryParams);

		replaceState({ page: this.currentUri }, this.currentUri);

		this.view.update(this.currentUri);
	}
}

class EventDispatcher {
	constructor() {
		this.events = {};
	}

	subscribe(eventName, callback) {
		/*
			Explicitly set the this context because we use our EventDispatcher
			inside the store which has another this context
		*/
		const self = this;

		/*
			One event is equal to an array of callbacks that have to be fired.

			If the event name is not known yet we set the value of that event to
			an empty array so we can push the callback without having to do any
			typechecking.
		*/
		if (!self.events.eventName) {
			self.events[eventName] = [];
		}

		/*
			We can now safely push the callback to the events from
			our dispatcher
		*/
		self.events[eventName].push(callback);
	}

	dispatch(eventName, payload = {}) {
		const self = this;

		if (!self.events[eventName]) {
			throw new ReferenceError(`Event with name: ${eventName} is not present in store. Are you sure you've subscribed something to that event?`)
		}

		/*
			Fire off a callback for every subscriber that's subscribed
			to the eventName
		*/
		self.events[eventName].map(callback => callback(payload));
	}
}

class Store {
	constructor({ initialState, mutations }) {
		/*
			Explicitly set the this context to the store since we're using our
			dispatcher which has another this context.
		*/
		const self = this;

		self.mutations = mutations || {};
		self.events = new EventDispatcher;

		self.state = new Proxy(initialState || {}, {
			set(state, key, newValue) {
				// Just set the value as you would do with an object
				state[key] = newValue;

				// Let all subscribed components know that state has changed
				self.events.dispatch('stateChange', self.state);

				return true
			}
		});
	}

	commit(mutationKey, payload) {
		const self = this;

		const isValidMutation = self.mutations[mutationKey] &&
			typeof self.mutations[mutationKey] === 'function';

		if (!isValidMutation) {
			throw new Error(`Mutation ${mutationKey} does not exist.`)
		}

		const updatedState = self.mutations[mutationKey](self.state, payload);

		self.state = {
			...this.state,
			...updatedState
		};
	}
}

const setData = (state, payload) => {
	state.launches = payload.launches;

	return state
};

var mutations = /*#__PURE__*/Object.freeze({
	__proto__: null,
	setData: setData
});

const initialState = {
	items: []
};

var Store$1 = new Store({
	initialState,
	mutations
});

class Component {
	constructor(props) {
		this.props = props;

		if (!this.render) {
			throw new Error('Component needs a render function')
		}

		if (props && props.store instanceof Store) {
			props.store.events.subscribe('stateChange', () => this.render());
		}
	}
}

class RouterLink extends Component {
	maybeAddClasses() {
		return this.props.options && this.props.options.classNames
			? `class="${this.options.classNames.join(' ')}"`
			: ''
	}

	render() {
		return `
			<a
				${this.maybeAddClasses()}
				href="#${this.props.to}"
				data-router-link
			>
				${this.props.text}
			</a>
		`
	}
}

class Home extends Component {
	constructor() {
		super({ store: Store$1 });
	}

	renderLaunches(launches) {
		if (!launches) return 'Loading launches...'

		return launches.map(launch => {
			return `
				<h2>${launch.flight_number}</h2>
			`
		})
	}

	render() {
		return `
			<main>
				<h1>Home page</h1>
				${console.log(this.props.store.state)}
				${new RouterLink({ to: 'detail', text: 'Detail page' }).render()}
			</main>
		`
	}
}

var Home$1 = new Home;

class Detail extends Component {
	render() {
		return `
			<main>
				<h1>Detail page</h1>
				${new RouterLink({ to: 'home' , text: 'To homepage'}).render()}
			</main>
		`
	}
}

var Detail$1 = new Detail;

const SET_DATA = 'setData';

class App {
	constructor({ target }) {
		this.router = new Router(
			new Route('home', Home$1),
			new Route('detail', Detail$1)
		);
		this.target = document.querySelector(target);
		this.element = this.router.view.element,
		this.store = Store$1;
	}

	async init() {
		if (window.Worker) {
			const Api = wrap(new Worker('js/api-worker.js'));
			const apiInstance = await new Api;

			apiInstance.getLaunches()
				.then(launches => {
					this.store.commit(SET_DATA, { launches });
				});
		}

		this.target.appendChild(this.element);
	}
}

new App({
	target: '#app'
}).init();
