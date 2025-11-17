// src/contexts/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      const parsed = stored ? JSON.parse(stored) : [];
      // Ensure we always return an array
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  // Save to localStorage and notify on cart change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // Calculate cart totals with safety checks
  const getCartTotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    
    return cartItems.reduce((total, item) => {
      const price = Number(item?.offerPrice) || Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    // Add safety checks
    if (!Array.isArray(cartItems)) {
      console.warn('cartItems is not an array:', cartItems);
      return 0;
    }
    
    return cartItems.reduce((total, item) => {
      const quantity = Number(item?.quantity) || 0;
      return total + quantity;
    }, 0);
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      // Ensure prev is always an array
      const previousItems = Array.isArray(prev) ? prev : [];
      
      const exists = previousItems.find((item) => item.id === product.id);
      if (exists) {
        return previousItems.map((item) =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + (Number(product.quantity) || 1) 
              }
            : item
        );
      }
      return [...previousItems, { 
        ...product, 
        quantity: Number(product.quantity) || 1,
        // Ensure all required fields are present
        price: product.offerPrice || product.price,
        inStock: product.stock > 0
      }];
    });
  };

  const updateQuantity = (id, quantity) => {
    const numQuantity = Number(quantity);
    if (numQuantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCartItems((prev) => {
      const previousItems = Array.isArray(prev) ? prev : [];
      return previousItems.map((item) =>
        item.id === id ? { ...item, quantity: numQuantity } : item
      );
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const previousItems = Array.isArray(prev) ? prev : [];
      return previousItems.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (id) => {
    return Array.isArray(cartItems) && cartItems.some(item => item.id === id);
  };

  const getItemQuantity = (id) => {
    if (!Array.isArray(cartItems)) return 0;
    const item = cartItems.find(item => item.id === id);
    return item ? Number(item.quantity) || 0 : 0;
  };

  const getSafeItems = (items) => {
    if (!Array.isArray(items)) return [];
    
    return items.map(item => ({
      id: item.id || '',
      name: item.name || 'Unknown Product',
      price: item.price || 0,
      offerPrice: item.offerPrice || item.price || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || item.images?.[0] || '/images/placeholder.jpg',
      stock: item.stock || 0,
      inStock: item.inStock !== false,
      weight: item.weight || '1kg',
      category: item.category || 'Uncategorized'
    }));
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems: Array.isArray(cartItems) ? cartItems : [],
        addToCart,
        getSafeItems,
        updateQuantity,
        removeFromCart,
        clearCart,
        isInCart,
        getItemQuantity,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};