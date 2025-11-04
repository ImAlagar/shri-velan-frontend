import React, { createContext, useContext, useReducer } from 'react';

// Action types
const OrderActionTypes = {
  SET_SELECTED_ORDER: 'SET_SELECTED_ORDER',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_TRACKING_DATA: 'SET_TRACKING_DATA',
  SET_TRACKING_LOADING: 'SET_TRACKING_LOADING',
};

// Initial state
const initialState = {
  selectedOrder: null,
  searchTerm: '',
  filters: {
    status: 'all',
    paymentStatus: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  trackingData: null,
  trackingLoading: false,
};

// Reducer
const orderReducer = (state, action) => {
  switch (action.type) {
    case OrderActionTypes.SET_SELECTED_ORDER:
      return {
        ...state,
        selectedOrder: action.payload,
      };
    case OrderActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case OrderActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case OrderActionTypes.RESET_FILTERS:
      return {
        ...state,
        searchTerm: '',
        filters: initialState.filters,
      };
    case OrderActionTypes.SET_TRACKING_DATA:
      return {
        ...state,
        trackingData: action.payload,
      };
    case OrderActionTypes.SET_TRACKING_LOADING:
      return {
        ...state,
        trackingLoading: action.payload,
      };
    default:
      return state;
  }
};

// Context
const OrderContext = createContext();

// Provider
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const actions = {
    setSelectedOrder: (order) => {
      dispatch({ type: OrderActionTypes.SET_SELECTED_ORDER, payload: order });
    },
    setSearchTerm: (searchTerm) => {
      dispatch({ type: OrderActionTypes.SET_SEARCH_TERM, payload: searchTerm });
    },
    setFilters: (filters) => {
      dispatch({ type: OrderActionTypes.SET_FILTERS, payload: filters });
    },
    resetFilters: () => {
      dispatch({ type: OrderActionTypes.RESET_FILTERS });
    },
    setTrackingData: (trackingData) => {
      dispatch({ type: OrderActionTypes.SET_TRACKING_DATA, payload: trackingData });
    },
    setTrackingLoading: (loading) => {
      dispatch({ type: OrderActionTypes.SET_TRACKING_LOADING, payload: loading });
    },
  };

  return (
    <OrderContext.Provider value={{ ...state, ...actions }}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook
export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within a OrderProvider');
  }
  return context;
};