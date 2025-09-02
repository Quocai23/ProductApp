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
  TouchableOpacity,
} from 'react-native';
import { OrderContext } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';

export default function PaidOrdersScreen() {
  const { paidOrders, markAsSeen } = useContext(OrderContext);
  const { currentUser } = useContext(AuthContext);
  const [searchDate, setSearchDate] = useState('');

  const filteredPaidOrders = searchDate
    ? paidOrders.filter((order) =>
        new Date(order.createdAt).toLocaleDateString('vi-VN').includes(searchDate)
      )
    : paidOrders;

  const isManagerOrAdmin =
    currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TextInput
        placeholder="Lọc theo ngày (VD: 12/07/2025)"
        style={styles.searchInput}
        value={searchDate}
        onChangeText={setSearchDate}
      />

      {filteredPaidOrders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Không có đơn hàng đã thanh toán.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPaidOrders}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const total = item.items.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            );

            return (
              <View style={styles.card}>
                <Text style={styles.title}>
                  ✅ Đã thanh toán {item.isNew && <Text style={styles.new}>🆕</Text>}
                </Text>

                <Text>Khách hàng: {item.customerName}</Text>
                <Text>Điện thoại: {item.phone}</Text>
                <Text>Địa chỉ: {item.address}</Text>
                <Text>Ghi chú: {item.note || 'Không có'}</Text>

                <Text style={{ marginTop: 8, fontWeight: 'bold' }}>Sản phẩm:</Text>
                {item.items.map((i, idx) => (
                  <Text key={idx}>
                    - {i.name} x {i.quantity} = {(i.price * i.quantity).toLocaleString()}đ
                  </Text>
                ))}

                <Text style={styles.total}>
                  👉 Tổng tiền: {total.toLocaleString()}đ
                </Text>
                <Text style={styles.time}>
                  🕒 {new Date(item.paidAt || item.createdAt).toLocaleString()}
                </Text>
                <Text style={styles.payment}>
                  💳 Hình thức: {item.paidMethod}
                </Text>
                {item.createdBy && (
                  <Text style={styles.createdBy}>👤 Nhân viên: {item.createdBy}</Text>
                )}

                {/* ✅ Nút đánh dấu đã xem cho Admin / Manager nếu đơn còn mới */}
                {isManagerOrAdmin && item.isNew && (
                  <TouchableOpacity
                    onPress={() => markAsSeen(index)}
                    style={styles.seenBtn}
                  >
                    <Text style={styles.seenText}>👀 Đánh dấu đã xem</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      )}
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
  card: {
    backgroundColor: '#fefefe',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 6,
    color: '#27ae60',
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
  payment: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#2980b9',
  },
  createdBy: {
    marginTop: 6,
    color: '#8e44ad',
    fontSize: 13,
  },
  new: {
    fontSize: 14,
    color: '#e74c3c',
    marginLeft: 4,
  },
  seenBtn: {
    marginTop: 10,
    backgroundColor: '#dfe6e9',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  seenText: {
    fontSize: 14,
    color: '#2d3436',
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