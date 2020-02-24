import redom from 'redom'

import Page from '../lib/Page'
import RouterLink from '../router/RouterLink'

export default class Error extends Page {
	constructor(errorMessage) {
		super({
			element: 'main'
		})

		this.errorMessage = errorMessage
	}

	render() {
		redom.mount(
			this.element,
			redom.el('h1', { textContent: this.errorMessage })
		)

		redom.mount(
			this.element,
			new RouterLink({ to: '/home', text: 'Back to homepage' }).render()
		)

		return this.element
	}
}
