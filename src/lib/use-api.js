import * as Comlink from 'https://unpkg.com/comlink@alpha/dist/esm/comlink.mjs'

export default async () => {
	if (window.Worker) {
		const apiWorker = Comlink.wrap(new Worker('js/workers/api-worker.js'))
		const Api = await new apiWorker

		return Api
	}

	throw new Error('Worker is not present, you can not use workers')
}
