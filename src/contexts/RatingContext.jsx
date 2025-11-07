// contexts/RatingContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

// Action types
const RatingActionTypes = {
  SET_SELECTED_RATING: 'SET_SELECTED_RATING',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
};

// Initial state
const initialState = {
  selectedRating: null,
  searchTerm: '',
  filters: {
    approved: 'all', // 'all', 'approved', 'pending'
    rating: 'all', // 'all', '1', '2', '3', '4', '5'
    sortBy: 'createdAt', // 'createdAt', 'rating', 'product'
    sortOrder: 'desc', // 'asc', 'desc'
  },
};

// Reducer
const ratingReducer = (state, action) => {
  switch (action.type) {
    case RatingActionTypes.SET_SELECTED_RATING:
      return {
        ...state,
        selectedRating: action.payload,
      };
    case RatingActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case RatingActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case RatingActionTypes.RESET_FILTERS:
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
const RatingContext = createContext();

// Provider
export const RatingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ratingReducer, initialState);

  const actions = {
    setSelectedRating: (rating) => {
      dispatch({ type: RatingActionTypes.SET_SELECTED_RATING, payload: rating });
    },
    setSearchTerm: (searchTerm) => {
      dispatch({ type: RatingActionTypes.SET_SEARCH_TERM, payload: searchTerm });
    },
    setFilters: (filters) => {
      dispatch({ type: RatingActionTypes.SET_FILTERS, payload: filters });
    },
    resetFilters: () => {
      dispatch({ type: RatingActionTypes.RESET_FILTERS });
    },
  };

  return (
    <RatingContext.Provider value={{ ...state, ...actions }}>
      {children}
    </RatingContext.Provider>
  );
};

// Hook
export const useRatingContext = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRatingContext must be used within a RatingProvider');
  }
  return context;
};