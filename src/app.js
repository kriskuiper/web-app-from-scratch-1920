import Route from './router/Route'
import Router from './router'

import Home from './pages/Home'
import Detail from './pages/Detail'

export default class App {
	constructor({ target }) {
		this.router = new Router(
			new Route('home', Home),
			new Route('detail', Detail)
		)
		this.target = document.querySelector(target)
		this.element = this.router.view.element
		this.endpoint = 'https://api.spacexdata.com/v3/launches'
	}

	init() {
		if (window.Worker) {
			const worker = new Worker('js/worker.js')

			worker.postMessage({ name: 'henk' })
		}

		this.target.appendChild(this.element)
	}
}
