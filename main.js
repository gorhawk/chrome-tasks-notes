import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from './src/redux/rootReducer'
import Application from "./src/components/Application.jsx"
import { loadState } from './src/storage.js'

const init = globalState => {
    console.log(globalState)
    const initialState = {
        global: globalState
    }
    const wrapper = document.getElementById('js-wrapper')
    const store = createStore(rootReducer, initialState, applyMiddleware(thunk, logger))
    const app = <Application/>
    const provider = <Provider store={store}>{app}</Provider>
    ReactDOM.render(provider, wrapper)
}

loadState(init)