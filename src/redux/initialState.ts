import { generateRandomKey } from "../../utility.js";

const initialTodoListId = generateRandomKey();

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
