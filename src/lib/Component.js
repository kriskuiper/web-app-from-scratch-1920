import Store from '../store/Store'

export default class Component {
	constructor(props) {
		this.props = props

		if (!this.render) {
			throw new Error('Component needs a render function')
		}

		if (props && props.store instanceof Store) {
			props.store.events.subscribe('stateChange', () => this.render())
		}
	}
}
