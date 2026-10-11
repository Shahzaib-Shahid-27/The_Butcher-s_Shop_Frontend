import { createContext, useContext, useState, type ReactNode } from 'react';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState([]);
  return <CartContext.Provider value={{ cartItems, setCartItems }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);