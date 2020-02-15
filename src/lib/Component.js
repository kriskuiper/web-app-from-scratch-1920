import Store from '../store/Store'

/*
 * Every component should have:
 * el: el(tag)
 * update method: update(data) {} // what to do with updated data etc.
 * render method: on initial render
 *
 * call update on state change with store.state as param
*/



export default class Component {
	constructor(props) {
		this.props = props

		if (!this.render) {
			throw new Error('Component needs a render function')
		}

		if (props && props.store instanceof Store) {
			props.store.events.subscribe('stateChange', () => this.render())
		}
	}
}
