function TodoListItem({todo, onCompleteTodo}) {
    return(
 <li key={todo.id}>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onCompleteTodo(todo.id)}
      />
      {todo.title}
  </li>    );
}

export default TodoListItem;