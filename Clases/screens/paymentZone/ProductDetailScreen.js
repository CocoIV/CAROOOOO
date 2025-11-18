import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);

  // Datos de ejemplo, puedes recibirlos por props/route
  const product = {
    name: 'Producto Nombre.',
    price: 2000,
    description: 'Descripción del producto.',
    considerations: 'Consideraciones.\nPlantilla de Sabor U.',
    image: require('../../../assets/favicon.png'), 
  };

  const handleBuy = () => {
    // Navegar a pantalla de doble factor, pasando datos del producto
    navigation.navigate('TwoFactorAuthScreen', {
      product: {
        name: product.name,
        price: product.price,
        description: product.description,
        considerations: product.considerations,
        quantity,
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Go back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNumber}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>C {product.price.toLocaleString()}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción.</Text>
          <Text style={styles.sectionText}>{product.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>{product.considerations}</Text>
        </View>
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.heartBtn}>
            <Text style={styles.heart}>♡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyBtn} onPress={handleBuy}>
            <Text style={styles.buyText}>Comprar.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#5f4bb6',
  },
  header: {
    padding: 10,
    backgroundColor: '#5f4bb6',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: -40,
    zIndex: 2,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    color: '#222',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 20,
    paddingHorizontal: 8,
    marginHorizontal: 10,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    fontSize: 18,
    color: '#5f4bb6',
  },
  qtyNumber: {
    fontSize: 16,
    marginHorizontal: 4,
    color: '#222',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5f4bb6',
    marginLeft: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#5f4bb6',
    marginBottom: 2,
  },
  sectionText: {
    color: '#222',
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  heartBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  heart: {
    fontSize: 22,
    color: '#5f4bb6',
  },
  buyBtn: {
    backgroundColor: '#5f4bb6',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductDetailScreen;
