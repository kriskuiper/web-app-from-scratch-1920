import getCorrectedUri from './lib/get-corrected-uri'
import {
	pushStateIsAvailable,
	replaceStateIsAvailable,
	pushState,
	replaceState
} from './lib/history-helpers'

export class Router {
	constructor(...routes) {
		this.hasRouteListener = false
		this.currentUri = window.location.hash
		this.routes = routes
		this.routerElement = document.createElement('div')
		this.routerElement.setAttribute('data-router-view', true)

		if (!pushStateIsAvailable || !replaceStateIsAvailable) {
			throw new Error('Push state is not available here, router will not work as expected...')
		}

		/*
			If there's no hash present, then replace / with #home
		*/
		if (!this.currentUri) {
			this.replace('#home')
		}

		/*
			Update the routerView when an `onpopstate` event fires (usually
			happens when the user clicks browser buttons).
		*/
		window.onpopstate = event => {
			this.currentUri = event.state
				? event.state.page
				: this.currentUri

			this.updateView()
		}
	}

	/**
	 * @description - Pushes a new entry to the users' history
	 * @param {string} uri - The hash to push to
	 * @param {string} queryParams - queryParams to add to the hash
	 * @example - Router.push('#home', '?js-enabled=true)
	 */
	push(uri, queryParams) {
		this.currentUri = getCorrectedUri(uri, queryParams)

		pushState({ page: this.currentUri }, this.currentUri)

		this.updateView()
	}

	/**
	 * @description - Replaces the current hash
	 * @param {string} uri - The uri to replace the hash with
	 * @param {string} queryParams - queryParams to add to the hash
	 * @example - Router.replace('#home', '?my-query=awesome')
	 */
	replace(uri, queryParams) {
		this.currentUri = getCorrectedUri(uri, queryParams)

		replaceState({ page: this.currentUri }, this.currentUri)

		this.updateView()
	}

	/**
	 * @description - Updates the view inside routerElement with a new page component
	 */
	updateView() {
		this.routes.forEach(route => {
			if (route.pathname === this.currentUri) {
				this.routerElement.innerHTML = route.render()
			}
		})

		// Listen for router links on the page if the router isn't listening yet
		if (!this.hasRouteListener) {
			this.routerElement.addEventListener('click', event => {
				const { target } = event
				const isRouterLink = target.getAttribute('data-router-link') !== null

				if (isRouterLink) {
					event.preventDefault()

					this.push(target.hash)
				}
			})

			this.hasRouteListener = true
		}
	}
}

export class Route {
	constructor(pathname, component) {
		this.pathname = `#${pathname}`
		this.component = component
	}

	render() {
		return this.component.render()
	}
}

export class RouterLink {
	constructor(to, text, options) {
		this.to = to
		this.text = text
		this.options = options || {}
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
