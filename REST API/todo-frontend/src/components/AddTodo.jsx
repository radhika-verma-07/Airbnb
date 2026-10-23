import { useState } from "react";

function AddTodo({ onNewItem }) {
  const [todoName, setTodoName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleNameChange = (event) => {
    setTodoName(event.target.value);
  };

  const handleDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const handleAddButtonClicked = () => {
    if (!todoName.trim()) return;

    onNewItem(todoName.trim(), dueDate);
    setDueDate("");
    setTodoName("");
  };

  return (
    <div className="todo-form-wrap">
      <div className="todo-form-row">
        <div className="todo-input-wrap todo-name-wrap">
          <input
            className="todo-input todo-name-input"
            type="text"
            placeholder="Enter Todo Here"
            value={todoName}
            onChange={handleNameChange}
          />
        </div>
        <div className="todo-input-wrap todo-date-wrap">
          <input
            className="todo-input todo-date-input"
            type="date"
            value={dueDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="todo-button-wrap">
          <button
            type="button"
            className="todo-add-button"
            onClick={handleAddButtonClicked}
          >
            <span className="todo-plus-icon">+</span> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTodo;