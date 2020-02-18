import Component from './Component'
import parseRoute from './parse-route'

export default class Page extends Component {
	constructor(props) {
		super({
			route: parseRoute(window.location.hash),
			...props
		})

		this.route = props.route ? props.route : ''

		if (this.route) {
			const { events } = props.store

			events.subscribe('routeChange', (payload) => {
				this.route = payload.route
			})
		}
	}
}
