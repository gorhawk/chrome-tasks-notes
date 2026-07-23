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
    <div className="my-5 flex w-full flex-none flex-col shadow-md">
      <input
        type="text"
        className={
          "h-10 flex-1 border-2 border-solid p-2 placeholder:text-neutral-300 focus:outline-2 focus:outline-blue-500/30" +
          (isNearTextLimit ? " border-amber-600" : " border-neutral-300")
        }
        placeholder="Add a task"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={atTaskLimit}
      />
      {atTaskLimit && (
        <div className="px-2 py-1 text-xs text-amber-600">
          Task limit reached ({MAX_TASK_COUNT}) - delete a task to add
          another.
        </div>
      )}
      {!atTaskLimit && isNearTextLimit && (
        <div className="px-2 py-1 text-xs text-amber-600">
          This task is close to the sync size limit and may not save.
        </div>
      )}
    </div>
  );
};

export default TodoInput;
