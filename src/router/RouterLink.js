import Component from '../lib/Component'

export default class RouterLink extends Component {
	maybeAddClasses() {
		return this.props.options && this.props.options.classNames
			? `class="${this.options.classNames.join(' ')}"`
			: ''
	}

	render() {
		return `
			<a
				${this.maybeAddClasses()}
				href="#${this.props.to}"
				data-router-link
			>
				${this.props.text}
			</a>
		`
	}
}
