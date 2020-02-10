(function () {
	'use strict';

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

	class RouterLink {
		constructor(to, text, options) {
			this.to = to;
			this.text = text;
			this.options = options || {};
		}

		maybeAddClasses() {
			return this.options.classNames
				? `class="${this.options.classNames.join(' ')}"`
				: ''
		}

		render() {
			return `
			<a
				${this.maybeAddClasses()}
				href="#${this.to}"
				data-router-link
			>
				${this.text}
			</a>
		`
		}
	}

	class Home {
		render() {
			return `
			<main>
				<h1>Home page</h1>
				${new RouterLink('detail', 'To detail page').render()}
			</main>
		`
		}
	}

	var Home$1 = new Home;

	class Detail {
		render() {
			return `
			<main>
				<h1>Detail page</h1>
				${new RouterLink('home', 'Back to home page').render()}
			</main>
		`
		}
	}

	var Detail$1 = new Detail;

	class App {
		constructor({ target }) {
			this.router = new Router(
				new Route('home', Home$1),
				new Route('detail', Detail$1)
			);
			this.target = document.querySelector(target);
			this.element = this.router.view.element;
			this.endpoint = 'https://api.spacexdata.com/v3/launches';
		}

		init() {
			this.target.appendChild(this.element);
		}
	}

	new App({
		target: '#app'
	}).init();

}());
