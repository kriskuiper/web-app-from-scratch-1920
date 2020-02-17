import redom from 'redom'

import store from '../store'
import clearChildren from '../lib/clear-children'
import Component from '../lib/Component'
import LaunchItem from './LaunchItem'

export default class LaunchList extends Component {
	constructor(props) {
		super({
			element: 'div.launch-list',
			store,
			...props
		})
	}

	render() {
		redom.mount(
			this.element,
				redom.el('h2', {
					textContent: 'Loading launches...'
				}))

		return this.element
	}

	update(state) {
		clearChildren(this.element)

		state.launches.forEach(launch => {
			redom.mount(
				this.element,
					new LaunchItem(launch).render()
			)
		})
	}
}
