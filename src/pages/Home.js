import redom from 'redom'

import store from '../store'
import useData from '../composables/use-data'
import useLocalStorage from '../composables/use-local-storage'
import { PAGE_SIZE, LAUNCH_DATA_NAME } from '../lib/constants'

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
		this.hasError = false

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

				// Also put the latest launches in localStorage. If the API fails on
				// us we can use the localStorage data. Fail silently.
				useLocalStorage.set(LAUNCH_DATA_NAME, launches)
					.catch(() => null)
			})
			.catch(error => {
				console.error('Failed to load data: ', error)

				redom.mount(
					this.element,
					redom.el('h1', { textContent: 'Whoops, we could not load data' })
				)

				// TODO: refactor this in the future, this is a bit all over the place
				// if we have to do more error handling elsewhere.
				this.hasError = true
			})

		if (!this.element.firstElementChild && !this.hasError) {
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
