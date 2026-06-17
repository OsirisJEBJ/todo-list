import { sanitizeInput } from '../../utils/sanitize';
import styles from './TodoForm.module.css';
import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import {isValidTodoTitle} from '../../utils/todoValidation';
function TodoForm({onAddTodo}){
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  
  const handleAddTodo = (event) => {
    event.preventDefault();
    const cleanTitle = sanitizeInput(workingTodoTitle);
    onAddTodo(cleanTitle);
    setWorkingTodoTitle('');
  };
  
    return(
      <form onSubmit={handleAddTodo} className={styles.form}>
      <div className={styles.input}>
        <TextInputWithLabel
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(sanitizeInput(e.target.value))}
          elementId={'todoTitle'}
          labelText={'Todo'}
          maxLength={80}
        />
      </div>
      <div>
        <button 
        disabled={!isValidTodoTitle(workingTodoTitle)} 
        type="submit"
        className={styles.button}
        >
          Add Todo
        </button>
      </div>
      </form>
    );
}
export default TodoForm;