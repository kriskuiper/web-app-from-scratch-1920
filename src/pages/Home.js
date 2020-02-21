import * as Comlink from 'https://unpkg.com/comlink@alpha/dist/esm/comlink.mjs'
import redom from 'redom'

import store from '../store'

import Page from '../lib/Page'
import RouterLink from '../router/RouterLink'
import LaunchList from '../components/LaunchList'

class Home extends Page {
	constructor() {
		super({
			element: 'main',
			store
		})
	}

	async getLaunches() {
		if (window.Worker) {
			const apiWorker = Comlink.wrap(new Worker('js/api-worker.js'))
			const Api = await new apiWorker

			const launches = await Api.getLaunches()

			return launches
		}
	}

	render() {
		this.getLaunches()
			.then(launches => {
				store.dispatch('setData', { launches })
			})
			.catch(console.error)

		if (!this.element.firstElementChild) {
			redom.mount(
				this.element,
				redom.el('h1', { textContent: 'Homepage' })
			)

			redom.mount(
				this.element,
				new RouterLink({ to: '/detail', text: 'Go to detail' }).render()
			)

			redom.mount(
				this.element,
				new LaunchList().render()
			)
		}

		return this.element
	}
}

export default new Home
