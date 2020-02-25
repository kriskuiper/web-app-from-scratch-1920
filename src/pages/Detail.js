import * as Comlink from 'https://unpkg.com/comlink@alpha/dist/esm/comlink.mjs'
import redom from 'redom'

import store from '../store'
import useData from '../composables/use-data'

import Page from '../lib/Page'
import Details from '../components/Details'

class Detail extends Page {
	constructor() {
		super({
			element: 'main.page'
		})
	}

	render() {
		if (this.route.params) {
			useData({ flightNumber: this.route.params })
				.then(launch => {
					store.dispatch('setLaunch', { launch })
				})
				.catch(console.error)
		}

		if (!this.element.firstChild) {
			redom.mount(
				this.element,
				redom.el('h1', { textContent: 'Detail page' })
			)

			redom.mount(
				this.element,
				new Details().render()
			)
		}

		return this.element
	}
}

export default new Detail
