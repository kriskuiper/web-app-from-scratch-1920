export default class RouterLink {
	constructor(to, text, options) {
		this.to = to
		this.text = text
		this.options = options || {}
	}

	maybeAddClasses() {
		return this.options.classNames
			? `class="${this.options.classNames.join(' ')}"`
			: ''
	}

	render() {
		return `
			<a
				${this.maybeAddClasses()}
				href="#${this.to}"
				data-router-link
			>
				${this.text}
			</a>
		`
	}
}
