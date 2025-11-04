import React, { createContext, useContext, useReducer } from 'react';

// Action types
const CouponActionTypes = {
  SET_SELECTED_COUPON: 'SET_SELECTED_COUPON',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
};

// Initial state
const initialState = {
  selectedCoupon: null,
  searchTerm: '',
  filters: {
    status: 'all', // 'all', 'active', 'inactive', 'expired'
    type: 'all', // 'all', 'percentage', 'fixed'
    sortBy: 'createdAt', // 'name', 'code', 'discount', 'createdAt'
    sortOrder: 'desc', // 'asc', 'desc'
  },
};

// Reducer
const couponReducer = (state, action) => {
  switch (action.type) {
    case CouponActionTypes.SET_SELECTED_COUPON:
      return {
        ...state,
        selectedCoupon: action.payload,
      };
    case CouponActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case CouponActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case CouponActionTypes.RESET_FILTERS:
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
const CouponContext = createContext();

// Provider
export const CouponProvider = ({ children }) => {
  const [state, dispatch] = useReducer(couponReducer, initialState);

  const actions = {
    setSelectedCoupon: (coupon) => {
      dispatch({ type: CouponActionTypes.SET_SELECTED_COUPON, payload: coupon });
    },
    setSearchTerm: (searchTerm) => {
      dispatch({ type: CouponActionTypes.SET_SEARCH_TERM, payload: searchTerm });
    },
    setFilters: (filters) => {
      dispatch({ type: CouponActionTypes.SET_FILTERS, payload: filters });
    },
    resetFilters: () => {
      dispatch({ type: CouponActionTypes.RESET_FILTERS });
    },
  };

  return (
    <CouponContext.Provider value={{ ...state, ...actions }}>
      {children}
    </CouponContext.Provider>
  );
};

// Hook
export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponContext must be used within a CouponProvider');
  }
  return context;
};