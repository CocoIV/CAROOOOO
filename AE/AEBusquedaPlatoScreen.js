import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const categorias = [
  { label: 'Desayuno', value: 'desayuno' },
  { label: 'Almuerzo', value: 'almuerzo' },
  { label: 'Cena', value: 'cena' },
  { label: 'Merienda', value: 'merienda' },
];

const AEBusquedaPlatoScreen = () => {
  const [idPlato, setIdPlato] = useState('');
  const [nombrePlato, setNombrePlato] = useState('');
  const [categoria, setCategoria] = useState('');
  const [resultados, setResultados] = useState([]);

  const handleBuscarPlato = () => {
    // Aquí iría la lógica para buscar platos en la base de datos
    // Simulación de resultados
    setResultados([
      { id: '1', nombre: 'Ensalada UCR', categoria: 'desayuno' },
      { id: '2', nombre: 'Arroz con pollo', categoria: 'almuerzo' },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RF-AE-01-5: Búsqueda de platos registrados</Text>
      <TextInput style={styles.input} placeholder="ID del plato" value={idPlato} onChangeText={setIdPlato} />
      <TextInput style={styles.input} placeholder="Nombre del plato" value={nombrePlato} onChangeText={setNombrePlato} />
      <View style={styles.pickerBox}>
        <Text style={styles.label}>Categoría del alimento:</Text>
        <Picker
          selectedValue={categoria}
          style={styles.input}
          onValueChange={setCategoria}
        >
          <Picker.Item label="Selecciona categoría" value="" />
          {categorias.map((cat) => (
            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleBuscarPlato}>
        <Text style={styles.btnText}>Buscar plato</Text>
      </TouchableOpacity>
      {resultados.length > 0 && (
        <View style={styles.resultBox}>
          <Text style={styles.label}>Resultados:</Text>
          {resultados.map((plato) => (
            <View key={plato.id} style={styles.resultItem}>
              <Text style={styles.resultText}>ID: {plato.id}</Text>
              <Text style={styles.resultText}>Nombre: {plato.nombre}</Text>
              <Text style={styles.resultText}>Categoría: {plato.categoria}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#1976D2' },
  input: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 10, marginBottom: 10 },
  btn: { backgroundColor: '#1976D2', borderRadius: 8, padding: 12, alignItems: 'center', marginVertical: 8 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#1976D2' },
  pickerBox: { marginBottom: 10 },
  resultBox: { marginTop: 16 },
  resultItem: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 10, marginBottom: 8 },
  resultText: { fontSize: 15, color: '#222' },
});

export default AEBusquedaPlatoScreen;
