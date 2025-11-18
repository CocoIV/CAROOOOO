import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Modal, ScrollView, Animated } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { supabase } from "../../Supabase/supabaseClient";
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useResponsive } from '../hooks/useResponsive';

export default function LoginScreen({ onLogin }) {
  const navigation = useNavigation();
  const responsive = useResponsive();
  const [form, setForm] = useState({ correo_institucional: "", contrasena: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Navegación a registro
  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const correo = form.correo_institucional.trim().toLowerCase();
    const password = form.contrasena;
    if (!correo || !password) {
      setError("Completa todos los campos.");
      setLoading(false);
      return;
    }
    try {
      // Buscar usuario por correo en users
      let { data, error: selectError } = await supabase
        .from('users')
        .select('hashed_password, is_active, is_verified, rol_id')
        .eq('correo_institucional', correo)
        .single();
      console.log('Rol obtenido de users:', data?.rol_id);
      let isProvider = false;
      // Si no existe en users, buscar en providers
      if (selectError || !data) {
        const { data: providerData, error: providerError } = await supabase
          .from('providers')
          .select('contacto, telefono, is_active, cedula, rol_id')
          .or(`contacto.eq.${correo},telefono.eq.${correo}`)
          .single();
        if (providerError || !providerData) {
          setError("Usuario o contraseña incorrectos.");
          setLoading(false);
          return;
        }
        data = providerData;
        isProvider = true;
        console.log('Rol obtenido de providers:', data?.rol_id);
        // Guardar rol proveedor en AsyncStorage
        await AsyncStorage.setItem('userRol', String(data.rol_id || 4));
        // Aquí podrías agregar validación de contraseña para proveedores si la tienes
        if (!data.is_active) {
          setError("Tu cuenta de proveedor está desactivada. Contacta soporte.");
          setLoading(false);
          return;
        }
        // Si tienes contraseña para proveedores, valida aquí
        // Si no, permite acceso solo por contacto/telefono
        setError(null);
        if (onLogin) onLogin();
        navigation.navigate('Welcome');
        setLoading(false);
        return;
      }
      // Validación para usuarios normales
      if (!data.is_active) {
        setError("Tu cuenta está desactivada. Contacta soporte.");
        setLoading(false);
        return;
      }
      if (!data.is_verified) {
        setError("Verifica tu correo antes de iniciar sesión.");
        setLoading(false);
        return;
      }
      // Hashear la contraseña ingresada
      const hashed = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      if (hashed !== data.hashed_password) {
        setError("Usuario o contraseña incorrectos.");
        setLoading(false);
        return;
      }
      // Login exitoso
      setError(null);
      // Guardar rol usuario en AsyncStorage
      await AsyncStorage.setItem('userRol', String(data.rol_id || 1));
      if (onLogin) onLogin();
      navigation.navigate('Welcome');
    } catch (e) {
      setError("Error inesperado. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <View style={[styles.gradient, { paddingHorizontal: responsive.spacing.md }]}> 
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", alignItems: "center", width: '100%' }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.loginContainer, { maxWidth: responsive.maxWidth.md }]}> 
          <View style={[styles.loginCardBetter, {
            paddingVertical: responsive.spacing.xl,
            paddingHorizontal: responsive.spacing.lg,
            borderRadius: responsive.getValue(20, 24, 28),
          }]}> 
            <Text style={[styles.loginTitleBetter, { fontSize: responsive.fontSize.xxl }]}>Bienvenido</Text>
            <Text style={[styles.loginPolicyTextBetter, { marginBottom: responsive.spacing.md }]}>Hola, al iniciar sesión aceptas nuestros <Text style={styles.loginLinkBetter}>Términos y condiciones</Text></Text>
            <View style={[styles.inputGroupBetter, { marginBottom: responsive.spacing.md }]}> 
              <Text style={[styles.inputLabelBetter, { fontSize: responsive.fontSize.sm }]}>Correo institucional</Text>
              <View style={styles.inputIconRowBetter}> 
                <Image source={require("../../assets/email.png")} style={[styles.inputIconBetter, { backgroundColor: 'transparent', borderColor: 'transparent', tintColor: undefined }]} />
                <TextInput
                  style={[styles.inputBetter, { fontSize: responsive.fontSize.md }]}
                  placeholder="correo institucional"
                  placeholderTextColor="#aaa"
                  value={form.correo_institucional}
                  onChangeText={(text) => handleChange("correo_institucional", text)}
                  editable={!loading}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>
            <View style={[styles.inputGroupBetter, { marginBottom: responsive.spacing.md }]}> 
              <Text style={[styles.inputLabelBetter, { fontSize: responsive.fontSize.sm }]}>Password</Text>
              <View style={styles.inputIconRowBetter}> 
                <Image source={require("../../assets/lock.png")} style={[styles.inputIconBetter, { backgroundColor: 'transparent' }]} />
                <TextInput
                  style={[styles.inputBetter, { fontSize: responsive.fontSize.md }]}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  value={form.contrasena}
                  onChangeText={(text) => handleChange("contrasena", text)}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Icon
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={responsive.getValue(20, 24, 26)}
                    color="#bbb"
                    style={{ marginLeft: responsive.spacing.xs }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.loginOptionsRowBetter, { marginBottom: responsive.spacing.md }]}> 
              <TouchableOpacity style={styles.checkboxRowBetter} onPress={() => setRemember((v) => !v)}>
                <View style={[styles.checkboxBetter, remember && styles.checkboxCheckedBetter]}> 
                  {remember && <View style={styles.checkboxInnerBetter} />}
                </View>
                <Text style={[styles.checkboxLabelBetter, { fontSize: responsive.fontSize.sm }]}>Recordar</Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity style={{marginTop: 18, alignSelf: 'center'}} onPress={goToRegister}>
                  <Text style={{color: '#276EF1', fontWeight: 'bold'}}>¿No tienes cuenta? Regístrate aquí</Text>
                </TouchableOpacity>
                <Text style={[styles.forgotLinkBetter, { fontSize: responsive.fontSize.sm }]}> Olvidé mi contraseña</Text>
              </View>
            </View>
            {error && <Text style={[styles.error, { fontSize: responsive.fontSize.sm }]}>{error}</Text>}
            <TouchableOpacity
              style={[styles.buttonBetter, loading && styles.buttonDisabledBetter, {
                paddingVertical: responsive.spacing.md,
                marginTop: responsive.spacing.sm,
              }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.buttonTextBetter, { fontSize: responsive.fontSize.md }]}>Inicia sesión</Text>
              )}
            </TouchableOpacity>
            <Text style={[styles.orTextBetter, { fontSize: responsive.fontSize.lg, marginTop: responsive.spacing.lg }]}>FORO U</Text>
            <Text style={{ 
              textAlign: 'center', 
              color: 'rgba(136, 136, 136, 1)', 
              fontSize: responsive.fontSize.sm, 
              marginBottom: responsive.spacing.md 
            }}>
              Acceso solo con credenciales institucionales.
            </Text>
            {!responsive.isMobile && (
              <View style={styles.illustrationContainerBetter}>
                <Image source={require("../../assets/login-illustration.png")} style={styles.illustrationBetter} resizeMode="contain" />
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  loginCardBetter: {
    width: '92%',
    maxWidth: 370,
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    boxShadow: '0px 8px 18px rgba(0, 122, 255, 0.13)',
    elevation: 10,
    marginTop: 30,
    marginBottom: 30,
  },
  loginTitleBetter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  loginPolicyTextBetter: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 2,
    lineHeight: 22,
  },
  loginLinkBetter: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  loginTabsBetter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    gap: 18,
  },
  loginTabBetter: {
    fontSize: 18,
    color: '#888',
    paddingBottom: 2,
    marginHorizontal: 12,
  },
  loginTabActiveBetter: {
    color: '#007AFF',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    fontWeight: 'bold',
  },
  inputGroupBetter: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabelBetter: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputIconRowBetter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3e8ee',
    marginBottom: 0,
    paddingHorizontal: 10,
    height: 48,
  },
  inputIconBetter: {
    width: 24,
    height: 24,
    marginRight: 10,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  inputBetter: {
    flex: 1,
    fontSize: 17,
    color: '#222',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  eyeIconImgBetter: {
    width: 26,
    height: 26,
    marginLeft: 8,
    tintColor: '#bbb',
  },
  loginOptionsRowBetter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 14,
    marginTop: 2,
  },
  checkboxRowBetter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBetter: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#bbb',
    borderRadius: 5,
    marginRight: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCheckedBetter: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f0ff',
  },
  checkboxInnerBetter: {
    width: 12,
    height: 12,
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  checkboxLabelBetter: {
    fontSize: 14,
    color: '#555',
  },
  forgotLinkBetter: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  buttonBetter: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 122, 255, 0.10)',
    elevation: 2,
  },
  buttonDisabledBetter: {
    backgroundColor: '#a0cfff',
  },
  buttonTextBetter: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  orTextBetter: {
    color: '#888',
    fontSize: 15,
    marginVertical: 12,
    textAlign: 'center',
  },
  socialRowBetter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginBottom: 14,
  },
  socialIconBetter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f2f6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e3e8ee',
  },
  socialIconImgBetter: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  illustrationContainerBetter: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
  },
  illustrationBetter: {
    width: 200,
    height: 80,
    borderRadius: 18,
    marginTop: 8,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginCard: {
    width: '92%',
    maxWidth: 370,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 10,
  },
  inputIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e8ee',
    marginBottom: 0,
    paddingHorizontal: 8,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#007AFF',
  },
  eyeIconImg: {
    width: 22,
    height: 22,
    marginLeft: 6,
    tintColor: '#bbb',
  },
  checkboxChecked: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f0ff',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 2,
  },
  socialIconImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  illustration: {
    width: 180,
    height: 80,
    borderRadius: 18,
    marginTop: 8,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  loginPolicyText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 2,
  },
  loginLink: {
    orText: {
      color: '#888',
      fontSize: 14,
      marginVertical: 10,
      textAlign: 'center',
    },
    socialRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 18,
      marginBottom: 10,
    },
    socialIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: '#f2f6fa',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 6,
      borderWidth: 1,
      borderColor: '#e3e8ee',
    },
    socialIconText: {
      fontSize: 20,
      color: '#007AFF',
      fontWeight: 'bold',
    },
    socialIconImg: {
      width: 22,
      height: 22,
      resizeMode: 'contain',
    },
    illustrationContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 18,
    },
    illustration: {
      width: 180,
      height: 80,
      borderRadius: 18,
      marginTop: 8,
    },
    backgroundColor: 'transparent',
  },
  eyeIcon: {
    fontSize: 20,
    color: '#bbb',
    marginLeft: 8,
    marginRight: 2,
  },
  loginOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    marginTop: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#bbb',
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#555',
  },
  error: {
    color: '#ff3b30',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    boxShadow: '0px 2px 4px rgba(0, 122, 255, 0.10)',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#a0cfff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  orText: {
    color: '#888',
    fontSize: 14,
    marginVertical: 10,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginBottom: 10,
  },
  socialIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f2f6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#e3e8ee',
  },
  socialIconText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
  },
  illustration: {
    width: 180,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e3f0fc',
    opacity: 0.7,
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 55,
    width: '100%',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemSelected: {
    backgroundColor: '#e6f0ff',
  },
  modalItemText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
    lineHeight: 22,
  },
  modalItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});