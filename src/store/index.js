import Store from './Store'
import * as mutations from './mutations'
import * as actions from './actions'

const initialState = {
	items: []
}

export default new Store({
	initialState,
	mutations,
	actions
})
