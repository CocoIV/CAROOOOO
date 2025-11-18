import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const AERecorridoOptScreen = () => {
  const [cantidadPedidos, setCantidadPedidos] = useState('');
  const [horarioEntrega, setHorarioEntrega] = useState('');
  const [lugarEntrega, setLugarEntrega] = useState('');
  const [ubicacionConsumidor, setUbicacionConsumidor] = useState('');
  const [capacidadEntrega, setCapacidadEntrega] = useState('');
  const [rutaRecomendada, setRutaRecomendada] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [cambioFecha, setCambioFecha] = useState(false);
  const [mensajeAviso, setMensajeAviso] = useState('');

  const handleOptimizarRuta = () => {
    // Simulación de optimización de ruta
    setRutaRecomendada('Ruta optimizada: Soda Central > Biblioteca > Laboratorio');
  };

  const handleAvisoCambioFecha = () => {
    if (cambioFecha && fechaEntrega) {
      setMensajeAviso('Aviso: La fecha de entrega ha cambiado. Se notificará al menos una hora antes.');
    } else {
      setMensajeAviso('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RF-AE-01-3: Optimización de recorrido de distribución</Text>
      <TextInput style={styles.input} placeholder="Cantidad de pedidos para la ruta" value={cantidadPedidos} onChangeText={setCantidadPedidos} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Horario de entrega" value={horarioEntrega} onChangeText={setHorarioEntrega} />
      <TextInput style={styles.input} placeholder="Lugar de entrega" value={lugarEntrega} onChangeText={setLugarEntrega} />
      <TextInput style={styles.input} placeholder="Ubicación del consumidor" value={ubicacionConsumidor} onChangeText={setUbicacionConsumidor} />
      <TextInput style={styles.input} placeholder="Capacidad de entrega según horario" value={capacidadEntrega} onChangeText={setCapacidadEntrega} />
      <TouchableOpacity style={styles.btn} onPress={handleOptimizarRuta}>
        <Text style={styles.btnText}>Optimizar ruta</Text>
      </TouchableOpacity>
      {rutaRecomendada ? <Text style={styles.success}>{rutaRecomendada}</Text> : null}
      <TextInput style={styles.input} placeholder="Fecha de entrega (YYYY-MM-DD)" value={fechaEntrega} onChangeText={setFechaEntrega} />
      <TouchableOpacity style={styles.btn} onPress={() => { setCambioFecha(true); handleAvisoCambioFecha(); }}>
        <Text style={styles.btnText}>Avisar cambio de fecha</Text>
      </TouchableOpacity>
      {mensajeAviso ? <Text style={styles.warning}>{mensajeAviso}</Text> : null}
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
  warning: { color: 'orange', marginBottom: 10, fontWeight: 'bold' },
});

export default AERecorridoOptScreen;
