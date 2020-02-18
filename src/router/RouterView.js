import redom from 'redom'

export default class RouterView {
	constructor(router) {
		this.hasRouteListener = false
		this.router = router
		this.element = redom.el('div')

		redom.setAttr(this.element, {
			'data-router-view': true
		})
	}

	/**
	 * @description - Updates the view inside element with a new page component
	 */
	update() {
		this.router.routes.forEach(route => {
			if (route.pathname === this.router.currentUri) {

				// Replace existing page with new page
				if (this.element.firstElementChild) {
					redom.unmount(
						this.element,
						this.element.firstElementChild
					)
				}

				redom.mount(
					this.element,
					route.component.render()
				)
			}
		})

		// Listen for router links on the page if the router isn't listening yet
		if (!this.hasRouteListener) {
			this.element.addEventListener('click', event => {
				const { target } = event
				const isRouterLink = target.getAttribute('data-router-link') !== null

				if (isRouterLink) {
					event.preventDefault()

					/*
						TODO:
						This maybe has to be refactored as it's not really 'seperation
						of concerns'. Now the router view is dependent on a push method
						on the router
					*/
					this.router.push(target.hash)
				}
			})

			this.hasRouteListener = true
		}
	}
}
