import React from "react";
import { TASK_TEXT_WARNING_LENGTH } from "../storage/quotas";

class TodoTitleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      value: props.value,
      initialWidth: this.props.initialWidth,
    };
  }

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.props.onFinishEditing({ value: this.state.value });
    }
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  componentDidMount() {
    this.inputRef.current.focus();
  }

  render = () => {
    const isNearTextLimit = this.state.value.length > TASK_TEXT_WARNING_LENGTH;
    return (
      <span className="todo-title-editor-wrapper">
        <input
          ref={this.inputRef}
          className={
            "todo-title-editor" +
            (isNearTextLimit ? " todo-title-editor-near-limit" : "")
          }
          type="text"
          style={{ width: this.state.initialWidth }}
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onBlur={this.props.onCancelEditing}
          onClick={(e) => e.stopPropagation()}
        />
        {isNearTextLimit && (
          <span className="todo-title-editor-warning">
            close to the sync size limit
          </span>
        )}
      </span>
    );
  };
}

export default TodoTitleEditor;
