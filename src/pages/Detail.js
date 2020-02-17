import redom from 'redom'

import Component from '../lib/Component'
import RouterLink from '../router/RouterLink'

class Detail extends Component {
	constructor() {
		super({
			element: 'main'
		})
	}

	render() {
		if (!this.element.firstChild) {
			redom.mount(
				this.element,
				redom.el('h1', { textContent: 'Detail page' })
			)

			redom.mount(
				this.element,
				new RouterLink({ to: 'home', text: 'Go to home' }).render()
			)
		}

		return this.element
	}
}

export default new Detail
