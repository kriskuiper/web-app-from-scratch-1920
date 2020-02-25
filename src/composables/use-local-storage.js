const storage = window.localStorage

export default {
	get(name) {
		return new Promise((resolve, reject) => {
			const item = storage.getItem(name)

			if (!item) {
				reject('No item found in localStorage')
			}

			else {
				resolve(JSON.parse(item))
			}
		})
	},
	set(name, value) {
		return new Promise(resolve => {
			storage.setItem(name, JSON.stringify(value))

			resolve()
		})
	},
	remove(name) {
		return new Promise((resolve, reject) => {
			const item = storage.getItem(name)

			if (!item) {
				reject('That item does not exist in localStorage')
			}

			else {
				storage.removeItem(name)

				resolve()
			}
		})
	}
}
