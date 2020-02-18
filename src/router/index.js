import store from '../store'
import getCorrectedUri from './lib/get-corrected-uri'
import replaceState from './lib/replace-state'

import RouterView from './RouterView'
import parseRoute from '../lib/parse-route'

export default class Router {
	constructor(...routes) {
		this.hasRouteListener = false
		this.currentRoute = parseRoute(window.location.hash)
		this.routes = routes
		this.view = new RouterView(this)

		/*
			If there's no hash present, then replace / with #/home
		*/

		if (this.currentRoute.pathname === '/') {
			this.replace('#/home')
		}

		this.replace(window.location.hash)

		/*
			Update the routerView when an `onpopstate` event fires (usually
			happens when the user clicks browser buttons).
		*/
		window.onhashchange = () => {
			this.replace(window.location.hash)

			// Let the pages know the route has changed
			store.events.dispatch('routeChange', {
				route: parseRoute(window.location.hash)
			})
		}
	}

	/**
	 * @description - Replaces the current hash
	 * @param {string} uri - The uri to replace the hash with
	 * @param {string} queryParams - queryParams to add to the hash
	 * @example - Router.replace('#home', '?my-query=awesome')
	 */
	replace(uri) {
		this.currentRoute = parseRoute(uri)

		replaceState(uri)

		this.view.update()
	}
}
