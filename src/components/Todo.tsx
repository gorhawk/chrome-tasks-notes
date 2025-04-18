import "./Todo.scss";
import React from "react";
import { connect } from "react-redux";
import { createClassName } from "../../utility.js";
import Checkmark from "./Checkmark.js";
import { toggleTodo, removeTodo, changeTodo } from "../redux/actions.js";
import TodoTitleEditor from "./TodoTitleEditor.jsx";

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.titleDisplayRef = React.createRef();
    this.state = {
      isEditing: false,
      titleWidth: null,
    };
  }

  onDeleteButtonClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onRemoveTodoClick(this.props.id, this.props.listId);
  };

  onTodoTitleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.startEditing();
  };

  startEditing = () => {
    this.setState((prevState) =>
      prevState.isEditing
        ? {}
        : {
            isEditing: true,
            titleWidth: this.titleDisplayRef.current
              ? this.titleDisplayRef.current.offsetWidth
              : null,
          },
    );
  };

  stopEditing = () => {
    this.setState({ isEditing: false });
  };

  onTodoClick = (e) => {
    this.props.onTodoClick(this.props.id);
  };

  onFinishEditing = ({ value }) => {
    this.stopEditing();
    this.props.onFinishEditing(this.props.id, {
      title: value,
    });
  };

  onCancelEditing = () => {
    this.stopEditing();
  };

  className = () =>
    createClassName(
      "todo-item",
      this.props.isCompleted && "checked",
      this.state.isEditing && "editing",
    );

  renderTitle = () => {
    if (this.state.isEditing) {
      return (
        <TodoTitleEditor
          value={this.props.title}
          initialWidth={this.state.titleWidth}
          onFinishEditing={this.onFinishEditing}
          onCancelEditing={this.onCancelEditing}
        />
      );
    } else {
      return (
        <span
          ref={this.titleDisplayRef}
          className="todo-title"
          onClick={this.onTodoTitleClick}
        >
          {this.props.title}
        </span>
      );
    }
  };

  render = () => (
    <div
      className={this.className()}
      onClick={this.onTodoClick}
      onBlur={this.cancelEditing}
    >
      <div className="checkmark">
        <Checkmark />
      </div>
      <div className="todo-title-flex-wrapper">{this.renderTitle()}</div>
      <div className="delete-button" onClick={this.onDeleteButtonClick}>
        <div>&times;</div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  onFinishEditing: (id, newProps) => dispatch(changeTodo(id, newProps)),
  onTodoClick: (id) => dispatch(toggleTodo(id)),
  onRemoveTodoClick: (id, listId) => dispatch(removeTodo(id, listId)),
});

export default connect(null, mapDispatchToProps)(Todo);
