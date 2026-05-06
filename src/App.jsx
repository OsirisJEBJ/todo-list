import TodoList from './TodoList';
import TodoForm from './TodoForm';
import './App.css';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

function addTodo(todoTitle) {
  const newTodo = {
    id: Date.now(),
    title: todoTitle,
    isCompleted: false
  };
  setTodoList(previous => [newTodo, ...previous]);
}

function completeTodo(id) {
  setTodoList(previous => previous.map(todo => {
    if (todo.id === id) {
      return { ...todo, isCompleted: true };
    }
    return todo;
  }));
}


return(
<div>
   <h1>Todo List</h1>
   <TodoForm onAddTodo={addTodo}/>
    <TodoList onCompleteTodo={completeTodo} todoList={todoList} />
    
</div>
)
}

export default App
