import styles from './TodoList.module.css';
import TodoListItem from './TodoListItem'; 
import { useMemo } from 'react';
function TodoList({
  todoList, 
  onCompleteTodo, 
  onUpdateTodo, 
  dataVersion, 
  statusFilter}) {
  const filteredTodoList = useMemo(() => {
  let filteredTodos;
    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;
      case 'active':
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;
      case 'all':
      default:
        filteredTodos = todoList;
        break;
    }

  return {
    version: dataVersion,
    todos: filteredTodos
  
  };
}, [todoList, dataVersion, statusFilter]);
 
  
   const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return 'No completed todos yet. Complete some tasks to see them here.';
      case 'active':
        return 'No active todos. Add a todo above to get started.';
      case 'all':
      default:
        return 'Add todo above to get started.';
    }
  };
  
  return (
  <div className={styles.container}> 
    {filteredTodoList.todos.length === 0 ?( 
    <p className={styles.empty}>{getEmptyMessage()}</p>) : (
    <ul className={styles.list}>
    {filteredTodoList.todos.map(todo => (
      <TodoListItem  
      onCompleteTodo={onCompleteTodo} 
      key={todo.id} 
      todo={todo} 
      onUpdateTodo={onUpdateTodo} />
   
    ))}
    </ul>    
    )}
  </div>  
 );
}
export default TodoList;
