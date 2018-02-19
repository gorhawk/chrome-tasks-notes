import { generateRandomKeys } from './utility.js'

const initialListId = generateRandomKeys(1)

const initialState = {
    todos: {},
    todoLists: {
        [initialListId]: {
            todoIds: []
        }
    },
    activeListId: initialListId
}

export default initialState