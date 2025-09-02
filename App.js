import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { CartProvider } from './context/CartContext';

import LoginScreen from './screens/LoginScreen';
import TabNavigator from './navigation/TabNavigator';
import ProductDetailScreen from './screens/ProductDetailScreen';
import OrderFormScreen from './screens/OrderFormScreen';
import CategoryScreen from './screens/CategoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* ✅ Màn hình đăng nhập */}
              <Stack.Screen name="Login" component={LoginScreen} />

              {/* Tab chính gồm: Home, Giỏ hàng, Đơn hàng, Lịch sử */}
              <Stack.Screen name="Tabs" component={TabNavigator} />

              {/* Các màn hình chi tiết */}
              <Stack.Screen name="Chi Tiết" component={ProductDetailScreen} />
              <Stack.Screen name="Đặt Hàng" component={OrderFormScreen} />
              <Stack.Screen name="Danh Mục" component={CategoryScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}