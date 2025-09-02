import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';

export default function ProductItem({ name, price, image, description }) {
  const navigation = useNavigation();
  const { addToCart } = useContext(CartContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState('1');

  const handleAddToCart = () => {
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      Alert.alert('Lỗi', 'Số lượng không hợp lệ!');
      return;
    }

    addToCart({ name, price, image, description, quantity: qty });
    setModalVisible(false);
    setQuantity('1');
    Alert.alert('🛒 Thành công', `Đã thêm ${qty} sản phẩm vào giỏ hàng!`);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Chi Tiết', { name, price, image, description })
        }
      >
        <Image source={image} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{price.toLocaleString()}đ</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.orderButton} onPress={() => navigation.navigate('Đặt Hàng', { name, price })}>
          <Text style={styles.orderText}>Đặt hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.orderButton, { backgroundColor: '#2ecc71' }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.orderText}>+ Giỏ</Text>
        </TouchableOpacity>
      </View>

      {/* Modal nhập số lượng */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Nhập số lượng</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
              placeholder="Nhập số lượng"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddToCart}>
                <Text style={styles.modalButtonText}>Thêm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalButtonText, { color: '#333' }]}>Huỷ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 16,
    color: '#e67e22',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    alignItems: 'center',
  },
  orderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 14,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#2ecc71',
    marginHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});