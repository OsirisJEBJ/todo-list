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

const handleEdit = (e) => updateTitle(e.target.value);

const handleCancel = cancelEdit;

const handleUpdate = (e) => {
  if (!isEditing) return;
  e.preventDefault();
  const finalTitle = finishEdit();
  onUpdateTodo({ id: todo.id, title: finalTitle });
};



    return(
      <li>
        <form onSubmit={handleUpdate}>
          {isEditing ? (
            <>
            <TextInputWithLabel
             value={workingTitle}
             onChange={handleEdit}
             elementId={`todo-${todo.id}`}
             labelText={'Todo'}
            />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button
            type="button"
            onClick={handleUpdate}
            disabled={!isValidTodoTitle(workingTitle)}
      >
        Update
      </button>

            </>
           ) : (
              <>
              <label>
               <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
                id={`checkbox${todo.id}`}
<<<<<<< HEAD:src/features/Todos/TodoList/TodoListItem.jsx

=======
>>>>>>> 7993e6dfa1ef2a4f56ba148963e53ef0e94420c2:src/features/TodoList/TodoListItem.jsx
              />
              </label>
              <span onClick={() => startEditing()}>{todo.title}</span>
              </>
           )}
        </form>
  </li>   
      )};
    

export default TodoListItem;
