import "./TodoInput.scss"
import React from "react"
import { connect } from "react-redux"
import { addTodo } from "../../actions";

class TodoInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value || ''
        }
    }
    
    handleChange = event => {
        this.setState({value: event.target.value});
    }

    handleKeyDown = event => {
        if (event.key !== 'Enter') {
            return;
        }
        this.props.onSubmission(this.state.value, this.props.listId)
        this.setState({value: ''});
    }

    render = props => <div className="todo-input-wrapper">
        <input
            type="text"
            className="todo-input"
            placeholder="Add a task"
            value={this.state.value}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
        />
    </div>
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
    onSubmission: (title, listId) => dispatch(addTodo(title, listId))
})

export default TodoInput = connect(mapStateToProps, mapDispatchToProps)(TodoInput)