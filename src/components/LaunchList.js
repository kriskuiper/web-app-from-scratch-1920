import LaunchItem from './LaunchItem'

export default class LaunchList {
	constructor(items) {
		this.items = items
	}

	render() {
		return `
			<div class="launch-list">
				${this.items
					.map(item => {
						return new LaunchItem(item).render()
					})
					.join('')}
			</div>
		`
	}
}
