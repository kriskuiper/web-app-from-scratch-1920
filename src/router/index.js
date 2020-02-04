const pushStateIsAvailable = typeof window !== 'undefined' && window.history && window.history.pushState
const replaceStateIsAvailable = typeof window !== 'undefined' && window.history && window.history.replaceState

export class Router {
	constructor(...routes) {
		this.hasRouteListener = false
		this.currentUri = window.location.hash
		this.routes = routes
		this.routerElement = document.createElement('div')

		this.routerElement.setAttribute('data-router-view', true)

		if (!this.currentUri) {
			this.push('#home')
		}

		this.updateRouterView()

		window.onpopstate = (event) => {
			/*
				When the `onpopstate` events equals to null it means that we're on the
				first route, however, the user has to click browser back one more time
				to go back to the previous page.
			*/

			this.currentUri = event.state
				? event.state.page
				: this.currentUri

			this.updateRouterView()
		}
	}

	push(uri, queryParams) {
		if (pushStateIsAvailable) {
			this.currentUri = uri

			const correctedUri = queryParams ? `${this.currentUri}?${queryParams}` : this.currentUri

			window.history.pushState({ page: correctedUri }, null, correctedUri)
			this.pagesViewed += 1

			this.updateRouterView()
		}
	}

	replace(uri, queryParams) {
		if (replaceStateIsAvailable) {
			this.currentUri = uri

			const correctedUri = queryParams ? `${this.currentUri}?${queryParams}` : this.currentUri

			return window.history.replaceState({ page: correctedUri }, null, correctedUri)
		}
	}

	updateRouterView() {
		this.routes.forEach(route => {
			if (route.pathname === this.currentUri) {
				this.routerElement.innerHTML = route.render()
			}
		})

		// Listen for router links on the page
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
	constructor(to, text) {
		this.to = to
		this.text = text
	}

	render() {
		return `
			<a href="#${this.to}" data-router-link>${this.text}</a>
		`
	}
}
