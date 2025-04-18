import { generateRandomKeys } from "../../utility.js";

const initialTodoListId = generateRandomKeys(1);

const initialState = {
  todos: {},
  todoLists: {
    [initialTodoListId]: {
      id: initialTodoListId,
      todoIds: [],
      isSyncedWithChrome: true,
    },
  },
  activeListId: initialTodoListId,
};

export default initialState;
