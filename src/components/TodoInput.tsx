import "./TodoInput.css";
import React from "react";
import { connect } from "react-redux";
import { addTodo } from "../redux/actions.js";
import { TASK_TEXT_WARNING_LENGTH, MAX_TASK_COUNT } from "../storage/quotas";

class TodoInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || "",
    };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }
    if (this.isAtTaskLimit()) {
      return;
    }
    this.props.onSubmission(this.state.value, this.props.listId);
    this.setState({ value: "" });
  };

  isAtTaskLimit = () =>
    Object.keys(this.props.global.todos).length >= MAX_TASK_COUNT;

  render = () => {
    const atTaskLimit = this.isAtTaskLimit();
    const isNearTextLimit = this.state.value.length > TASK_TEXT_WARNING_LENGTH;
    return (
      <div className="todo-input-wrapper">
        <input
          type="text"
          className={
            "todo-input" + (isNearTextLimit ? " todo-input-near-limit" : "")
          }
          placeholder="Add a task"
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          disabled={atTaskLimit}
        />
        {atTaskLimit && (
          <div className="todo-input-warning">
            Task limit reached ({MAX_TASK_COUNT}) - delete a task to add
            another.
          </div>
        )}
        {!atTaskLimit && isNearTextLimit && (
          <div className="todo-input-warning">
            This task is close to the sync size limit and may not save.
          </div>
        )}
      </div>
    );
  };
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
  onSubmission: (title, listId) => dispatch(addTodo(title, listId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoInput);
