import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { OrderContext } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';

export default function OrderListScreen() {
  const { orders, deleteOrder, markAsPaid } = useContext(OrderContext);
  const { user } = useContext(AuthContext); // ✅ Lấy tài khoản đăng nhập
  const [searchDate, setSearchDate] = useState('');

  // 👉 Lọc đơn hàng theo ngày (dd/mm/yyyy)
  const filteredOrders = searchDate
    ? orders.filter((order) =>
        new Date(order.createdAt).toLocaleDateString('vi-VN').includes(searchDate)
      )
    : orders;

  // 👉 Xử lý thanh toán đơn hàng
  const handleCheckout = (order, index, method) => {
    Alert.alert('🎉 Thanh toán thành công', `Phương thức: ${method}`, [
      {
        text: 'OK',
        onPress: () => {
          const paidOrder = {
            ...order,
            paidMethod: method,
            paidAt: new Date(),
            createdBy: user?.username || 'unknown', // ✅ Ghi lại ai tạo đơn
          };
          markAsPaid(paidOrder);     // ✅ Lưu vào danh sách đơn đã thanh toán
          deleteOrder(index);        // ✅ Xoá khỏi đơn chờ thanh toán
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Lọc theo ngày (VD: 11/07/2025)"
          style={styles.searchInput}
          value={searchDate}
          onChangeText={setSearchDate}
        />

        {filteredOrders.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Không tìm thấy đơn hàng.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <OrderCard
                order={item}
                onDelete={() => deleteOrder(index)}
                onCheckout={(method) => handleCheckout(item, index, method)}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    margin: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
  },
});