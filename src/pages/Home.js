import redom from 'redom'

import store from '../store'
import useApi from '../lib/use-api'

import Page from '../lib/Page'
import LaunchList from '../components/LaunchList'

class Home extends Page {
	constructor() {
		super({
			element: 'main.page',
			store
		})

		const FIRST_PAGE = 1

		this.pageNumber = this.route.query && this.route.query.pageNumber
			|| FIRST_PAGE
		this.isLoading = false

		this.nextPageButton = redom.el('button.next-page-button', {
			textContent: 'Load more'
		})

		this.nextPageButton.onclick = async () => {
			await this.loadNextPage()
		}
	}

	async getLaunches(pageNumber) {
			const Api = await useApi()
			const launches = await Api.getLaunches(pageNumber)

			return launches
	}

	async loadNextPage() {
		try {
			this.pageNumber = this.pageNumber + 1

			this.nextPageButton.textContent = 'Loading...'
			this.nextPageButton.setAttribute('disabled', 'disabled')

			const PAGE_SIZE = 20
			const launches = await this.getLaunches(this.pageNumber)
			const newLaunches = [...store.state.launches, ...launches]

			store.dispatch('setData', { launches: newLaunches })

			if (launches.length < PAGE_SIZE) {
				redom.unmount(
					this.element,
					this.nextPageButton
				)
			}
		}

		catch(error) {
			console.log(error)
		}

		finally {
			this.nextPageButton.textContent = 'Load more'
			this.nextPageButton.removeAttribute('disabled')
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
				new LaunchList().render()
			)

			redom.mount(
				this.element,
				this.nextPageButton
			)
		}

		return this.element
	}
}

export default new Home
