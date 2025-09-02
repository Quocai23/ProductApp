import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    if (!product?.name || !product?.price) {
      console.warn('❗️ Sản phẩm không hợp lệ:', product);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id); // ✅ So sánh theo id

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + (product.quantity || 1), // ✅ Cộng đúng số lượng
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: product.quantity || 1,
          id: product.id || Date.now(), // ✅ Đảm bảo luôn có id
        },
      ];
    });
  };

  // Xoá sản phẩm theo ID
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Xoá toàn bộ giỏ hàng
  const clearCart = () => setCartItems([]);

  // Cập nhật số lượng theo ID
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}