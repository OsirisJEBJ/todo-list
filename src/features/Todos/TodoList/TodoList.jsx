import TodoListItem from './TodoListItem'; 
import { useMemo } from 'react';
function TodoList({todoList, onCompleteTodo, onUpdateTodo, dataVersion}) {
  const filteredTodoList = useMemo(() => {
  console.log(`Recalculating filtered todos (v${dataVersion})`);
  return {
    version: dataVersion,
    todos: todoList.filter(todo => !todo.isCompleted)
  };
}, [todoList, dataVersion]);
 

    return(
    filteredTodoList.todos.length === 0 ?( <p>Add todo above to get started</p>) : (
 <ul>
    {filteredTodoList.todos.map(todo => (
      <TodoListItem  onCompleteTodo={onCompleteTodo} key={todo.id} todo={todo} onUpdateTodo={onUpdateTodo} />
   
    ))}
  </ul>    
    )  
 );
}
export default TodoList;
