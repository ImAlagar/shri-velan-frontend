import React, { createContext, useContext, useReducer } from 'react';

// Action types
const ShippingActionTypes = {
  SET_SELECTED_RATE: 'SET_SELECTED_RATE',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_CALCULATED_RATES: 'SET_CALCULATED_RATES',
};

// Initial state
const initialState = {
  selectedRate: null,
  searchTerm: '',
  calculatedRates: null,
  filters: {
    status: 'all', // 'all', 'active', 'inactive'
    type: 'all', // 'all', 'standard', 'express', 'overnight'
    sortBy: 'name', // 'name', 'price', 'deliveryTime'
    sortOrder: 'asc', // 'asc', 'desc'
  },
};

// Reducer
const shippingReducer = (state, action) => {
  switch (action.type) {
    case ShippingActionTypes.SET_SELECTED_RATE:
      return {
        ...state,
        selectedRate: action.payload,
      };
    case ShippingActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case ShippingActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case ShippingActionTypes.SET_CALCULATED_RATES:
      return {
        ...state,
        calculatedRates: action.payload,
      };
    case ShippingActionTypes.RESET_FILTERS:
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
const ShippingContext = createContext();

// Provider
export const ShippingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shippingReducer, initialState);

  const actions = {
    setSelectedRate: (rate) => {
      dispatch({ type: ShippingActionTypes.SET_SELECTED_RATE, payload: rate });
    },
    setSearchTerm: (searchTerm) => {
      dispatch({ type: ShippingActionTypes.SET_SEARCH_TERM, payload: searchTerm });
    },
    setFilters: (filters) => {
      dispatch({ type: ShippingActionTypes.SET_FILTERS, payload: filters });
    },
    setCalculatedRates: (rates) => {
      dispatch({ type: ShippingActionTypes.SET_CALCULATED_RATES, payload: rates });
    },
    resetFilters: () => {
      dispatch({ type: ShippingActionTypes.RESET_FILTERS });
    },
  };

  return (
    <ShippingContext.Provider value={{ ...state, ...actions }}>
      {children}
    </ShippingContext.Provider>
  );
};

// Hook
export const useShippingContext = () => {
  const context = useContext(ShippingContext);
  if (!context) {
    throw new Error('useShippingContext must be used within a ShippingProvider');
  }
  return context;
};