import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import Application from "./src/components/Application.jsx"
import initialState from './initialState'
import { loadState } from './src/storage';

let windowLoaded = false

const init = state => {
    console.log(state);
    const data = state || initialState
    const wrapper = document.getElementById('js-wrapper')
    const store = createStore(rootReducer, data, applyMiddleware(thunk, logger))
    const app = <Application/>
    const provider = <Provider store={store}>{app}</Provider>
    ReactDOM.render(provider, wrapper)
}

loadState(init)

window.addEventListener('load', e => {
    windowLoaded = true
});