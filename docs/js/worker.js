(function () {
	'use strict';

	const endpoint = 'https://api.spacexdata.com/v3/launches';

	fetch(endpoint)
		.then(response => response.json())
		.then(launches => {
			postMessage(launches);
			return
		});

}());
