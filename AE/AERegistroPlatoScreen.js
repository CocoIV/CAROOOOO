import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../Supabase/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AERegistroPlatoScreen = () => {
  const [nombrePlato, setNombrePlato] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [precio, setPrecio] = useState('');
  const [nutricion, setNutricion] = useState({ grasas: '', proteinas: '', calorias: '', carbohidratos: '' });
  const [disponibilidad, setDisponibilidad] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleRegistrarPlato = async () => {
    setUploading(true);
    try {
      // Obtener el provider_id desde AsyncStorage (o contexto)
      const providerId = await AsyncStorage.getItem('providerId');
      if (!providerId) {
        alert('No se encontró el proveedor.');
        setUploading(false);
        return;
      }
      let imageUrl = null;
      if (image) {
        const fileExt = image.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const response = await fetch(image);
        const blob = await response.blob();
        const { data, error } = await supabase.storage.from('imagenes').upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false,
        });
        if (error) throw error;
        imageUrl = supabase.storage.from('imagenes').getPublicUrl(fileName).publicUrl;
      }
      const { error: insertError } = await supabase.from('dishes').insert([
        {
          provider_id: providerId,
          nombre: nombrePlato,
          ingredientes,
          precio: Number(precio),
          valor_nutricional: {
            grasas: nutricion.grasas,
            proteinas: nutricion.proteinas,
            calorias: nutricion.calorias,
            carbohidratos: nutricion.carbohidratos,
          },
          disponibilidad: disponibilidad === 'true' || disponibilidad === '1',
          is_active: true,
          descripcion: '',
          tipo_alimento: '',
          imagen_url: imageUrl,
        },
      ]);
      if (insertError) throw insertError;
      alert('Plato registrado correctamente.');
      setNombrePlato('');
      setIngredientes('');
      setPrecio('');
      setNutricion({ grasas: '', proteinas: '', calorias: '', carbohidratos: '' });
      setDisponibilidad('');
      setImage(null);
    } catch (e) {
      alert('Error al registrar el plato: ' + e.message);
    }
    setUploading(false);
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
      <TextInput style={styles.input} placeholder="Disponibilidad (true/false)" value={disponibilidad} onChangeText={setDisponibilidad} />
      {/* Imagen del plato */}
      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={styles.btnText}>Seleccionar fotografía</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 150, marginBottom: 10, borderRadius: 8 }} />
      )}
      <TouchableOpacity style={styles.btn} onPress={handleRegistrarPlato} disabled={uploading}>
        <Text style={styles.btnText}>{uploading ? 'Registrando...' : 'Registrar plato'}</Text>
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
