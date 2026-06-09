import { useState, useEffect, useCallback } from 'react';
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import useDebounce from '../../utils/useDebounce';
function TodosPage({token}) {    
const [todoList, setTodoList] = useState([]);
const [error, setError] = useState('');
const [isTodoListLoading, setIsTodoListLoading] = useState(false);
const [sortBy, setSortBy] = useState('creationDate');
const [sortDirection, setSortDirection] = useState('desc');
const [filterTerm, setFilterTerm] = useState('');
const [dataVersion, setDataVersion] = useState(0);
const [filterError, setFilterError] = useState('');

const debouncedFilterTerm = useDebounce(filterTerm, 300);

const handleFilterChange = (newTerm) => setFilterTerm(newTerm);

const invalidateCache = useCallback(() => {
  setDataVersion(prev => prev + 1);
}, []);


useEffect(() => {
  if (!token) return; 

  async function fetchTodos() {
    setIsTodoListLoading(true);
    setError('');

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
      setTodoList(data.tasks);
      setFilterError('');


    }  catch (error) {
  if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
    setFilterError(`Error filtering/sorting todos: ${error.message}`);
  } else {
    setError(`Error fetching todos: ${error.message}`);
  }
}
 finally {
      setIsTodoListLoading(false);
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
  setTodoList(prev => [newTodo, ...prev]);

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
    setTodoList(prev =>
      prev.map(todo =>
        todo.id === tempId ? data : todo
      )
    );
    invalidateCache();


  } catch (err) {
    setTodoList(prev => prev.filter(todo => todo.id !== tempId));
    setError(err.message);
  }
}


async function completeTodo(id) {
  //Store the original todo for potential rollback
  const originalTodo = todoList.find(todo => todo.id === id);
  if (!originalTodo) return;

  //Optimistic update
  setTodoList(prev =>
    prev.map(todo =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    )
  );

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

    setTodoList(prev =>
      prev.map(todo =>
        todo.id === id ? data : todo
      )
    );
    invalidateCache();

  } catch (err) {
    //Rollback to original state if the request fails
    setTodoList(prev =>
      prev.map(todo =>
        todo.id === id ? originalTodo : todo
      )
    );
    setError(err.message);
  }
}


async function updateTodo(editTodo) {
  //Store the original todo for potential rollback
  const originalTodo = todoList.find(todo => todo.id === editTodo.id);
  if (!originalTodo) return;

  //Optimistic update
  setTodoList(prev =>
    prev.map(todo =>
      todo.id === editTodo.id
        ? { ...todo, title: editTodo.title }
        : todo
    )
  );


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

    setTodoList(prev =>
      prev.map(todo =>
        todo.id === editTodo.id ? data : todo
      )
    );
    invalidateCache();
  } catch (err) {
    //Rollback si falla
    setTodoList(prev =>
      prev.map(todo =>
        todo.id === editTodo.id ? originalTodo : todo
      )
    );
    setError(err.message);
  }
}




return(
<div>

    {error && (
  <div>
    <p>{error}</p>
    <button onClick={() => setError('')}>Clear Error</button>
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
