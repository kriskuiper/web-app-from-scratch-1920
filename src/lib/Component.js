import redom from 'redom'

import parseRoute from '../lib/parse-route'
import Store from '../store/Store'

export default class Component {
	constructor(props) {
		this.props = props

		if (!this.render) {
			throw new Error('Component needs a render function')
		}

		if (props && props.element) {
			this.element = redom.el(props.element)
		}

		if (props && props.store instanceof Store) {
			props.store.events.subscribe('stateChange', newState => this.update(newState))
		}
	}
}
