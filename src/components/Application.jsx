import "./Application.scss"
import React from "react"
import { connect } from "react-redux"
import Todo from "./Todo.jsx"
import TodoInput from "./TodoInput.jsx"
import { toggleTodo, removeTodo, moveTodoInList, clearCompletedTodos } from "../redux/actions"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

class Application extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            storageUsagePercent: 0
        }
    }

    onDragStart = event => {
        
    }

    onDragEnd = result => {
        console.log(result)
        if (!result.destination) {
            return
        }
        if (result.source.droppableId === result.destination.droppableId) {
            this.props.dispatch(moveTodoInList(result.draggableId, result.destination.droppableId, result.destination.index))
        }
    }

    refreshUsage = () => {
        // chrome.storage.sync.getBytesInUse(null, bytes => {
        //     console.log(bytes)
        //     this.setState({storageUsagePercent: (bytes/8092)*100})
        // })
    }

    componentDidMount() {
        this.refreshUsage()
        // chrome.contextMenus.create({contexts: ['all'], title: "custom menu item"}, () => {
        //     console.log("created context menu item");
        // })
    }

    componentWillReceiveProps() {
        this.refreshUsage()
    }

    render() {
        const activeList = this.props.todoLists[this.props.activeListId]
        const activeListElements = activeList.todoIds.map((key, index) => {
            const todo = this.props.todos[key]
            return <Draggable draggableId={todo.id} key={todo.id} type="TODO" index={index}>
                {(provided, snapshot) => <div className="todo-placeholder-wrapper">
                    <div className="todo-draggable-wrapper" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                        <Todo {...todo} listId={this.props.activeListId}/>
                    </div>
                    {provided.placeholder}
                </div>}
            </Draggable>
        });
        return <DragDropContext
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
        >
            <div className="todo-list-wrapper">
                <div className="todo-list-top-spacer"/>
                <TodoInput listId={this.props.activeListId}/>
                <div className="todo-list-scroll-container">
                    <Droppable droppableId={this.props.activeListId} type="TODO">
                        {(provided, snapshot) => <div ref={provided.innerRef} className="todo-list">
                            {activeListElements}
                            {provided.placeholder}
                        </div>}
                    </Droppable>
                </div>
                <div className="todo-list-bottom-spacer"/>
                {/* <div className="storage-usage-bar">
                    <div className="indicator" style={{width: `${Math.trunc(this.state.storageUsagePercent)}%`}}/>
                </div> */}
            </div>
            <button className="button clear-completed-button" onClick={() => this.props.clearCompleted(this.props.activeListId)}>
                Clear completed
            </button>
        </DragDropContext>
    }
}

const mapStateToProps = state => ({
    ...state.global
})

const mapDispatchToProps = dispatch => ({
    dispatch,
    clearCompleted: listId => dispatch(clearCompletedTodos(listId))
})

export default Application = connect(mapStateToProps, mapDispatchToProps)(Application)