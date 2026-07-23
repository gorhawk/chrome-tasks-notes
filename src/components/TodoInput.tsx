import "./TodoInput.css";
import React, { useState } from "react";
import { addTodoThunk } from "../redux/todosSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { TASK_TEXT_WARNING_LENGTH, MAX_TASK_COUNT } from "../storage/quotas";

interface TodoInputProps {
  listId: string;
}

const TodoInput = ({ listId }: TodoInputProps) => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.global.todos);
  const [value, setValue] = useState("");

  const atTaskLimit = Object.keys(todos).length >= MAX_TASK_COUNT;
  const isNearTextLimit = value.length > TASK_TEXT_WARNING_LENGTH;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    if (atTaskLimit) {
      return;
    }
    dispatch(addTodoThunk(value, listId));
    setValue("");
  };

  return (
    <div className="todo-input-wrapper">
      <input
        type="text"
        className={
          "todo-input" + (isNearTextLimit ? " todo-input-near-limit" : "")
        }
        placeholder="Add a task"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={atTaskLimit}
      />
      {atTaskLimit && (
        <div className="todo-input-warning">
          Task limit reached ({MAX_TASK_COUNT}) - delete a task to add
          another.
        </div>
      )}
      {!atTaskLimit && isNearTextLimit && (
        <div className="todo-input-warning">
          This task is close to the sync size limit and may not save.
        </div>
      )}
    </div>
  );
};

export default TodoInput;
