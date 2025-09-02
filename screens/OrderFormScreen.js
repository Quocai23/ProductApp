import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { OrderContext } from '../context/OrderContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function OrderFormScreen() {
  const { addOrder } = useContext(OrderContext);
  const route = useRoute();
  const navigation = useNavigation();

  const { name: productName, price: productPrice, image, description } = route.params || {};
  const { cartItems, total } = route.params || {};

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = () => {
    if (!name || !phone || !address) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }

    let newOrder;

    if (productName) {
      // ✅ Đặt sản phẩm lẻ
      newOrder = {
        customerName: name,
        phone,
        address,
        note,
        product: productName,
        price: productPrice,
        quantity,
        createdAt: new Date().toISOString(),
        items: [],
      };
    } else if (cartItems?.length > 0) {
      // ✅ Đặt từ giỏ hàng
      newOrder = {
        customerName: name,
        phone,
        address,
        note,
        product: 'Giỏ hàng',
        price: total,
        quantity: cartItems.length,
        createdAt: new Date().toISOString(),
        items: cartItems,
      };
    } else {
      Alert.alert('Lỗi', 'Không có sản phẩm để đặt.');
      return;
    }

    addOrder(newOrder);
    Alert.alert('✅ Thành công', `Cảm ơn ${name}, đơn hàng đã được ghi nhận!`);

    // Điều hướng sang màn Đơn Hàng
    navigation.navigate('Tabs', { screen: 'Đơn Hàng' });

    // Reset form
    setName('');
    setPhone('');
    setAddress('');
    setNote('');
    setQuantity(1);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Nút quay lại */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={[styles.label, { fontSize: 18, marginBottom: 10 }]}>
          {productName
            ? `Đặt: ${productName} (${productPrice?.toLocaleString()}đ)`
            : 'Đặt hàng từ giỏ hàng'}
        </Text>

        <Text style={styles.label}>Họ tên *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nguyễn Văn A"
        />

        <Text style={styles.label}>Số điện thoại *</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="0123456789"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Địa chỉ giao hàng *</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Số 123, đường ABC..."
        />

        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={note}
          onChangeText={setNote}
          placeholder="Giao buổi sáng, không gọi trước..."
          multiline
        />

        {/* Hiển thị số lượng nếu là sản phẩm lẻ */}
        {productName && (
          <>
            <Text style={styles.label}>Số lượng *</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity((prev) => prev + 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Đặt hàng</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#e67e22',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  qtyButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  qtyButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
});