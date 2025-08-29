import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Service, Cart, CartItem } from '../types';

// Cart actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { service: Service; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { serviceId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart };

// Initial cart state
const initialState: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Cart reducer
const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { service, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.service._id === service._id);

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...state.items];
        const newQuantity = newItems[existingItemIndex].quantity + quantity;
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity,
          estimatedPrice: newQuantity * service.pricePerKg,
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          service,
          quantity,
          estimatedPrice: quantity * service.pricePerKg,
        };
        newItems = [...state.items, newItem];
      }

      const newState = {
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce((total, item) => total + item.estimatedPrice, 0),
      };

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    }

    case 'REMOVE_ITEM': {
      const serviceId = action.payload;
      const newItems = state.items.filter(item => item.service._id !== serviceId);

      const newState = {
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce((total, item) => total + item.estimatedPrice, 0),
      };

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    }

    case 'UPDATE_QUANTITY': {
      const { serviceId, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: serviceId });
      }

      const newItems = state.items.map(item => {
        if (item.service._id === serviceId) {
          return {
            ...item,
            quantity,
            estimatedPrice: quantity * item.service.pricePerKg,
          };
        }
        return item;
      });

      const newState = {
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce((total, item) => total + item.estimatedPrice, 0),
      };

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    }

    case 'CLEAR_CART': {
      const newState = initialState;
      localStorage.removeItem('cart');
      return newState;
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
};

// Cart context interface
interface CartContextType {
  cart: Cart;
  addItem: (service: Service, quantity: number) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (serviceId: string) => number;
  isItemInCart: (serviceId: string) => boolean;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider props
interface CartProviderProps {
  children: ReactNode;
}

// Cart provider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Add item to cart
  const addItem = (service: Service, quantity: number): void => {
    if (quantity <= 0) {
      console.warn('Quantity must be greater than 0');
      return;
    }

    if (quantity < service.minimumQuantity) {
      console.warn(`Minimum quantity for ${service.name} is ${service.minimumQuantity} kg`);
      return;
    }

    if (quantity > service.maximumQuantity) {
      console.warn(`Maximum quantity for ${service.name} is ${service.maximumQuantity} kg`);
      return;
    }

    dispatch({ type: 'ADD_ITEM', payload: { service, quantity } });
  };

  // Remove item from cart
  const removeItem = (serviceId: string): void => {
    dispatch({ type: 'REMOVE_ITEM', payload: serviceId });
  };

  // Update item quantity
  const updateQuantity = (serviceId: string, quantity: number): void => {
    const item = cart.items.find(item => item.service._id === serviceId);
    
    if (!item) {
      console.warn('Item not found in cart');
      return;
    }

    if (quantity > 0) {
      if (quantity < item.service.minimumQuantity) {
        console.warn(`Minimum quantity for ${item.service.name} is ${item.service.minimumQuantity} kg`);
        return;
      }

      if (quantity > item.service.maximumQuantity) {
        console.warn(`Maximum quantity for ${item.service.name} is ${item.service.maximumQuantity} kg`);
        return;
      }
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { serviceId, quantity } });
  };

  // Clear entire cart
  const clearCart = (): void => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Get quantity of specific item in cart
  const getItemQuantity = (serviceId: string): number => {
    const item = cart.items.find(item => item.service._id === serviceId);
    return item ? item.quantity : 0;
  };

  // Check if item is in cart
  const isItemInCart = (serviceId: string): boolean => {
    return cart.items.some(item => item.service._id === serviceId);
  };

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isItemInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;