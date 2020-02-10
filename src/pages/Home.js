import store from '../store'
import Component from '../lib/Component'
import RouterLink from '../router/RouterLink'

class Home extends Component {
	constructor() {
		super({ store })
	}

	render() {
		return `
			<main>
				<h1>Home page</h1>
				${new RouterLink({ to: 'detail', text: 'Detail page' }).render()}
			</main>
		`
	}
}

export default new Home
