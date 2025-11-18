import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const AEDarBajaPlatoScreen = () => {
  const [idPlato, setIdPlato] = useState('');
  const [motivoBaja, setMotivoBaja] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleDarBajaPlato = () => {
    // Aquí iría la lógica para dar de baja el plato en la base de datos
    setMensaje('Plato dado de baja correctamente y registro guardado.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RF-AE-01-7: Dar de baja platos ofrecidos</Text>
      <TextInput style={styles.input} placeholder="ID del plato" value={idPlato} onChangeText={setIdPlato} />
      <TextInput style={styles.input} placeholder="Motivo de baja" value={motivoBaja} onChangeText={setMotivoBaja} />
      <TouchableOpacity style={styles.btn} onPress={handleDarBajaPlato}>
        <Text style={styles.btnText}>Dar de baja plato</Text>
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
  success: { color: 'green', marginBottom: 10, fontWeight: 'bold' },
});

export default AEDarBajaPlatoScreen;
