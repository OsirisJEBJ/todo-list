import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import {isValidTodoTitle} from '../../utils/todoValidation';
function TodoForm({onAddTodo}){
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');


  };
  


    return(
      <form onSubmit={handleAddTodo}>
      
        <TextInputWithLabel
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(e.target.value)}
          elementId={'todoTitle'}
          labelText={'Todo'}
        >
        </TextInputWithLabel>
        <button disabled={!isValidTodoTitle(workingTodoTitle)} type="submit">
          Add Todo
        </button>
       </form>
    );
}
export default TodoForm;