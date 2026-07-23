import "./Todo.css";
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
    "todo-item",
    isCompleted && "checked",
    isEditing && "editing",
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
        className="todo-title"
        onClick={onTodoTitleClick}
      >
        {title}
      </span>
    );
  };

  return (
    <div className={className} onClick={onTodoClick}>
      <div className="checkmark">
        <Checkmark />
      </div>
      <div className="todo-title-flex-wrapper">{renderTitle()}</div>
      {hasSyncError && (
        <div
          className="todo-sync-error"
          title="This task's text is too long to sync across your devices. Shorten it to sync."
        >
          &#9888;
        </div>
      )}
      <div className="delete-button" onClick={onDeleteButtonClick}>
        <div>&times;</div>
      </div>
    </div>
  );
};

export default Todo;
