import redom from 'redom'

import Component from '../lib/Component'

import store from '../store'
import clearChildren from '../lib/clear-children'

export default class Details extends Component {
	constructor(props) {
		super({
			element: 'div',
			store,
			...props
		})
	}

	render() {
		redom.mount(
			this.element,
			redom.el('h3', {
				textContent: 'Loading launch data...'
			})
		)

		return this.element
	}

	update(state) {
		clearChildren(this.element)

		const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/'

		redom.mount(
			this.element,
			redom.el('article.detail-page',
				redom.el('header.detail-page__header',
					redom.el('h2.detail-page__title', { textContent: state.launch.mission_name }),
					redom.el('p.detail-page__rocket', { textContent: `Rocket: ${state.launch.rocket.rocket_name}` })
				),

				redom.el('h3.detail-page__title', { textContent: 'Description:' }),
				redom.el('p', { textContent: state.launch.details }),

				redom.el('h3.detail-page__title', { textContent: 'Video:' }),
				redom.el('div.detail-page__video',
					redom.el('div.fixed-ratio.fixed-ratio-1by1',
						redom.el('iframe.fixed-ratio-content', {
							src: `${YOUTUBE_EMBED_URL}${state.launch.links.youtube_id}`,
							width: '100%',
							allowfullscreen: ''
						})
					),
				)
			)
		)
	}
}
