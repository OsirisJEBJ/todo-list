import { useReducer, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import useDebounce from '../../utils/useDebounce';
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../../reducers/todoReducer';
function TodosPage() {  
const { token } = useAuth();   
  
const [state, dispatch] = useReducer(todoReducer, initialTodoState);
const {
  todoList,
  error,
  isTodoListLoading,
  sortBy,
  sortDirection,
  filterTerm,
  filterError,
  dataVersion
} = state;


const debouncedFilterTerm = useDebounce(filterTerm, 300);

const handleFilterChange = (newTerm) => {
  dispatch({
    type: TODO_ACTIONS.SET_FILTER,
    payload: { filterTerm: newTerm }
  });
};

const invalidateCache = useCallback(() => {
dispatch({ type: TODO_ACTIONS.BUMP_VERSION });
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
  const tempId = Date.now();
  const newTodo = {
    id: tempId,
    title: todoTitle,
    isCompleted: false
  };
dispatch({
  type: TODO_ACTIONS.ADD_TODO_START,
  payload: { newTodo }
});
  try {
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
  const originalTodo = todoList.find(todo => todo.id === id);
  if (!originalTodo) return;

 dispatch({
    type: TODO_ACTIONS.COMPLETE_TODO_START,
    payload: { id }
  });

  try {
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
        createdAt: originalTodo.createdAt
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
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
      payload: { id, originalTodo, message: err.message }
    });
  }
}


async function updateTodo(editTodo) {
  const originalTodo = todoList.find(todo => todo.id === editTodo.id);
  if (!originalTodo) return;

  dispatch({
    type: TODO_ACTIONS.UPDATE_TODO_START,
    payload: { id: editTodo.id, newTitle: editTodo.title }
  });


  try {
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
    <button onClick={() => dispatch({type: TODO_ACTIONS.CLEAR_ERROR})}>Clear Error</button>
  </div>
)}
    {filterError && (
  <div>
    <p>{filterError}</p>
    <button onClick={() => dispatch({type: TODO_ACTIONS.CLEAR_FILTER_ERROR})}>Clear Filter Error</button>
    <button
      onClick={() => {
        dispatch({type: TODO_ACTIONS.RESET_FILTERS});
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
  onSortByChange={(sortBy) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection } })}
  onSortDirectionChange={(sortDirection) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection } })}
   />
    <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
    <TodoForm onAddTodo={addTodo}/>
    <TodoList onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} todoList={todoList} dataVersion={dataVersion}/>
    
</div>
)
}
export default TodosPage;
