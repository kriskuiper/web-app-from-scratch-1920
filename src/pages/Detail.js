import * as Comlink from 'https://unpkg.com/comlink@alpha/dist/esm/comlink.mjs'
import redom from 'redom'

import store from '../store'

import Page from '../lib/Page'
import RouterLink from '../router/RouterLink'
import Details from '../components/Details'

class Detail extends Page {
	constructor() {
		super({
			element: 'main'
		})
	}

	async getSpecificLaunch(flightNumber) {
		const apiWorker = Comlink.wrap(new Worker('js/api-worker.js'))
		const Api = await new apiWorker

		const launchData = await Api.getSpecificLaunch(flightNumber)

		return launchData
	}

	render() {
		if (this.route.params) {
			this.getSpecificLaunch(this.route.params)
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
				new RouterLink({ to: '/home', text: 'Go to home' }).render()
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
