import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CategoryItem from '../components/CategoryItem';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';

const categories = [
  { id: 1, title: 'Đồ uống', image: require('../assets/images/douong_caphesua.jpg') },
  { id: 2, title: 'Bánh Sinh Nhật', image: require('../assets/images/danhmuc_banhsinhnhat.jpg') },
  { id: 3, title: 'Bánh Mỳ', image: require('../assets/images/danhmuc_banhmy.jpg') },
  { id: 4, title: 'Điểm Tâm Châu Âu', image: require('../assets/images/cake4.jpg') },
];

const products = [
  {
    id: 1,
    name: 'Bánh Plan',
    category: 'Điểm Tâm Châu Âu',
    price: 59000,
    brand: 'Paris Gâteaux',
    description: 'Bánh mềm mịn, mát như kem, thơm vị caramel',
    image: require('../assets/images/cake1.jpg'),
  },
  {
    id: 2,
    name: 'Bánh Tiramisu',
    category: 'Bánh Sinh Nhật',
    price: 65000,
    brand: 'Paris Gâteaux',
    description: 'Bánh thơm gato cà phê, phomai mascapone',
    image: require('../assets/images/cake2.jpg'),
  },
  {
    id: 3,
    name: 'Cà Phê Sữa',
    category: 'Đồ uống',
    price: 45000,
    brand: 'Paris Gâteaux',
    description: 'Vị cà phê đặc sản Việt Nam với hạt Robusta.',
    image: require('../assets/images/douong_caphesua.jpg'),
  },
  {
    id: 4,
    name: 'Bánh Mỳ Phomai Ruốc',
    category: 'Bánh Mỳ',
    price: 42000,
    brand: 'Paris Gâteaux',
    description: 'Vỏ giòn thơm, nhân béo bơ, ăn cực đã!',
    image: require('../assets/images/banhmyphomairuoc.jpg'),
  },
  {
    id: 5,
    name: 'Frezee Matcha',
    category: 'Đồ uống',
    price: 42000,
    brand: 'Paris Gâteaux',
    description: 'Matcha cực thơm kết hợp với lớp kem freeze béo ngậy!',
    image: require('../assets/images/douong_matcha.jpg'),
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert('Xác nhận đăng xuất', 'Bạn muốn đăng xuất khỏi ứng dụng?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => logout(navigation),
      },
    ]);
  };

  const renderHeader = () => (
    <>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" style={{ marginRight: 8 }} />
        <TextInput placeholder="Tìm kiếm" style={styles.searchInput} />
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}><Text>🤍 Yêu Thích</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}><Text>🔄 Đã xem</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}><Text>👤 Following</Text></TouchableOpacity>
      </View>

      {/* Banner */}
      <Image source={require('../assets/images/banner.jpg')} style={styles.banner} />

      {/* Danh mục */}
      <Text style={styles.title}>Danh mục</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        renderItem={({ item }) => (
          <CategoryItem
            image={item.image}
            title={item.title}
            onPress={() =>
              navigation.navigate('Danh Mục', {
                category: item.title,
                products,
              })
            }
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        scrollEnabled={false}
      />

      <Text style={styles.title}>Sản phẩm</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            image={item.image}
            brand={item.brand}
            name={item.name}
            price={item.price}
            description={item.description}
            showAddButton={true}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Đăng xuất</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionBtn: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  banner: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});