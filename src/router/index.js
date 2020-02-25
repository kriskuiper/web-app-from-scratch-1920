import redom from 'redom'

import store from '../store'
import ErrorPage from '../pages/Error'

import replaceState from './lib/replace-state'
import parseRoute from '../lib/parse-route'

export default class Router {
	constructor(...routes) {
		this.hasRouteListener = false
		this.currentRoute = parseRoute(window.location.hash)
		this.routes = routes

		// Initialize router Element
		this.routerElement = redom.el('div')
		redom.setAttr(this.routerElement, {
			'data-router-view': true
		})

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

		store.events.dispatch('routeChange', {
			route: parseRoute(uri)
		})

		this.updateView()
	}

	updateView() {
		let routeSuccess = false

		this.routes.forEach(route => {
			if (route.pathname === this.currentRoute.pathname) {
				// Replace existing page with new page
				if (this.routerElement.firstElementChild) {
					redom.unmount(
						this.routerElement,
						this.routerElement.firstElementChild
					)
				}

				redom.mount(
					this.routerElement,
					route.component.render()
				)

				routeSuccess = true
			}
		})

		if (!routeSuccess) {
			if (this.routerElement.firstElementChild) {
				redom.unmount(
					this.routerElement,
					this.routerElement.firstElementChild
				)
			}

			redom.mount(
				this.routerElement,
				new ErrorPage('Oops, this page does not exist 😭').render()
			)
		}
	}
}
