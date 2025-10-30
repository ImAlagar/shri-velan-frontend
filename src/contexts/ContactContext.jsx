// contexts/ContactContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

// Action types
const ContactActionTypes = {
  SET_SELECTED_CONTACT: 'SET_SELECTED_CONTACT',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
};

// Initial state with correct status values
const initialState = {
  selectedContact: null,
  searchTerm: '',
  filters: {
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

// Reducer
const contactReducer = (state, action) => {
  switch (action.type) {
    case ContactActionTypes.SET_SELECTED_CONTACT:
      return {
        ...state,
        selectedContact: action.payload,
      };
    case ContactActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case ContactActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case ContactActionTypes.RESET_FILTERS:
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
const ContactContext = createContext();

// Provider
export const ContactProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  const actions = {
    setSelectedContact: (contact) => {
      dispatch({ type: ContactActionTypes.SET_SELECTED_CONTACT, payload: contact });
    },
    setSearchTerm: (searchTerm) => {
      dispatch({ type: ContactActionTypes.SET_SEARCH_TERM, payload: searchTerm });
    },
    setFilters: (filters) => {
      dispatch({ type: ContactActionTypes.SET_FILTERS, payload: filters });
    },
    resetFilters: () => {
      dispatch({ type: ContactActionTypes.RESET_FILTERS });
    },
  };

  return (
    <ContactContext.Provider value={{ ...state, ...actions }}>
      {children}
    </ContactContext.Provider>
  );
};

// Hook
export const useContactContext = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactContext must be used within a ContactProvider');
  }
  return context;
};