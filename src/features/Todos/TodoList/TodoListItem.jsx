import { sanitizeInput } from "../../../utils/sanitize";
import styles from "./TodoListItem.module.css";
import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import {isValidTodoTitle} from '../../../utils/todoValidation';
import { useEditableTitle } from "../../../hooks/useEditableTitle";

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {

const {
  isEditing,
  workingTitle,
  startEditing,
  cancelEdit,
  updateTitle,
  finishEdit
} = useEditableTitle(todo.title);

const handleEdit = (e) => updateTitle(sanitizeInput(e.target.value));

const handleCancel = cancelEdit;

const handleUpdate = (e) => {
  if (!isEditing) return;
  e.preventDefault();
  const finalTitle = sanitizeInput(finishEdit());
  onUpdateTodo({ id: todo.id, title: finalTitle });
};



    return(
      <li className={styles.item}>
        <form onSubmit={handleUpdate} className={styles.form}>
          {isEditing ? (
          <div className={styles.editContainer}>
            <TextInputWithLabel
             value={workingTitle}
             onChange={handleEdit}
             elementId={`todo-${todo.id}`}
             labelText={'Todo'}
             maxLength={80}
            />
            <div className={styles.buttons}>
            <button 
            type="button" 
            onClick={handleCancel} 
            className={styles.buttonCancel}>
              Cancel
            </button>
            <button
            type="button"
            onClick={handleUpdate}
            disabled={!isValidTodoTitle(workingTitle)}
            className={styles.buttonUpdate}>
              Update
             </button>

            </div>
          </div>
           ) : (
              <>

              <div className={styles.left}>
               <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
                id={`checkbox${todo.id}`}
                className={styles.checkbox}
                maxLength={80}
              />
              
              <span 
              title="Update"
              onClick={() => startEditing()}
              className={`${styles.title} ${
                  todo.isCompleted ? styles.completed : ""
                }`}>
                  {sanitizeInput(todo.title)}
              </span>
              </div>
              </>
           )}
        </form>
  </li>   
      )};
    

export default TodoListItem;
