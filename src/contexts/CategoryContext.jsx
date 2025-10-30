// context/CategoryContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

// Action types
const CategoryActionTypes = {
  SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
};

// Initial state
const initialState = {
  selectedCategory: null,
  searchTerm: '',
  filters: {
    status: 'all', // 'all', 'active', 'inactive'
    sortBy: 'name', // 'name', 'products', 'createdAt'
    sortOrder: 'asc', // 'asc', 'desc'
  },
};

// Reducer
const categoryReducer = (state, action) => {
  switch (action.type) {
    case CategoryActionTypes.SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };
    case CategoryActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case CategoryActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case CategoryActionTypes.RESET_FILTERS:
      return {
        ...state,
        searchTerm: '',
        filters: initialState.filters,
      };
    default:
      return state;
  }
};

// Context
const CategoryContext = createContext();

// Provider
export const CategoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  const actions = {
    setSelectedCategory: (category) => {
      dispatch({ type: CategoryActionTypes.SET_SELECTED_CATEGORY, payload: category });
    },
    setSearchTerm: (searchTerm) => {
      dispatch({ type: CategoryActionTypes.SET_SEARCH_TERM, payload: searchTerm });
    },
    setFilters: (filters) => {
      dispatch({ type: CategoryActionTypes.SET_FILTERS, payload: filters });
    },
    resetFilters: () => {
      dispatch({ type: CategoryActionTypes.RESET_FILTERS });
    },
  };

  return (
    <CategoryContext.Provider value={{ ...state, ...actions }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook
export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};