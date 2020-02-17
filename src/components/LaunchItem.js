import redom from 'redom'

import Component from '../lib/Component'
import RouterLink from '../router/RouterLink'
import formatDate from '../lib/format-date'

const maybeSetDataSuccess = successState => {
	return successState
		? 'data-success'
		: ''
}

const getIcon = successState => {
	const baseUrl = '/assets/icons/'
	const iconName = successState ? 'check.svg' : 'warning.svg'

	return `${baseUrl}${iconName}`
}

export default class LaunchItem extends Component {
	constructor(props) {
		super({
			element: 'article.launch-item',
			...props
		})

		this.name = props.mission_name
		this.launchSite = props.launch_site.site_name_long
		this.isSuccess = props.launch_success
		this.rocketName = props.rocket.rocket_name
		this.launchDate = props.launch_date_utc
		this.imageSrcSet = [
			`${props.links.mission_patch_small} 400w`,
			`${props.links.mission_patch} 800w`
		].join(', ')
		this.fallbackImage = props.links.mission_patch
		this.imageSizes = [
			// TODO: add image sizes
		]
	}

	render() {
		this.element =
			redom.el('article.launch-item',
				redom.el('header.launch-item__header',
					redom.el('img.launch-item__icon', { src: getIcon(this.isSuccess) }),
					redom.el('div',
						redom.el('h3', { textContent: this.name }),
						redom.el('p', { textContent: `Launched: ${formatDate(this.launchDate)}` })
					)
				),
				redom.el('picture.fixed-ratio.fixed-ratio-1by1',
					redom.el('img.launch-item__image.fixed-ratio-content', {
						src: this.fallbackImage,
						srcSet: this.imageSrcSet,
						sizes: this.imageSizes,
						alt: `${this.name} mission logo`
					})
				),
				redom.el('div.launch-item__details',
					redom.el('ul.unstyled-list',
						redom.el('li', { textContent: `Rocket: ${this.rocketName}` }),
						redom.el('li', { textContent: `Launch site: ${this.launchSite}` })
					)
				)
			)

			redom.mount(
				this.element,
				new RouterLink({ to: 'detail', text: 'See details' }).render()
			)

		return this.element
	}
}
