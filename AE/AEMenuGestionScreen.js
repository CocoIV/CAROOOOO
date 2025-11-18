import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../Supabase/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const menuTypes = [
  { label: 'Desayuno', value: 'desayuno' },
  { label: 'Almuerzo', value: 'almuerzo' },
  { label: 'Cena', value: 'cena' },
  { label: 'Merienda', value: 'merienda' },
];

const AEMenuGestionScreen = () => {
  // Datos del menú
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [vigenciaInicio, setVigenciaInicio] = useState('');
  const [vigenciaFin, setVigenciaFin] = useState('');
  const [platos, setPlatos] = useState([]); // Platos disponibles
  const [platosMenu, setPlatosMenu] = useState([]); // Platos agregados al menú
  const [selectedPlato, setSelectedPlato] = useState('');
  const [cantidadPlato, setCantidadPlato] = useState('');
  const [diaPlato, setDiaPlato] = useState('');
  const [horaPlato, setHoraPlato] = useState('');
  const [tipoAlimentoPlato, setTipoAlimentoPlato] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Obtener platos del proveedor actual
    const fetchPlatos = async () => {
      const providerId = await AsyncStorage.getItem('providerId');
      if (!providerId) return;
      const { data, error } = await supabase
        .from('dishes')
        .select('id, nombre')
        .eq('provider_id', providerId)
        .eq('is_active', true);
      if (!error && data) setPlatos(data);
    };
    fetchPlatos();
  }, []);

  const handleAgregarPlato = () => {
    if (!selectedPlato) return;
    setPlatosMenu([...platosMenu, {
      dish_id: selectedPlato,
      cantidad_disponible: cantidadPlato,
      dia: diaPlato,
      hora: horaPlato,
      tipo_alimento: tipoAlimentoPlato,
    }]);
    setSelectedPlato('');
    setCantidadPlato('');
    setDiaPlato('');
    setHoraPlato('');
    setTipoAlimentoPlato('');
  };

  const handleGuardarMenu = async () => {
    setSaving(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      // 1. Crear menú
      const { data: menuData, error: menuError } = await supabase.from('menus').insert([
        {
          titulo,
          descripcion,
          fecha_inicio: vigenciaInicio,
          fecha_fin: vigenciaFin,
          creado_por: userId,
        }
      ]).select();
      if (menuError || !menuData || !menuData[0]) throw menuError || new Error('No se pudo crear el menú');
      const menuId = menuData[0].id;
      // 2. Asociar platos
      for (const plato of platosMenu) {
        await supabase.from('menu_items').insert([
          {
            menu_id: menuId,
            dish_id: plato.dish_id,
            cantidad_disponible: Number(plato.cantidad_disponible),
            dia: plato.dia,
            hora: plato.hora,
            tipo_alimento: plato.tipo_alimento,
          }
        ]);
      }
      alert('Menú y platos asociados correctamente.');
      setTitulo('');
      setDescripcion('');
      setVigenciaInicio('');
      setVigenciaFin('');
      setPlatosMenu([]);
    } catch (e) {
      alert('Error al guardar el menú: ' + e.message);
    }
    setSaving(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RF-AE-01-2: Gestión de menús saludables</Text>
      <TextInput style={styles.input} placeholder="Título del menú" value={titulo} onChangeText={setTitulo} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
      <Text style={styles.label}>Vigencia del menú:</Text>
      <TextInput style={styles.input} placeholder="Fecha inicio (YYYY-MM-DD)" value={vigenciaInicio} onChangeText={setVigenciaInicio} />
      <TextInput style={styles.input} placeholder="Fecha fin (YYYY-MM-DD)" value={vigenciaFin} onChangeText={setVigenciaFin} />

      <Text style={styles.label}>Agregar platos al menú:</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedPlato}
          style={styles.input}
          onValueChange={setSelectedPlato}
        >
          <Picker.Item label="Selecciona un plato" value="" />
          {platos.map((plato) => (
            <Picker.Item key={plato.id} label={plato.nombre} value={plato.id} />
          ))}
        </Picker>
      </View>
      <TextInput style={styles.input} placeholder="Cantidad disponible" value={cantidadPlato} onChangeText={setCantidadPlato} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Día de venta (YYYY-MM-DD)" value={diaPlato} onChangeText={setDiaPlato} />
      <TextInput style={styles.input} placeholder="Hora de venta (HH:MM)" value={horaPlato} onChangeText={setHoraPlato} />
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={tipoAlimentoPlato}
          style={styles.input}
          onValueChange={setTipoAlimentoPlato}
        >
          <Picker.Item label="Selecciona tipo de alimento" value="" />
          {menuTypes.map((type) => (
            <Picker.Item key={type.value} label={type.label} value={type.value} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleAgregarPlato}>
        <Text style={styles.btnText}>Agregar plato al menú</Text>
      </TouchableOpacity>

      {/* Lista de platos agregados */}
      {platosMenu.length > 0 && (
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.label}>Platos en el menú:</Text>
          <FlatList
            data={platosMenu}
            keyExtractor={(_, idx) => String(idx)}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: '#f5f5f5', borderRadius: 8, padding: 8, marginBottom: 6 }}>
                <Text>Plato ID: {item.dish_id}</Text>
                <Text>Cantidad: {item.cantidad_disponible}</Text>
                <Text>Día: {item.dia}</Text>
                <Text>Hora: {item.hora}</Text>
                <Text>Tipo: {item.tipo_alimento}</Text>
              </View>
            )}
          />
        </View>
      )}

      <TouchableOpacity style={styles.btn} onPress={handleGuardarMenu} disabled={saving}>
        <Text style={styles.btnText}>{saving ? 'Guardando...' : 'Guardar menú y platos'}</Text>
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
