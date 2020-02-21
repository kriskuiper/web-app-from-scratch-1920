import { SET_DATA, SET_LAUNCH } from './mutation-keys'

export const setData = (context, payload) => {
	context.commit(SET_DATA, payload)
}

export const setLaunch = (context, payload) => {
	context.commit(SET_LAUNCH, payload)
}
