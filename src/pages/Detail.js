import RouterLink from '../router/RouterLink'

class Detail {
	render() {
		return `
			<main>
				<h1>Detail page</h1>
				${new RouterLink('home', 'Back to home page').render()}
			</main>
		`
	}
}

export default new Detail
