// contexts/ProductContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

// Action types
const ProductActionTypes = {
  SET_SELECTED_PRODUCT: 'SET_SELECTED_PRODUCT',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
};

// Initial state
const initialState = {
  selectedProduct: null,
  searchTerm: '',
  filters: {
    status: 'all', // 'all', 'active', 'inactive'
    category: 'all',
    stockStatus: 'all', // 'all', 'inStock', 'outOfStock', 'lowStock'
    sortBy: 'name', // 'name', 'price', 'stock', 'createdAt'
    sortOrder: 'desc', // 'asc', 'desc'
  },
};

// Reducer
const productReducer = (state, action) => {
  switch (action.type) {
    case ProductActionTypes.SET_SELECTED_PRODUCT:
      return {
        ...state,
        selectedProduct: action.payload,
      };
    case ProductActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case ProductActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case ProductActionTypes.RESET_FILTERS:
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
const ProductContext = createContext();

// Provider
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const actions = {
    setSelectedProduct: (product) => {
      dispatch({ type: ProductActionTypes.SET_SELECTED_PRODUCT, payload: product });
    },
    setSearchTerm: (searchTerm) => {
      dispatch({ type: ProductActionTypes.SET_SEARCH_TERM, payload: searchTerm });
    },
    setFilters: (filters) => {
      dispatch({ type: ProductActionTypes.SET_FILTERS, payload: filters });
    },
    resetFilters: () => {
      dispatch({ type: ProductActionTypes.RESET_FILTERS });
    },
  };

  return (
    <ProductContext.Provider value={{ ...state, ...actions }}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};