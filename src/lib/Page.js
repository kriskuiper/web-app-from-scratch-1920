import store from '../store'

import Component from './Component'
import parseRoute from './parse-route'

export default class Page extends Component {
	constructor(props) {
		super({
			route: parseRoute(window.location.hash),
			store,
			...props
		})

		this.route = props.route || ''

		this.props.store.events.subscribe('routeChange', (payload) => {
			this.route = payload.route
		})
	}

	// TODO: fix this in a nicer way
	update() {}
}
