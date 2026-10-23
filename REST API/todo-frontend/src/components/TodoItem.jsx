function TodoItem({ id, todoName, todoDate, onDeleteClick }) {
  return (
    <div className="todo-list-card">
      <div className="todo-list-row">
        <div className="todo-name-cell">{todoName}</div>
        <div className="todo-date-cell">{todoDate}</div>
        <div className="todo-action-cell">
          <button
            type="button"
            className="todo-delete-button"
            onClick={() => onDeleteClick(id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
