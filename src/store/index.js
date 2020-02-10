import Store from './Store'
import * as mutations from './mutations'

const initialState = {
	items: []
}

export default new Store({
	initialState,
	mutations
})
