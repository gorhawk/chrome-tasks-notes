import { combineReducers } from 'redux'
import globalReducer from './reducers'
import uiReducer from './ui/reducers'

const rootReducer = combineReducers({
    global: globalReducer,
    ui: uiReducer
})

export default rootReducer