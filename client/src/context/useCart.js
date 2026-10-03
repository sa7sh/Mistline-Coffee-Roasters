import { createContext, useContext } from "react";

const CartContext = createContext(null);

function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return cart;
}

export { CartContext, useCart };
