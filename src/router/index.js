import getCorrectedUri from './lib/get-corrected-uri'
import {
	pushStateIsAvailable,
	replaceStateIsAvailable,
	pushState,
	replaceState
} from './lib/history-helpers'
import RouterView from './RouterView'

export default class Router {
	constructor(...routes) {
		this.hasRouteListener = false
		this.currentUri = window.location.hash
		this.routes = routes
		this.view = new RouterView(this)

		if (!pushStateIsAvailable || !replaceStateIsAvailable) {
			throw new Error('Push state is not available here, router will not work as expected...')
		}

		/*
			If there's no hash present, then replace / with #home
		*/
		if (!this.currentUri) {
			this.replace('#home')
		}

		this.replace(this.currentUri)

		/*
			Update the routerView when an `onpopstate` event fires (usually
			happens when the user clicks browser buttons).
		*/
		window.onpopstate = event => {
			this.currentUri = event.state
				? event.state.page
				: this.currentUri

			this.view.update(this.currentUri)
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

		this.view.update(this.currentUri)
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

		this.view.update(this.currentUri)
	}
}
