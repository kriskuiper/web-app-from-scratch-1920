(function () {
	'use strict';

	var getCorrectedUri = (uri, queryParams) => {
		return queryParams
			? `${uri}?${queryParams}`
			: uri
	};

	const pushStateIsAvailable = typeof window !== 'undefined'
		&& window.history
		&& window.history.pushState;

	const replaceStateIsAvailable = typeof window !== 'undefined'
		&& window.history
		&& window.history.replaceState;

	const replaceState = (state, newUri) => {
		window.history.replaceState(state, null, newUri);
	};

	const pushState = (state, newUri) => {
		window.history.pushState(state, null, newUri);
	};

	class Router {
		constructor(...routes) {
			this.hasRouteListener = false;
			this.currentUri = window.location.hash;
			this.routes = routes;
			this.routerElement = document.createElement('div');
			this.routerElement.setAttribute('data-router-view', true);

			if (!pushStateIsAvailable || !replaceStateIsAvailable) {
				throw new Error('Push state is not available here, router will not work as expected...')
			}

			/*
				If there's no hash present, then replace / with #home
			*/
			if (!this.currentUri) {
				this.replace('#home');
			}

			this.replace(this.currentUri);

			/*
				Update the routerView when an `onpopstate` event fires (usually
				happens when the user clicks browser buttons).
			*/
			window.onpopstate = event => {
				this.currentUri = event.state
					? event.state.page
					: this.currentUri;

				this.updateView();
			};
		}

		/**
		 * @description - Pushes a new entry to the users' history
		 * @param {string} uri - The hash to push to
		 * @param {string} queryParams - queryParams to add to the hash
		 * @example - Router.push('#home', '?js-enabled=true)
		 */
		push(uri, queryParams) {
			this.currentUri = getCorrectedUri(uri, queryParams);

			pushState({ page: this.currentUri }, this.currentUri);

			this.updateView();
		}

		/**
		 * @description - Replaces the current hash
		 * @param {string} uri - The uri to replace the hash with
		 * @param {string} queryParams - queryParams to add to the hash
		 * @example - Router.replace('#home', '?my-query=awesome')
		 */
		replace(uri, queryParams) {
			this.currentUri = getCorrectedUri(uri, queryParams);

			replaceState({ page: this.currentUri }, this.currentUri);

			this.updateView();
		}

		/**
		 * @description - Updates the view inside routerElement with a new page component
		 */
		updateView() {
			this.routes.forEach(route => {
				if (route.pathname === this.currentUri) {
					this.routerElement.innerHTML = route.render();
				}
			});

			// Listen for router links on the page if the router isn't listening yet
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
		constructor(to, text, options) {
			this.to = to;
			this.text = text;
			this.options = options || {};
		}

		maybeAddClasses() {
			return this.options.classNames
				? `class="${this.options.classNames.join(' ')}"`
				: ''
		}

		render() {
			return `
			<a
				${this.maybeAddClasses()}
				href="#${this.to}"
				data-router-link
			>
				${this.text}
			</a>
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

	const prefix = num => {
		return num < 10 ? `0${num}` : num
	};

	var formatDate = date => {
		const parsedDate = new Date(date);
		const day = prefix(parsedDate.getDay());
		const month = prefix(parsedDate.getDay());
		const year = parsedDate.getFullYear();

		return `${day}-${month}-${year}`
	};

	const maybeSetDataSuccess = successState => {
		return successState
			? 'data-success'
			: ''
	};

	const getIcon = successState => {
		const baseUrl = '/assets/icons/';
		const iconName = successState ? 'check.svg' : 'warning.svg';

		return `${baseUrl}${iconName}`
	};

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

	const renderData = (data, node) => {
		console.log(data);

		node.insertAdjacentHTML('beforeend', new LaunchList(data).render());
	};

	document.getElementById('app')
		.appendChild(routerElement);

	fetch(endpoint)
		.then(response => response.json())
		.then(launches => {
			renderData(launches, document.getElementById('app'));
		})
		.catch(console.error);

}());
