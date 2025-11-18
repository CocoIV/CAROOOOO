import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const categorias = [
  { label: 'Desayuno', value: 'desayuno' },
  { label: 'Almuerzo', value: 'almuerzo' },
  { label: 'Cena', value: 'cena' },
  { label: 'Merienda', value: 'merienda' },
];

const AEActualizarPlatoScreen = () => {
  const [idPlato, setIdPlato] = useState('');
  const [nombrePlato, setNombrePlato] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [precio, setPrecio] = useState('');
  const [nutricion, setNutricion] = useState({ grasas: '', proteinas: '', calorias: '', carbohidratos: '' });
  const [disponibilidad, setDisponibilidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleActualizarPlato = () => {
    // Aquí iría la lógica para actualizar el plato en la base de datos
    setMensaje('Plato actualizado correctamente y registro de cambios guardado.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RF-AE-01-6: Actualización de datos de platos</Text>
      <TextInput style={styles.input} placeholder="ID del plato" value={idPlato} onChangeText={setIdPlato} />
      <TextInput style={styles.input} placeholder="Nuevo nombre" value={nombrePlato} onChangeText={setNombrePlato} />
      <TextInput style={styles.input} placeholder="Nuevos ingredientes" value={ingredientes} onChangeText={setIngredientes} />
      <TextInput style={styles.input} placeholder="Nuevo precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      <View style={styles.pickerBox}>
        <Text style={styles.label}>Nuevo tipo de alimento:</Text>
        <Picker
          selectedValue={categoria}
          style={styles.input}
          onValueChange={setCategoria}
        >
          <Picker.Item label="Selecciona tipo" value="" />
          {categorias.map((cat) => (
            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Información nutricional:</Text>
      <TextInput style={styles.input} placeholder="Grasas" value={nutricion.grasas} onChangeText={v => setNutricion(n => ({ ...n, grasas: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Proteínas" value={nutricion.proteinas} onChangeText={v => setNutricion(n => ({ ...n, proteinas: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Calorías" value={nutricion.calorias} onChangeText={v => setNutricion(n => ({ ...n, calorias: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Carbohidratos" value={nutricion.carbohidratos} onChangeText={v => setNutricion(n => ({ ...n, carbohidratos: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Nueva disponibilidad" value={disponibilidad} onChangeText={setDisponibilidad} />
      <TouchableOpacity style={styles.btn} onPress={handleActualizarPlato}>
        <Text style={styles.btnText}>Actualizar plato</Text>
      </TouchableOpacity>
      {mensaje ? <Text style={styles.success}>{mensaje}</Text> : null}
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
  success: { color: 'green', marginBottom: 10, fontWeight: 'bold' },
});

export default AEActualizarPlatoScreen;
