import { LAUNCHES_NAME } from '../lib/constants'

import useApi from './use-api'
import useLocalStorage from './use-local-storage'

export default async ({ flightNumber, page }) => {
	const localStorage = useLocalStorage
	const api = await useApi()

	if (page) {
		return api.getLaunches(page)
			.catch(() => {
				return localStorage.get(LAUNCHES_NAME)
			})
	}

	return api.getSpecificLaunch(flightNumber)
		.catch(() => {
			return localStorage.get(flightNumber)
		})
}
