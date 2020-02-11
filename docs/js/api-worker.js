(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}((function () { 'use strict';

	importScripts("https://unpkg.com/comlink@alpha/dist/umd/comlink.js");

	class Api {
		constructor() {
			this.endpoint = 'https://api.spacexdata.com/v3/launches';
		}

		async get() {
			fetch(this.endpoint)
				.then(response => response.json())
				.then(launches => {
					console.log('Data from api worker: ', launches);
				});
		}
	}

	Comlink.expose(new Api);

})));
