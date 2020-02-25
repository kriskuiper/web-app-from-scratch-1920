import redom from 'redom'

import store from '../store'
import useData from '../composables/use-data'
import useLocalStorage from '../composables/use-local-storage'
import { PAGE_SIZE } from '../lib/constants'

import Page from '../lib/Page'
import LaunchList from '../components/LaunchList'

class Home extends Page {
	constructor() {
		super({
			element: 'main.page',
			store
		})

		this.pageNumber = 1
		this.isLoading = false

		this.nextPageButton = redom.el('button.next-page-button', {
			textContent: 'Load more'
		})

		this.nextPageButton.onclick = async () => {
			await this.loadNextPage()
		}
	}

	async loadNextPage() {
		try {
			this.pageNumber = this.pageNumber + 1

			this.nextPageButton.textContent = 'Loading...'
			this.nextPageButton.setAttribute('disabled', 'disabled')

			const launches = await useData({ page: this.pageNumber })
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
		useData({ page: this.pageNumber })
			.then(launches => {
				store.dispatch('setData', { launches })
				useLocalStorage.set('data', launches)
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
