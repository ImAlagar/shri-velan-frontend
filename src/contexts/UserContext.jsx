// contexts/UserContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

// Action types
const UserActionTypes = {
  SET_SELECTED_USER: 'SET_SELECTED_USER',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
};

// Initial state
const initialState = {
  selectedUser: null,
  searchTerm: '',
  filters: {
    role: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case UserActionTypes.SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload,
      };
    case UserActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case UserActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case UserActionTypes.RESET_FILTERS:
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
const UserContext = createContext();

// Provider
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const actions = {
    setSelectedUser: (user) => {
      dispatch({ type: UserActionTypes.SET_SELECTED_USER, payload: user });
    },
    setSearchTerm: (searchTerm) => {
      dispatch({ type: UserActionTypes.SET_SEARCH_TERM, payload: searchTerm });
    },
    setFilters: (filters) => {
      dispatch({ type: UserActionTypes.SET_FILTERS, payload: filters });
    },
    resetFilters: () => {
      dispatch({ type: UserActionTypes.RESET_FILTERS });
    },
  };

  return (
    <UserContext.Provider value={{ ...state, ...actions }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};