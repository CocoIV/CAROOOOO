import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const AEInventarioPedidosScreen = () => {
  const [idPlato, setIdPlato] = useState('');
  const [inventario, setInventario] = useState('');
  const [pedidosVinculados, setPedidosVinculados] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleActualizarInventario = () => {
    // Aquí iría la lógica para actualizar inventario y vincular pedidos
    setMensaje('Inventario y pedidos actualizados correctamente.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RF-AE-01-8: Relación entre platos, inventario y pedidos</Text>
      <TextInput style={styles.input} placeholder="ID del plato" value={idPlato} onChangeText={setIdPlato} />
      <TextInput style={styles.input} placeholder="Disponibilidad en inventario" value={inventario} onChangeText={setInventario} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Pedidos vinculados" value={pedidosVinculados} onChangeText={setPedidosVinculados} />
      <TextInput style={styles.input} placeholder="Fecha de entrega (YYYY-MM-DD)" value={fechaEntrega} onChangeText={setFechaEntrega} />
      <TouchableOpacity style={styles.btn} onPress={handleActualizarInventario}>
        <Text style={styles.btnText}>Actualizar inventario y pedidos</Text>
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

export default AEInventarioPedidosScreen;
