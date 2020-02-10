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
		super(props)

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
		return `
			<article
				class="launch-item"
				${maybeSetDataSuccess(this.isSuccess)}
			>
				<header class="launch-item__header">
					<img
						class="launch-item__icon"
						src=${getIcon(this.isSuccess)}
					/>
					<div>
						<h3 class="launch-item__title">${this.name}</h3>
						<p class="launch-item__date">Launched: ${formatDate(this.launchDate)}</p>
					</div>
				</header>
				<div class="fixed-ratio fixed-ratio-1by1">
					<div class="fixed-ratio-content">
						<img
							class="launch-item__image"
							src="${this.fallbackImage}"
							srcset="${this.imageSrcSet}"
							sizes="${this.imageSizes}"
							alt="${this.name} mission logo"
						/>
					</div>
				</div>
				<div class="launch-item__details">
					<ul class="unstyled-list">
						<li>Rocket: ${this.rocketName}</li>
						<li>Launch site: ${this.launchSite}</li>
					</ul>
				</div>
				${new RouterLink('/detail', 'Details').render()}
			</article>
		`
	}
}
