import { Router, Route } from './router'

import Home from './pages/Home'
import Detail from './pages/Detail'
import LaunchList from './components/LaunchList'

const endpoint = 'https://api.spacexdata.com/v3/launches'
const router = new Router(
	new Route('home', Home),
	new Route('detail', Detail)
)
const { routerElement } = router

const renderData = (data, node) => {
	console.log(data)

	node.insertAdjacentHTML('beforeend', new LaunchList(data).render())
}

document.getElementById('app')
	.appendChild(routerElement)

fetch(endpoint)
	.then(response => response.json())
	.then(launches => {
		renderData(launches, document.getElementById('app'))
	})
	.catch(console.error)
