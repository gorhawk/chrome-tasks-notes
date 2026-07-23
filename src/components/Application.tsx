import "./Application.css";
import React from "react";
import Todo from "./Todo";
import TodoInput from "./TodoInput";
import { moveTodoInList, clearCompletedTodos } from "../redux/todosSlice";
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
          <div className="todo-placeholder-wrapper">
            <div
              className="todo-draggable-wrapper"
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
      <div className="todo-list-wrapper">
        <div className="todo-list-top-spacer" />
        <TodoInput listId={activeListId} />
        <div className="todo-list-scroll-container">
          <Droppable droppableId={activeListId} type="TODO">
            {(provided) => (
              <div ref={provided.innerRef} className="todo-list">
                {activeListElements}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
      <button
        className="button clear-completed-button"
        onClick={() => dispatch(clearCompletedTodos(activeListId))}
      >
        Clear completed
      </button>
    </DragDropContext>
  );
};

export default Application;
