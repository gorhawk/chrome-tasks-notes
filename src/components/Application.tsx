import React, { useEffect } from "react";
import Todo from "./Todo";
import TodoInput from "./TodoInput";
import {
  moveTodoInList,
  clearCompletedTodos,
  undoLastAction,
} from "../redux/todosSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

const Application = () => {
  const dispatch = useAppDispatch();
  const { todos, todoLists, activeListId } = useAppSelector(
    (state) => state.global,
  );
  const canUndo = useAppSelector((state) => state.ui.history.length > 0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isUndoShortcut =
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        event.key.toLowerCase() === "z";
      if (!isUndoShortcut) {
        return;
      }
      // Let native undo run inside text fields (e.g. mid-edit or the add-task
      // input) instead of hijacking it for the app-level undo.
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") {
        return;
      }
      event.preventDefault();
      dispatch(undoLastAction());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.source.droppableId === result.destination.droppableId) {
      dispatch(
        moveTodoInList({
          id: result.draggableId,
          listId: result.destination.droppableId,
          targetIndex: result.destination.index,
        }),
      );
    }
  };

  const activeList = todoLists[activeListId];
  const activeListElements = activeList.todoIds.map((key, index) => {
    const todo = todos[key];
    return (
      <Draggable draggableId={todo.id} key={todo.id} index={index}>
        {(provided) => (
          <div className="border-b-2 border-neutral-100">
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Todo {...todo} listId={activeListId} />
            </div>
          </div>
        )}
      </Draggable>
    );
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex min-w-[50%] max-w-[80%] flex-col items-center">
        <TodoInput listId={activeListId} />
        <div className="flex w-full flex-1 flex-col">
          <Droppable droppableId={activeListId} type="TODO">
            {(provided) => (
              <div ref={provided.innerRef} className="w-full flex-1 list-none">
                {activeListElements}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
      <div className="fixed top-1 left-1 flex items-center">
        <button
          type="button"
          className="inline-block cursor-pointer border-0 bg-transparent px-7 py-3.5 opacity-25 transition duration-300 disabled:cursor-default disabled:opacity-10 disabled:hover:bg-transparent hover:bg-neutral-100 hover:opacity-100"
          onClick={() => dispatch(undoLastAction())}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        <button
          type="button"
          className="inline-block cursor-pointer border-0 bg-transparent px-7 py-3.5 opacity-25 transition duration-300 hover:bg-neutral-100 hover:opacity-100"
          onClick={() => dispatch(clearCompletedTodos(activeListId))}
        >
          Clear completed
        </button>
      </div>
    </DragDropContext>
  );
};

export default Application;
