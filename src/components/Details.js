import redom from 'redom'

import Component from '../lib/Component'

import store from '../store'
import clearChildren from '../lib/clear-children'

export default class Details extends Component {
	constructor(props) {
		super({
			element: 'div',
			store,
			...props
		})
	}

	render() {
		redom.mount(
			this.element,
			redom.el('h3', {
				textContent: 'henk'
			})
		)

		return this.element
	}

	update(state) {
		clearChildren(this.element)

		state.launch && redom.mount(
			this.element,
			redom.el('h4', { textContent: state.launch.mission_name })
		)
	}
}
