import React, { useState } from "react";
import { createClassName } from "../../utility.js";
import Checkmark from "./Checkmark";
import { toggleTodo, removeTodo, changeTodo } from "../redux/todosSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import TodoTitleEditor from "./TodoTitleEditor";

interface TodoProps {
  id: string;
  title: string;
  isCompleted: boolean;
  listId: string;
}

const Todo = ({ id, title, isCompleted, listId }: TodoProps) => {
  const dispatch = useAppDispatch();
  const hasSyncError = useAppSelector((state) =>
    (state.ui.taskSyncErrorIds || []).includes(id),
  );
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    if (isEditing) {
      return;
    }
    setIsEditing(true);
  };

  const stopEditing = () => setIsEditing(false);

  const onDeleteButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(removeTodo({ id, listId }));
  };

  const onTodoTitleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    startEditing();
  };

  const onTodoClick = () => {
    dispatch(toggleTodo(id));
  };

  const onFinishEditing = ({ value }: { value: string }) => {
    stopEditing();
    dispatch(changeTodo({ id, newProps: { title: value } }));
  };

  const onCancelEditing = () => stopEditing();

  const className = createClassName(
    "relative flex items-center p-2.5 select-none transition-colors duration-500 hover:bg-neutral-50",
    isEditing ? "cursor-auto" : "cursor-pointer",
  );

  const renderTitle = () => {
    if (isEditing) {
      return (
        <TodoTitleEditor
          value={title}
          onFinishEditing={onFinishEditing}
          onCancelEditing={onCancelEditing}
        />
      );
    }
    return (
      <span
        title={title}
        className="mx-1 block max-w-full truncate cursor-text border-0 px-1.5 py-0.5 hover:inset-ring-2 hover:inset-ring-neutral-400/20 focus:shadow-md"
        onClick={onTodoTitleClick}
      >
        {title}
      </span>
    );
  };

  return (
    <div className={className} onClick={onTodoClick}>
      <div className="relative mr-2.5 size-6 flex-none border-2 border-neutral-400 bg-neutral-200/50">
        <Checkmark visible={isCompleted} />
      </div>
      <div className="min-w-0 flex-auto">{renderTitle()}</div>
      {hasSyncError && (
        <div
          className="flex-none cursor-help px-1 text-amber-600"
          title="This task's text is too long to sync across your devices. Shorten it to sync."
        >
          &#9888;
        </div>
      )}
      <button
        type="button"
        aria-label="Delete task"
        className="ml-2 flex-none cursor-pointer rounded border-0 bg-transparent px-2 py-1 text-lg leading-none opacity-25 transition duration-300 hover:bg-neutral-100 hover:opacity-85"
        onClick={onDeleteButtonClick}
      >
        &times;
      </button>
    </div>
  );
};

export default Todo;
