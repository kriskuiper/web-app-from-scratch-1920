(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}((function () { 'use strict';

	const PAGE_SIZE = 24;

	importScripts("https://unpkg.com/comlink@alpha/dist/umd/comlink.js");

	class Api {
		constructor() {
			this.endpoint = 'https://api.spacexdata.com/v3/launches';
		}

		async getLaunches(page = 1) {
			const OFFSET = (page - 1) * PAGE_SIZE;
			const url = `${this.endpoint}?limit=${PAGE_SIZE}&offset=${OFFSET}`;

			const response = await fetch(url);
			const launches = await response.json();

			return launches
		}

		async getSpecificLaunch(flightNumber) {
			const correctedUrl = `${this.endpoint}/${flightNumber}`;
			const response = await fetch(correctedUrl);
			const launch = await response.json();

			return launch
		}
	}

	Comlink.expose(Api);

})));
