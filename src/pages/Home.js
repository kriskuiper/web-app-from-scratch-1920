import store from '../store'
import Component from '../lib/Component'
import RouterLink from '../router/RouterLink'

class Home extends Component {
	constructor() {
		super({ store })
	}

	renderLaunches(launches) {
		if (!launches) return 'Loading launches...'

		return launches.map(launch => {
			return `
				<h2>${launch.flight_number}</h2>
			`
		})
	}

	render() {
		return `
			<main>
				<h1>Home page</h1>
				${console.log(this.props.store.state)}
				${new RouterLink({ to: 'detail', text: 'Detail page' }).render()}
			</main>
		`
	}
}

export default new Home
