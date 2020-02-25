import redom from 'redom'
import dayjs from 'dayjs'

import Component from '../lib/Component'
import RouterLink from '../router/RouterLink'
import formatDate from '../lib/format-date'

const getIcon = successState => {
	const baseUrl = '/assets/icons/'
	const iconName = successState ? 'check.svg' : 'warning.svg'

	return `${baseUrl}${iconName}`
}

const launchPrefix = launchDate => {
	return dayjs(launchDate).isBefore(dayjs())
		? 'Launched:'
		: 'Will launch:'
}

export default class LaunchItem extends Component {
	constructor(props) {
		super({
			element: 'article.launch-item',
			...props
		})

		const notFoundImage = 'https://via.placeholder.com/300.webp/333/fff?text=image not found :('

		this.name = props.mission_name
		this.launchSite = props.launch_site.site_name_long
		this.isSuccess = props.launch_success
		this.rocketName = props.rocket.rocket_name
		this.launchDate = props.launch_date_utc
		this.imageSrcSet = [
			`${props.links.mission_patch_small} 400w`,
			`${props.links.mission_patch} 800w`
		].join(', ')
		this.fallbackImage = props.links.mission_patch || notFoundImage
		this.imageSizes = [
			'(min-width: 800px) 33vw',
			'(min-width: 400px) 50vw',
			'100vw'
		].join(', ')
		this.flightNumber = props.flight_number

		this.image = redom.el('img.launch-item__image.fixed-ratio-content', {
			src: this.fallbackImage,
			alt: `${this.name} mission logo`
		})
	}

	addSizesToImageIfExists() {
		const hasMissionPatch = Boolean(this.props.links.mission_patch)

		if (hasMissionPatch) {
			this.image.setAttribute('srcSet', this.imageSrcSet)
			this.image.setAttribute('sizes', this.imageSizes)
		}
	}

	render() {
		this.element =
			redom.el('article.launch-item',
				redom.el('header.launch-item__header',
					redom.el('img.launch-item__icon', { src: getIcon(this.isSuccess) }),
					redom.el('div',
						redom.el('h3', { textContent: this.name }),
						redom.el('p', { textContent: `${launchPrefix(this.launchDate)} ${formatDate(this.launchDate)}` })
					)
				),
				redom.el('picture.fixed-ratio.fixed-ratio-1by1',
					this.image
				),
				redom.el('div.launch-item__details',
					redom.el('ul.unstyled-list',
						redom.el('li', { textContent: `Rocket: ${this.rocketName}` }),
						redom.el('li', { textContent: `Launch site: ${this.launchSite}` })
					)
				)
			)

			this.addSizesToImageIfExists()

			redom.mount(
				this.element,
				new RouterLink({ to: `/detail/${this.flightNumber}`, text: 'See details' }).render()
			)

		return this.element
	}
}
