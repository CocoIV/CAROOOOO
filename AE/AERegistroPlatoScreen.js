import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const AERegistroPlatoScreen = () => {
  const [nombrePlato, setNombrePlato] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [precio, setPrecio] = useState('');
  const [nutricion, setNutricion] = useState({ grasas: '', proteinas: '', calorias: '', carbohidratos: '' });
  const [disponibilidad, setDisponibilidad] = useState('');

  const handleRegistrarPlato = () => {
    // Aquí iría la lógica para guardar el plato en la base de datos
    alert('Plato registrado correctamente.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RF-AE-01-4: Registro de platos ofrecidos</Text>
      <TextInput style={styles.input} placeholder="Nombre del plato" value={nombrePlato} onChangeText={setNombrePlato} />
      <TextInput style={styles.input} placeholder="Ingredientes" value={ingredientes} onChangeText={setIngredientes} />
      <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      <Text style={styles.label}>Información nutricional:</Text>
      <TextInput style={styles.input} placeholder="Grasas" value={nutricion.grasas} onChangeText={v => setNutricion(n => ({ ...n, grasas: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Proteínas" value={nutricion.proteinas} onChangeText={v => setNutricion(n => ({ ...n, proteinas: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Calorías" value={nutricion.calorias} onChangeText={v => setNutricion(n => ({ ...n, calorias: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Carbohidratos" value={nutricion.carbohidratos} onChangeText={v => setNutricion(n => ({ ...n, carbohidratos: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Disponibilidad" value={disponibilidad} onChangeText={setDisponibilidad} />
      <TouchableOpacity style={styles.btn} onPress={handleRegistrarPlato}>
        <Text style={styles.btnText}>Registrar plato</Text>
      </TouchableOpacity>
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
});

export default AERegistroPlatoScreen;
