import React, { useContext } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

export default function ProductCard({
  image,
  brand,
  name,
  price,
  description,
  id,
  showAddButton = false,
}) {
  const { addToCart } = useContext(CartContext);
  const navigation = useNavigation();

  const handleAddToCart = () => {
    addToCart({ id, name, price, image, description, quantity: 1 });
    Alert.alert('✅ Đã thêm vào giỏ', `${name} x1`);
  };

  const goToDetail = () => {
    navigation.navigate('Chi Tiết', {
      id,
      name,
      price,
      image,
      description,
    });
  };

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      {/* Bấm ảnh => sang trang chi tiết */}
      <TouchableOpacity onPress={goToDetail}>
        <Image source={image} style={styles.image} />
      </TouchableOpacity>

      <Text style={styles.brand}>{brand}</Text>

      {/* Bấm tên => sang trang chi tiết */}
      <TouchableOpacity onPress={goToDetail}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
      </TouchableOpacity>

      <Text style={styles.price}>{price.toLocaleString()}đ</Text>

      {showAddButton && (
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>+ Thêm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  brand: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#e67e22',
    marginTop: 4,
    fontWeight: '600',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#2ecc71',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});