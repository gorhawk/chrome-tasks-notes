import React, { useRef, useState } from "react";
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
  const titleDisplayRef = useRef<HTMLSpanElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [titleWidth, setTitleWidth] = useState<number | null>(null);

  const startEditing = () => {
    if (isEditing) {
      return;
    }
    setTitleWidth(titleDisplayRef.current ? titleDisplayRef.current.offsetWidth : null);
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
          initialWidth={titleWidth}
          onFinishEditing={onFinishEditing}
          onCancelEditing={onCancelEditing}
        />
      );
    }
    return (
      <span
        ref={titleDisplayRef}
        className="mx-1 inline-block cursor-text border-0 px-1.5 py-0.5 hover:inset-ring-2 hover:inset-ring-neutral-400/20 focus:shadow-md"
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
      <div className="flex-auto">{renderTitle()}</div>
      {hasSyncError && (
        <div
          className="flex-none cursor-help px-1 text-amber-600"
          title="This task's text is too long to sync across your devices. Shorten it to sync."
        >
          &#9888;
        </div>
      )}
      <div
        className="flex flex-none items-center justify-end pr-2.5 opacity-25 transition duration-500 hover:opacity-85"
        onClick={onDeleteButtonClick}
      >
        <div>&times;</div>
      </div>
    </div>
  );
};

export default Todo;
