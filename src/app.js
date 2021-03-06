import Route from './router/Route'
import Router from './router'

import Home from './pages/Home'
import Detail from './pages/Detail'

import Store from './store'

export default class App {
	constructor({ target }) {
		this.router = new Router(
			new Route('/home', Home),
			new Route('/detail', Detail)
		)
		this.target = document.querySelector(target)
	}

	async init() {
		this.target.appendChild(this.router.routerElement)
	}
}
