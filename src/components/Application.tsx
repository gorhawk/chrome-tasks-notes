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
      <div className="flex min-w-3xl max-w-[90%] flex-col items-center">
        <div className="h-[10vh] w-full" />
        <TodoInput listId={activeListId} />
        <div className="flex w-full flex-1 flex-col">
          <Droppable droppableId={activeListId} type="TODO">
            {(provided) => (
              <div
                ref={provided.innerRef}
                className="w-full flex-1 list-none"
              >
                {activeListElements}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
      <button
        className="fixed top-1 left-1 inline-block cursor-pointer border-0 bg-transparent px-7 py-3.5 opacity-25 transition duration-300 hover:bg-neutral-100 hover:opacity-100"
        onClick={() => dispatch(clearCompletedTodos(activeListId))}
      >
        Clear completed
      </button>
    </DragDropContext>
  );
};

export default Application;
