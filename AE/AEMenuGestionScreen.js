import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const menuTypes = [
  { label: 'Desayuno', value: 'desayuno' },
  { label: 'Almuerzo', value: 'almuerzo' },
  { label: 'Cena', value: 'cena' },
  { label: 'Merienda', value: 'merienda' },
];

const AEMenuGestionScreen = () => {
  const [descripcion, setDescripcion] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [precio, setPrecio] = useState('');
  const [diaVenta, setDiaVenta] = useState('');
  const [horaVenta, setHoraVenta] = useState('');
  const [horarioEntrega, setHorarioEntrega] = useState('');
  const [tipoAlimento, setTipoAlimento] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [vigenciaInicio, setVigenciaInicio] = useState('');
  const [vigenciaFin, setVigenciaFin] = useState('');
  const [nutricion, setNutricion] = useState({ grasas: '', proteinas: '', calorias: '', carbohidratos: '' });

  const handleGuardarMenu = () => {
    // Aquí iría la lógica para guardar el menú en la base de datos
    alert('Menú guardado correctamente.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RF-AE-01-2: Gestión de menús saludables</Text>
      <TextInput style={styles.input} placeholder="Descripción nutricional" value={descripcion} onChangeText={setDescripcion} />
      <TextInput style={styles.input} placeholder="Ingredientes" value={ingredientes} onChangeText={setIngredientes} />
      <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Cantidad disponible" value={cantidadDisponible} onChangeText={setCantidadDisponible} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Día de venta" value={diaVenta} onChangeText={setDiaVenta} />
      <TextInput style={styles.input} placeholder="Hora de venta" value={horaVenta} onChangeText={setHoraVenta} />
      <TextInput style={styles.input} placeholder="Horario de entrega en campus" value={horarioEntrega} onChangeText={setHorarioEntrega} />
      <View style={styles.pickerBox}>
        <Text style={styles.label}>Tipo de alimento:</Text>
        <Picker
          selectedValue={tipoAlimento}
          style={styles.input}
          onValueChange={setTipoAlimento}
        >
          <Picker.Item label="Selecciona tipo" value="" />
          {menuTypes.map((type) => (
            <Picker.Item key={type.value} label={type.label} value={type.value} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Información nutricional:</Text>
      <TextInput style={styles.input} placeholder="Grasas" value={nutricion.grasas} onChangeText={v => setNutricion(n => ({ ...n, grasas: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Proteínas" value={nutricion.proteinas} onChangeText={v => setNutricion(n => ({ ...n, proteinas: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Calorías" value={nutricion.calorias} onChangeText={v => setNutricion(n => ({ ...n, calorias: v }))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Carbohidratos" value={nutricion.carbohidratos} onChangeText={v => setNutricion(n => ({ ...n, carbohidratos: v }))} keyboardType="numeric" />
      <Text style={styles.label}>Vigencia del menú:</Text>
      <TextInput style={styles.input} placeholder="Fecha inicio (YYYY-MM-DD)" value={vigenciaInicio} onChangeText={setVigenciaInicio} />
      <TextInput style={styles.input} placeholder="Fecha fin (YYYY-MM-DD)" value={vigenciaFin} onChangeText={setVigenciaFin} />
      <TouchableOpacity style={styles.btn} onPress={handleGuardarMenu}>
        <Text style={styles.btnText}>Guardar menú</Text>
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
  pickerBox: { marginBottom: 10 },
});

export default AEMenuGestionScreen;
