import React from "react";

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

  render = () => (
    <input
      ref={this.inputRef}
      className="todo-title-editor"
      type="text"
      style={{ width: this.state.initialWidth }}
      value={this.state.value}
      onChange={this.handleChange}
      onKeyDown={this.handleKeyDown}
      onBlur={this.props.onCancelEditing}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default TodoTitleEditor;
