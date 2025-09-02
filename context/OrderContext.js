import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);

  const API_URL = 'http://localhost:8001/api/orders'; // 👉 Đổi thành IP LAN khi chạy trên thiết bị thật

  // 👉 Load đơn đã thanh toán từ server khi app khởi động
  useEffect(() => {
    const fetchOrdersFromServer = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setPaidOrders(data);
      } catch (error) {
        console.error('❌ Lỗi khi fetch paidOrders từ server:', error);
        // 👉 Nếu server lỗi, dùng bản local (AsyncStorage)
        const stored = await AsyncStorage.getItem('paidOrders');
        if (stored) setPaidOrders(JSON.parse(stored));
      }
    };

    fetchOrdersFromServer();
  }, []);

  // 👉 Gửi đơn mới đã thanh toán lên server
  const markAsPaid = async (paidOrder) => {
    const newOrder = {
      ...paidOrder,
      isNew: true,
    };
  
    try {
      // 👉 Gửi lên server
      const response = await fetch('http://192.168.1.69:8002/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi gửi đơn lên server');
      }
  
      const result = await response.json();
  
      // 👉 Cập nhật local state (để hiển thị ngay trên UI nếu cần)
      const updated = [...paidOrders, result.order];
      setPaidOrders(updated);
  
      // 👉 Lưu vào AsyncStorage để giữ dữ liệu offline
      await AsyncStorage.setItem('paidOrders', JSON.stringify(updated));
  
      console.log('✅ Đã gửi đơn và lưu thành công');
    } catch (error) {
      console.error('❌ Lỗi khi gửi đơn:', error.message);
    }
  };

  // 👉 Đánh dấu 1 đơn đã được xem
  const markAsSeen = async (orderIndex) => {
    const updated = [...paidOrders];
    if (updated[orderIndex]) {
      updated[orderIndex].isNew = false;
      setPaidOrders(updated);
      try {
        await AsyncStorage.setItem('paidOrders', JSON.stringify(updated));
      } catch (error) {
        console.error('❌ Lỗi khi cập nhật local paidOrders:', error);
      }
    }
  };

  const addOrder = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  const deleteOrder = (index) => {
    const updated = [...orders];
    updated.splice(index, 1);
    setOrders(updated);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        paidOrders,
        addOrder,
        deleteOrder,
        markAsPaid,
        markAsSeen,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}