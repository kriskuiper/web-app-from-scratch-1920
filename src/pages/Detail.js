import Component from '../lib/Component'
import RouterLink from '../router/RouterLink'

class Detail extends Component {
	render() {
		return `
			<main>
				<h1>Detail page</h1>
				${new RouterLink({ to: 'home' , text: 'To homepage'}).render()}
			</main>
		`
	}
}

export default new Detail
