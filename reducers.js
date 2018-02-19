import { combineReducers } from 'redux'
import * as Actions from './actions.js'
import {omit, without, clamp, todoOccurrenceCount} from './utility.js'

const noopReducer = (state, action) => state

const actionReducerMap = {
    "@@redux/INIT": noopReducer,
}

actionReducerMap[Actions.TOGGLE_TODO] = (state, action) => ({
    ...state,
    todos: {
        ...state.todos,
        [action.id]: {
            ...state.todos[action.id],
            isCompleted: !state.todos[action.id].isCompleted
        }
    }
})

actionReducerMap[Actions.REMOVE_TODO] = (state, action) => {
    const list = state.todoLists[action.listId]
    const todoIndex = list.todoIds.indexOf(action.id)
    const occurrenceCount = todoOccurrenceCount(state.todoLists, action.id)
    return {
        ...state,
        todos: (occurrenceCount === 1) ? omit(state.todos, action.id) : state.todos,
        todoLists: {
            ...state.todoLists,
            [action.listId]: {
                ...list,
                todoIds: without(list.todoIds, todoIndex)
            }
        }
    }
}

actionReducerMap[Actions.MOVE_TODO_IN_LIST] = (state, action) => {
    const list = state.todoLists[action.listId]
    const todoIndex = list.todoIds.indexOf(action.id)
    const todoIds = without(list.todoIds, todoIndex)
    todoIds.splice(action.targetIndex, 0, action.id)
    return {
        ...state,
        todoLists: {
            ...state.todoLists,
            [action.listId]: {
                ...list,
                todoIds
            }
        }
    }
}

actionReducerMap[Actions.ADD_TODO] = (state, action) => ({
    ...state,
    todos: {
        ...state.todos,
        [action.id]: {
            id: action.id,
            title: action.title,
            isCompleted: false
        }
    },
    todoLists: {
        ...state.todoLists,
        [action.listId]: {
            ...state.todoLists[action.listId],
            todoIds: [
                ...state.todoLists[action.listId].todoIds,
                action.id
            ]
        }
    }
})

const applyReducerMapping = (state = initialState, action) => {
    const reducer = actionReducerMap[action.type]
    if (typeof reducer !== 'function') {
        console.warn('Reducer not mapped for action:', action)
        return state
    }
    return reducer(state, action)
}

const rootReducer = (state, action) => applyReducerMapping(state, action)

export default rootReducer