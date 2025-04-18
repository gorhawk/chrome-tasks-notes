import { generateRandomKeys } from '../../utility.js'
import { saveState, syncLocalStorage } from '../storage.js'

export const TOGGLE_TODO = 'TOGGLE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_EXISTING_TODO_TO_LIST = 'ADD_EXISTING_TODO_TO_LIST'
export const MOVE_TODO_IN_LIST = 'MOVE_TODO_IN_LIST'
export const CHANGE_TODO = 'CHANGE_TODO'
export const CLEAR_COMPLETED_TODOS = 'CLEAR_COMPLETED_TODOS'

export const toggleTodoInternal = id => ({type: TOGGLE_TODO, id})
export const removeTodoInternal = (id, listId) => ({type: REMOVE_TODO, id, listId})
export const addTodoWithId = (id, title, listId, isSaving = true) => ({type: ADD_TODO, id, title, listId, isSaving})
export const moveTodoInListInternal = (id, listId, targetIndex) => ({type: MOVE_TODO_IN_LIST, id, listId, targetIndex})
export const changeTodoInternal = (id, newProps) => ({type: CHANGE_TODO, id, newProps})
export const clearCompletedTodosInternal = (listId) => ({type: CLEAR_COMPLETED_TODOS, listId})

export const changeTodo = (id, newProps) => dispatch => {
    dispatch(changeTodoInternal(id, newProps))
    dispatch(initiateSave())
}

export const toggleTodo = id => (dispatch, getState) => {
    dispatch(toggleTodoInternal(id))
    dispatch(initiateSave())
}

export const moveTodoInList = (id, listId, targetIndex) => (dispatch, getState) => {
    dispatch(moveTodoInListInternal(id, listId, targetIndex))
    dispatch(initiateSave())
}

export const addTodo = (title, listId) => (dispatch, getState) => {
    const state = getState()
    const existingTodoIds = Object.keys(state.global.todos);
    const existingTodoListIds = Object.keys(state.global.todoLists);
    const key = generateRandomKeys(1, [...existingTodoListIds, ...existingTodoIds]);
    dispatch(addTodoWithId(key, title, listId))
    dispatch(initiateSave())
}

export const removeTodo = (id, listId) => (dispatch, getState) => {
    dispatch(removeTodoInternal(id, listId))
    dispatch(initiateSave())
}

export const clearCompletedTodos = listId => (dispatch, getState) => {
    dispatch(clearCompletedTodosInternal(listId))
    dispatch(initiateSave())
}

export const initiateSave = () => (dispatch, getState) => {
    const state = getState()
    saveState(state.global)
    syncLocalStorage()
}