import Component from '../lib/Component'
import LaunchItem from './LaunchItem'

export default class LaunchList extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return `
			<div class="launch-list">
				${this.props.items
					.map(item => {
						return new LaunchItem(item).render()
					})
					.join('')}
			</div>
		`
	}
}
