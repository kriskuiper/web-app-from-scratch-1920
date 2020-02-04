(function () {
	'use strict';

	const pushStateIsAvailable = typeof window !== 'undefined' && window.history && window.history.pushState;
	const replaceStateIsAvailable = typeof window !== 'undefined' && window.history && window.history.replaceState;

	class Router {
		constructor(...routes) {
			this.hasRouteListener = false;
			this.currentUri = window.location.hash;
			this.routes = routes;
			this.routerElement = document.createElement('div');

			this.routerElement.setAttribute('data-router-view', true);

			if (!this.currentUri) {
				this.push('#home');
			}

			this.updateRouterView();

			window.onpopstate = (event) => {
				/*
					When the `onpopstate` events equals to null it means that we're on the
					first route, however, the user has to click browser back one more time
					to go back to the previous page.
				*/

				this.currentUri = event.state
					? event.state.page
					: this.currentUri;

				this.updateRouterView();
			};
		}

		push(uri, queryParams) {
			if (pushStateIsAvailable) {
				this.currentUri = uri;

				const correctedUri = queryParams ? `${this.currentUri}?${queryParams}` : this.currentUri;

				window.history.pushState({ page: correctedUri }, null, correctedUri);

				this.updateRouterView();
			}
		}

		replace(uri, queryParams) {
			if (replaceStateIsAvailable) {
				this.currentUri = uri;

				const correctedUri = queryParams ? `${this.currentUri}?${queryParams}` : this.currentUri;

				return window.history.replaceState({ page: correctedUri }, null, correctedUri)
			}
		}

		updateRouterView() {
			this.routes.forEach(route => {
				if (route.pathname === this.currentUri) {
					this.routerElement.innerHTML = route.render();
				}
			});

			// Listen for router links on the page
			if (!this.hasRouteListener) {
				this.routerElement.addEventListener('click', event => {
					const { target } = event;
					const isRouterLink = target.getAttribute('data-router-link') !== null;

					if (isRouterLink) {
						event.preventDefault();

						this.push(target.hash);
					}
				});

				this.hasRouteListener = true;
			}
		}
	}

	class Route {
		constructor(pathname, component) {
			this.pathname = `#${pathname}`;
			this.component = component;
		}

		render() {
			return this.component.render()
		}
	}

	class RouterLink {
		constructor(to, text) {
			this.to = to;
			this.text = text;
		}

		render() {
			return `
			<a href="#${this.to}" data-router-link>${this.text}</a>
		`
		}
	}

	class Home {
		render() {
			return `
			<main>
				<h1>Home page</h1>
				${new RouterLink('detail', 'To detail page').render()}
			</main>
		`
		}
	}

	var Home$1 = new Home;

	class Detail {
		render() {
			return `
			<main>
				<h1>Detail page</h1>
				${new RouterLink('home', 'Back to home page').render()}
			</main>
		`
		}
	}

	var Detail$1 = new Detail;

	var formatDate = date => {
		const parsedDate = new Date(date);
		const day = maybePrefixWithZero(parsedDate.getDay());
		const month = maybePrefixWithZero(parsedDate.getDay());
		const year = parsedDate.getFullYear();

		return `${day}-${month}-${year}`
	};

	function maybePrefixWithZero(num) {
		return num < 10
			? `0${num}`
			: num
	}

	class LaunchItem {
		constructor({ mission_name, launch_site, launch_success, launch_date_utc, links, rocket }) {
			this.name = mission_name;
			this.launchSite = launch_site.site_name_long;
			this.isSuccess = launch_success;
			this.rocketName = rocket.rocket_name;
			this.launchDate = launch_date_utc;
			this.imageSrcSet = [
				`${links.mission_patch_small} 400w`,
				`${links.mission_patch} 800w`
			].join(', ');
			this.fallbackImage = links.mission_patch;
			this.imageSizes = [
				// TODO: add image sizes
			];
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

	function maybeSetDataSuccess(successState) {
		return successState ? 'data-success' : ''
	}

	function getIcon(successState) {
		const baseUrl = '/assets/icons/';
		const iconName = successState ? 'check.svg' : 'warning.svg';

		return `${baseUrl}${iconName}`
	}

	class LaunchList {
		constructor(items) {
			this.items = items;
		}

		render() {
			return `
			<div class="launch-list">
				${this.items
					.map(item => {
						return new LaunchItem(item).render()
					})
					.join('')}
			</div>
		`
		}
	}

	const endpoint = 'https://api.spacexdata.com/v3/launches';
	const router = new Router(
		new Route('home', Home$1),
		new Route('detail', Detail$1)
	);
	const { routerElement } = router;

	document.getElementById('app')
		.appendChild(routerElement);

	fetch(endpoint)
		.then(response => response.json())
		.then(launches => {
			renderData(launches, document.getElementById('app'));
		})
		.catch(console.error);

	function renderData(data, node) {
		console.log(data);

		node.insertAdjacentHTML('beforeend', new LaunchList(data).render());
	}

}());
