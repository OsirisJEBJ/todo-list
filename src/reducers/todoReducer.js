
// 1. Action types
export const TODO_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',

  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',

  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

  SET_SORT: 'SET_SORT',
  SET_FILTER: 'SET_FILTER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
  RESET_FILTERS: 'RESET_FILTERS',
};

// 2. Initial state
export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: false,
  sortBy: 'createdAt',
  sortDirection: 'desc',
  filterTerm: '',
  dataVersion: 0,
};

// 3. Reducer function (obligatoria)
export function todoReducer(state, action) {
    
  switch (action.type) {

    // Fetching todos
    case TODO_ACTIONS.FETCH_START:
     return {
    ...state,
    isTodoListLoading: true,
    error: '',
    filterError: '',
  };

  case TODO_ACTIONS.FETCH_SUCCESS:
  return {
    ...state,
    todoList: action.payload.todos,
    isTodoListLoading: false,
    error: '',
  };

  case TODO_ACTIONS.FETCH_ERROR:
  return {
    ...state,
    isTodoListLoading: false,
    error: action.payload.message,
  };
    // Adding a new todo
    case TODO_ACTIONS.ADD_TODO_START:
      return {
        ...state,   
        todoList: [action.payload.newTodo, ...state.todoList],
        error: '',
        };

    case TODO_ACTIONS.ADD_TODO_SUCCESS:
    return {
        ...state,
        todoList: state.todoList.map(todo => 
          todo.id === action.payload.tempId ? action.payload.data : todo
        ),    
    };

    case TODO_ACTIONS.ADD_TODO_ERROR:
    return {
        ...state,
        todoList: state.todoList.filter(todo => todo.id !== action.payload.tempId),
        error: action.payload.message,
    };

    // Completing a todo
    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
            todo.id === action.payload.id 
            ? { ...todo, isCompleted: true } 
            : todo
        ),
      };

      case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return state; // No state change needed, already updated optimistically

      case TODO_ACTIONS.COMPLETE_TODO_ERROR:
        return {
            ...state,
            todoList: state.todoList.map(todo =>
                todo.id === action.payload.id
                ? { ...todo, isCompleted: false }
                : todo
            ),
            error: action.payload.message,
        };      

    // Updating a todo
    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
            todo.id === action.payload.id
            ? { ...todo, title: action.payload.newTitle }
            : todo
        ),
      };

    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return state; // No state change needed, already updated optimistically

    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
         ...state,
         todoList: state.todoList.map(todo =>
            todo.id === action.payload.id
            ? { ...todo, title: action.payload.originalTitle }
                    : todo
                ),
                error: action.payload.message,
            };
    
    // Sorting and filtering UI actions

    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection,
      };
    
    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filterTerm: action.payload.filterTerm,
      };

    case TODO_ACTIONS.CLEAR_ERROR:
        return {
            ...state,
            error: '',
        };
    
    case TODO_ACTIONS.CLEAR_FILTER_ERROR:
        return {
            ...state,
            filterError: '',
        };
    
    case TODO_ACTIONS.RESET_FILTERS:
        return {
            ...state,
            sortBy: 'creationDate',
            sortDirection: 'desc',
            filterTerm: '',
            filterError: '',
        };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
