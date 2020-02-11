(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}((function () { 'use strict';

	importScripts("https://unpkg.com/comlink@alpha/dist/umd/comlink.js");

	class Api {
		constructor() {
			this.endpoint = 'https://api.spacexdata.com/v3/launches';
		}

		async getLaunches() {
			const response = await fetch(this.endpoint);
			const launches = await response.json();

			return launches
		}

		async getLaunchByFlightNumber(flightNumber) {
			const correctedUrl = `${this.endpoint}/${flightNumber}`;
			const response = await fetch(correctedUrl);
			const launch = await response.json();

			return launch
		}
	}

	Comlink.expose(Api);

})));
