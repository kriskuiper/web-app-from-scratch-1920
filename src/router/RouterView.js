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
	}
}
