import * as Comlink from 'https://unpkg.com/comlink@alpha/dist/esm/comlink.mjs'

import Route from './router/Route'
import Router from './router'

import Home from './pages/Home'
import Detail from './pages/Detail'

import Store from './store'
import { SET_DATA } from './store/mutation-keys'

export default class App {
	constructor({ target }) {
		this.router = new Router(
			new Route('/home', Home),
			new Route('/detail', Detail)
		)
		this.target = document.querySelector(target)
		this.element = this.router.view.element,
		this.store = Store
	}

	async init() {
		if (window.Worker) {
			const apiWorker = Comlink.wrap(new Worker('js/api-worker.js'))
			const Api = await new apiWorker

			Api.getLaunches()
				.then(launches => {
					this.store.commit(SET_DATA, { launches })
				})
		}

		this.target.appendChild(this.element)
	}
}
