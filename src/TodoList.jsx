import TodoListItem from './TodoListItem'; 
function TodoList({todoList, onCompleteTodo}) {
  const filteredTodoList = todoList.filter(todo => !todo.isCompleted);
  
    return(
    filteredTodoList.length === 0 ?( <p>Add todo above to get started!</p>) : (
 <ul>
    {filteredTodoList.map(todo =>( 
      <TodoListItem  onCompleteTodo={onCompleteTodo} key={todo.id} todo={todo} />
    ))}
  </ul>    
    )  
 );
}
export default TodoList;
