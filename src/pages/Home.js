import RouterLink from '../router/RouterLink'

class Home {
	render() {
		return `
			<main>
				<h1>Home page</h1>
				${new RouterLink('detail', 'To detail page').render()}
			</main>
		`
	}
}

export default new Home
