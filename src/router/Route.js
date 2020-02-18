export default class Route {
	constructor(pathname, component) {
		this.pathname = pathname
		this.component = component
	}

	render() {
		return this.component.render()
	}
}
