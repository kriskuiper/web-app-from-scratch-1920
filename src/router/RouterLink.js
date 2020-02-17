import redom from 'redom'

import Component from '../lib/Component'

export default class RouterLink extends Component {
	constructor(props) {
		super({
			element: 'a',
			to: `#${props.to}`,
			text: props.text
		})
	}

	render() {
		redom.setAttr(
			this.element,
			{
				href: this.props.to,
				'data-router-link': '',
				textContent: this.props.text
			}
		)

		return this.element
	}
}
