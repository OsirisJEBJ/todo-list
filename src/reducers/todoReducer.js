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
  sortBy: 'creationDate',
  sortDirection: 'desc',
  filterTerm: '',
  dataVersion: 0,
};

// 3. Reducer function (obligatoria)
export function todoReducer(state, action) {
    
  switch (action.type) {
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
  
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
