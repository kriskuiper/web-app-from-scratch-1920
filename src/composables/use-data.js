import { LAUNCHES_NAME } from '../lib/constants'

import useApi from './use-api'
import useLocalStorage from './use-local-storage'

export default async ({ flightNumber, page }) => {
	const localStorage = useLocalStorage
	const api = await useApi()


	/**
	 * When fetching all data, we want to first see
	 * if we can reach the API, since that's the source
	 * of truth.
	 */
	if (page) {
		return api.getLaunches(page)
			.catch(() => {
				return localStorage.get(LAUNCHES_NAME)
			})
	}

	/**
	 * However, when fetching a single result, we first
	 * can look in localStorage since that's set when a
	 * user has visited the launch page once.
	 */
	return localStorage.get(flightNumber)
		.catch(() => {
			return api.getSpecificLaunch(flightNumber)
		})
}
