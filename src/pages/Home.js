import redom from 'redom'

import Component from '../lib/Component'
import RouterLink from '../router/RouterLink'
import LaunchList from '../components/LaunchList'

class Home extends Component {
	constructor() {
		super({
			element: 'main'
		})
	}

	render() {
		if (!this.element.firstElementChild) {
			redom.mount(
				this.element,
				redom.el('h1', { textContent: 'Homepage' })
			)

			redom.mount(
				this.element,
				new RouterLink({ to: 'detail', text: 'Go to detail' }).render()
			)

			redom.mount(
				this.element,
				new LaunchList().render()
			)
		}

		return this.element
	}
}

export default new Home
