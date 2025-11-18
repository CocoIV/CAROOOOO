import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../Supabase/supabaseClient';

const categorias = [
  { key: 'saludable', label: 'Saludable.' },
  { key: 'dulce', label: 'Dulce.' },
  { key: 'cena', label: 'Cena.' },
  { key: 'cerca', label: 'Cerca tuyo.' },
];

const comidasRecomendadas = [
  {
    nombre: 'Combo de frutas',
    precio: 'C. 2500',
    imagen: require('../../assets/avatar1.png'),
  },
  {
    nombre: 'Mega frutal',
    precio: 'C. 3700',
    imagen: require('../../assets/avatar2.png'),
  },
];

const saludables = [
  {
    nombre: 'Ensalada de Quinoa',
    precio: 'C. 3100',
    imagen: require('../../assets/avatar3.png'),
  },
  {
    nombre: 'Ensalada tropical',
    precio: 'C. 1500',
    imagen: require('../../assets/avatar4.png'),
  },
];

const filtros = [
  { key: 'tienda', label: 'Por Tienda.' },
  { key: 'menu', label: 'Por menú.' },
  { key: 'baratos', label: 'Más baratos.' },
  { key: 'caros', label: 'Más caros.' },
];

export default function HomeScreen({ navigation }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('saludable');
  const [showFiltros, setShowFiltros] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState('tienda');

  useEffect(() => {
    const fetchNombre = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const { data } = await supabase
          .from('users')
          .select('nombre_completo')
          .eq('id', userId)
          .single();
        if (data && data.nombre_completo) {
          setNombreCompleto(data.nombre_completo);
        }
      }
    };
    fetchNombre();
  }, []);

  // Función para cerrar sesión completamente
  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView style={styles.container} scrollEnabled={!showFiltros}>
      <View style={styles.headerRow}>
        {/* Perfil (usuario) */}
        <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('ProfileIntro')}>
          <Image source={require('../../assets/avatar1.png')} style={styles.headerIcon} />
        </TouchableOpacity>
        {/* Menú hamburguesa */}
        <TouchableOpacity style={styles.menuIcon}>
          <Image source={require('../../assets/login-illustration.png')} style={styles.headerIcon} />
        </TouchableOpacity>
        {/* Carrito */}
        <TouchableOpacity style={styles.cartIcon}>
          <Image source={require('../../assets/favicon.png')} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.saludo}>Hola {nombreCompleto || ''}, ¿Qué tal?</Text>
      <TouchableOpacity style={{alignSelf: 'flex-end', marginBottom: 8}} onPress={handleLogout}>
        <Text style={{color: '#6C63FF', fontWeight: 'bold'}}>Cerrar sesión</Text>
      </TouchableOpacity>
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Image source={require('../../assets/eye.png')} style={styles.searchIconLeft} />
          <TextInput style={styles.searchInput} placeholder="Buscar." placeholderTextColor="#bdbdbd" />
        </View>
        <TouchableOpacity style={styles.filterIconWrap} onPress={() => setShowFiltros(true)}>
          <Image source={require('../../assets/lock.png')} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
      {showFiltros && (
        <View style={styles.filtrosModalContainer}>
          <View style={styles.filtrosModalBar}>
            <Text style={styles.filtrosBrand}>Sabor U</Text>
            <Text style={styles.filtrosTitle}>Filtros</Text>
            <TouchableOpacity style={styles.filtrosCloseBtn} onPress={() => setShowFiltros(false)}>
              <Text style={styles.filtrosCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filtrosModalContent}>
            {filtros.map((filtro) => (
              <TouchableOpacity
                key={filtro.key}
                style={filtroActivo === filtro.key ? styles.filtroBtnActive : styles.filtroBtn}
                activeOpacity={0.8}
                onPress={() => {
                  setFiltroActivo(filtro.key);
                  if (filtro.key === 'tienda') {
                    setShowFiltros(false);
                    navigation.navigate('TiendasScreen');
                  }
                }}
              >
                <Text style={filtroActivo === filtro.key ? styles.filtroTextActive : styles.filtroText}>{filtro.label}</Text>
                {filtroActivo === filtro.key && <Text style={styles.filtroCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <Text style={styles.sectionTitle}>Comidas recomendadas.</Text>
      <View style={styles.cardsRow}>
        {comidasRecomendadas.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Image source={item.imagen} style={styles.cardImage} />
            <Text style={styles.cardTitle}>Sabor U</Text>
            <Text style={styles.cardDesc}>{item.nombre}</Text>
            <Text style={styles.cardPrice}>{item.precio}</Text>
            <TouchableOpacity style={styles.cardAddBtn}>
              <Text style={styles.cardAddText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardHeart}>
              <Text style={styles.cardHeartText}>♡</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Saludable.</Text>
      <ScrollView style={{marginBottom: 10}} horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoriesRow}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={styles.categoryWrap}
              activeOpacity={0.7}
              onPress={() => setCategoriaActiva(cat.key)}
            >
              <Text style={cat.key === categoriaActiva ? styles.categoryActive : styles.category}>{cat.label}</Text>
              {cat.key === categoriaActiva && <View style={styles.categoryUnderline} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.cardsRow, { marginBottom: 48 }]}>
        {saludables.map((item, idx) => (
          <View key={idx} style={[styles.card, styles.cardSaludable, idx === 1 && styles.cardSaludableAlt]}>
            <Image source={item.imagen} style={styles.cardImage} />
            <Text style={styles.cardTitle}>Sabor U</Text>
            <Text style={styles.cardDesc}>{item.nombre}</Text>
            <Text style={styles.cardPrice}>{item.precio}</Text>
            <TouchableOpacity style={styles.cardAddBtn}>
              <Text style={styles.cardAddText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardHeart}>
              <Text style={styles.cardHeartText}>♡</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileIcon: {
    marginRight: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ede7f6',
  },
  saludo: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 22,
    color: '#222',
    marginLeft: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 28,
    gap: 12,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7fa',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIconLeft: {
    width: 22,
    height: 22,
    marginRight: 8,
    tintColor: '#bdbdbd',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
  },
  filterIconWrap: {
    backgroundColor: '#ede7f6',
    borderRadius: 14,
    padding: 8,
  },
  filterIcon: {
    width: 22,
    height: 22,
    tintColor: '#7c4dff',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 16,
    color: '#222',
    marginLeft: 2,
  },
  cardsRow: {
    flexDirection: 'row',
    marginBottom: 28,
    gap: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    width: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  cardSaludable: {
    backgroundColor: '#f9fbe7',
  },
  cardSaludableAlt: {
    backgroundColor: '#fce4ec',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1976D2',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardPrice: {
    fontSize: 16,
    color: '#ff9800',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardAddBtn: {
    backgroundColor: '#ede7f6',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  cardAddText: {
    fontSize: 20,
    color: '#7c4dff',
    fontWeight: 'bold',
  },
  cardHeart: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'transparent',
  },
  cardHeartText: {
    fontSize: 18,
    color: '#d1c4e9',
  },
  categoriesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 18,
    marginLeft: 2,
  },
  categoryWrap: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 18,
  },
  categoryActive: {
    fontSize: 20,
    color: '#222',
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  categoryUnderline: {
    height: 4,
    width: 34,
    backgroundColor: '#ff9800',
    borderRadius: 2,
    marginTop: 4,
  },
  category: {
    fontSize: 18,
    color: '#bdbdbd',
    marginRight: 18,
    fontWeight: '500',
  },
  filtrosModalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '25%', // más arriba
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingBottom: 18,
    zIndex: 99,
    width: '100%',
    minHeight: 260,
    shadowColor: 'transparent',
    elevation: 0,
  },
  filtrosModalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
    width: '100%',
  },
  filtrosBrand: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginRight: 10,
    minWidth: 70,
    textAlign: 'left',
  },
  filtrosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40,
  },
  filtrosCloseBtn: {
    padding: 6,
    minWidth: 30,
    alignItems: 'flex-end',
  },
  filtrosCloseText: {
    fontSize: 22,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  filtrosModalContent: {
    width: '100%',
    paddingHorizontal: 18,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroBtn: {
    width: '100%',
    backgroundColor: '#f7f7fa',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filtroBtnActive: {
    width: '100%',
    backgroundColor: '#a18aff',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filtroText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  filtroTextActive: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  filtroCheck: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
