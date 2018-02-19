import "./Todo.scss"
import React from "react"
import { connect } from "react-redux"
import { createClassName } from "../../utility"
import Checkmark from './Checkmark.jsx'
import { toggleTodo, removeTodo } from "../../actions"

class Todo extends React.Component {
    onDeleteButtonClick = event => {
        event.preventDefault()
        event.stopPropagation()
        this.props.onRemoveTodoClick(this.props.id, this.props.listId)
    }

    className = () => createClassName("todo-item", this.props.isCompleted && "checked")
    
    render = () => <div className={this.className()} onClick={e => this.props.onTodoClick(this.props.id)}>
        <div className="checkmark">
            <Checkmark/>
        </div>
        {/* todo contenteditable */}
        <div className="todo-title">{this.props.title}</div>
        <div className="delete-button" onClick={e=> this.onDeleteButtonClick(e)}>
            <span>&times;</span>
        </div>
    </div>
}

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
    onTodoClick: id => dispatch(toggleTodo(id)),
    onRemoveTodoClick: (id, listId) => dispatch(removeTodo(id, listId))
})

export default Todo = connect(mapStateToProps, mapDispatchToProps)(Todo)