import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { CartContext } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigation = useNavigation();

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedItems = cartItems.filter((item) => selectedIds.includes(item.id));
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Chọn sản phẩm', 'Vui lòng chọn ít nhất một sản phẩm để đặt hàng.');
      return;
    }
    navigation.navigate('Đặt Hàng', {
      cartItems: selectedItems,
      total: selectedTotal,
    });
  };

  const renderItem = ({ item }) => {
    if (!item.id) return null; // Bỏ qua item không có id để tránh lỗi
    const isSelected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity style={styles.item} onPress={() => toggleSelect(item.id)}>
        <Ionicons
          name={isSelected ? 'checkbox-outline' : 'square-outline'}
          size={24}
          color={isSelected ? '#e67e22' : '#ccc'}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {item.name} (x{item.quantity})
          </Text>
          <Text style={styles.price}>
            {(item.price * item.quantity).toLocaleString()}đ
          </Text>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Ionicons name="trash" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>🛒 Giỏ Hàng</Text>

        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>Giỏ hàng đang trống.</Text>}
          contentContainerStyle={{ paddingBottom: 24 }}
        />

        {cartItems.length > 0 && (
          <>
            <Text style={styles.total}>
              Tổng ({selectedItems.length} món): {selectedTotal.toLocaleString()}đ
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleCheckout}>
              <Text style={styles.buttonText}>Tiến hành đặt hàng</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    color: '#e67e22',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'right',
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});