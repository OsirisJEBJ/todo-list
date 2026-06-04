import { useReducer, useEffect, useCallback } from 'react';
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import useDebounce from '../../utils/useDebounce';
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../../reducers/todoReducer';
function TodosPage({token}) {    
const [state, dispatch] = useReducer(todoReducer, initialTodoState);

const {
  todoList,
  error,
  isTodoListLoading,
  sortBy,
  sortDirection,
  filterTerm,
  dataVersion,
  filterError
} = state;


const debouncedFilterTerm = useDebounce(filterTerm, 300);

const handleFilterChange = (newTerm) => {
  dispatch({
    type: TODO_ACTIONS.SET_FILTER,
    payload: { filterTerm: newTerm }
  });
};

const invalidateCache = useCallback(() => {
  console.log('Invalidating memo cache after todo mutation')
  setDataVersion(prev => prev + 1);
}, []);


useEffect(() => {
  if (!token) return; 

  async function fetchTodos() {
   dispatch({ type: TODO_ACTIONS.FETCH_START });

    const paramsObject = {
    sortBy,
    sortDirection,
};

if (debouncedFilterTerm) {
  paramsObject.find = debouncedFilterTerm;
}

    const params = new URLSearchParams(paramsObject).toString();

    try {
      const response = await fetch(`/api/tasks?${params}`, {
        method: 'GET',
        headers: {
          'X-CSRF-TOKEN': token
        }, 
        credentials: 'include'
      });

      if (response.status === 401) {
        throw new Error('unauthorized');
      }

      if (!response.ok) {
        throw new Error('error');
      }

      const data = await response.json();
      dispatch({
        type: TODO_ACTIONS.FETCH_SUCCESS,
        payload: { todos: data.tasks }
      });


    }  catch (error) {
 dispatch({
  type: TODO_ACTIONS.FETCH_ERROR,
  payload: {   
    message: `Error fetching todos: ${error.message}`,
    isFilterError: false, },
 });


}
  }

  fetchTodos();
}, [token, sortBy, sortDirection, debouncedFilterTerm]);


async function addTodo(todoTitle) {
  // Temporary todo with a unique ID for optimistic UI update
  const tempId = Date.now();
  const newTodo = {
    id: tempId,
    title: todoTitle,
    isCompleted: false
  };
   // Adding the new todo to the list immediately
dispatch({
  type: TODO_ACTIONS.ADD_TODO_START,
  payload: { newTodo }
});
  try {
  // Send POST request to create the new todo  
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'include',
      body: JSON.stringify({
        title: todoTitle,
        isCompleted: false
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add todo');
    }

    const data = await response.json(); 
    //Optimistically update the todo list with the actual data from the server, replacing the temporary todo
        dispatch({
      type: TODO_ACTIONS.ADD_TODO_SUCCESS,
      payload: { tempId, data }
    });
    invalidateCache();


  } catch (err) {
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_ERROR,
      payload: { tempId, message: err.message }
    });
  }
}


async function completeTodo(id) {
  //Store the original todo for potential rollback
  const originalTodo = todoList.find(todo => todo.id === id);
  if (!originalTodo) return;

  //Optimistic update
 dispatch({
    type: TODO_ACTIONS.COMPLETE_TODO_START,
    payload: { id }
  });

  try {
    //PATCH
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'include',
      body: JSON.stringify({
        title: originalTodo.title,
        isCompleted: true,
        // Note: Including createdAt as required by the assignment,
        // but this currently causes a validation error on the server.
        createdAt: originalTodo.createdAt
        // This line is here per assignment requirement but causes issues
      })
    });

    if (!response.ok) {
      throw new Error('Failed to complete todo');
    }
    const data = await response.json();

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
      payload: { id, data }
    });
    invalidateCache();

  } catch (err) {
    //Rollback to original state if the request fails
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
      payload: { id, originalTodo, message: err.message }
    });
  }
}


async function updateTodo(editTodo) {
  //Store the original todo for potential rollback
  const originalTodo = todoList.find(todo => todo.id === editTodo.id);
  if (!originalTodo) return;

  //Optimistic update
  dispatch({
    type: TODO_ACTIONS.UPDATE_TODO_START,
    payload: { id: editTodo.id, newTitle: editTodo.title }
  });


  try {
    //PATCH
    const response = await fetch(`/api/tasks/${editTodo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'include',
      body: JSON.stringify({
        title: editTodo.title,
        isCompleted: originalTodo.isCompleted,
        createdAt: originalTodo.createdAt
        // This line is here per assignment requirement but causes issues

      })
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
       const data = await response.json();

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
      payload: { id: editTodo.id, data }
    });
    invalidateCache();
  } catch (err) {
    //Rollback to original state if the request fails
  dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_ERROR,
      payload: { id: editTodo.id, originalTodo, message: err.message }
    });
  }
}




return(
<div>

    {error && (
  <div>
    <p>{error}</p>
    <button onClick={dispatch({type: TODO_ACTIONS.CLEAR_ERROR})}>Clear Error</button>
  </div>
)}
    {filterError && (
  <div>
    <p>{filterError}</p>
    <button onClick={() => setFilterError('')}>Clear Filter Error</button>
    <button
      onClick={() => {
        setFilterTerm('');
        setSortBy('creationDate');
        setSortDirection('desc');
        setFilterError('');
      }}
    >
      Reset Filters
    </button>
  </div>
)}


{isTodoListLoading && <p>Loading todos...</p>}
    <SortBy
  sortBy={sortBy}
  sortDirection={sortDirection}
  onSortByChange={setSortBy}
  onSortDirectionChange={setSortDirection}
   />
    <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
    <TodoForm onAddTodo={addTodo}/>
    <TodoList onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} todoList={todoList} dataVersion={dataVersion}/>
    
</div>
)
}
export default TodosPage;