import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function OrderCard({ order, onDelete, onCheckout }) {
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    Alert.alert(
      'Chọn hình thức thanh toán',
      'Bạn muốn thanh toán bằng hình thức nào?',
      [
        {
          text: '💵 Tiền mặt',
          onPress: () => onCheckout('Tiền mặt'),
        },
        {
          text: '🏦 Chuyển khoản',
          onPress: () => onCheckout('Chuyển khoản'),
        },
        {
          text: 'Huỷ',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🧾 Giỏ hàng</Text>
      <Text>Khách hàng: {order.customerName}</Text>
      <Text>Điện thoại: {order.phone}</Text>
      <Text>Địa chỉ: {order.address}</Text>
      <Text>Ghi chú: {order.note || 'Không có'}</Text>

      <Text style={{ marginTop: 8, fontWeight: 'bold' }}>Sản phẩm:</Text>
      {order.items.map((item, index) => (
        <Text key={index}>
          - {item.name} x {item.quantity} = {(item.price * item.quantity).toLocaleString()}đ
        </Text>
      ))}

      <Text style={styles.total}>👉 Tổng thanh toán: {totalAmount.toLocaleString()}đ</Text>
      <Text style={styles.time}>🕒 {new Date(order.createdAt).toLocaleString()}</Text>

      {/* Nút thanh toán */}
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutText}>💳 Thanh toán đơn này</Text>
      </TouchableOpacity>

      {/* Nút xoá */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá đơn hàng này?', [
            { text: 'Huỷ', style: 'cancel' },
            { text: 'Xoá', onPress: onDelete, style: 'destructive' },
          ])
        }
      >
        <Text style={styles.deleteText}>🗑️ Xoá đơn hàng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 6,
    color: '#e67e22',
  },
  total: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#e67e22',
  },
  time: {
    marginTop: 6,
    fontSize: 12,
    color: '#777',
  },
  checkoutButton: {
    marginTop: 12,
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});