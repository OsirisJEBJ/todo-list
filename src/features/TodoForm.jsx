import {useRef} from 'react';
import { useState } from 'react';
function TodoForm({onAddTodo}){
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const inputRef = useRef();
  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');


  };


    return(
      <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo</label>
        <input
           ref={inputRef}
           type="text"
           id="todoTitle"
           name="todoTitle"
           placeholder={'Todo text'}

           value={workingTodoTitle}
           onChange={(e) => setWorkingTodoTitle(e.target.value)}
    />
        <button disabled={!workingTodoTitle.trim()} type="submit">
          Add Todo
        </button>
       </form>
    );
}
export default TodoForm;