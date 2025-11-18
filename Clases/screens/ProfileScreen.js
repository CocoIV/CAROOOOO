import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, 
  TextInput, FlatList 
} from "react-native";
import AEModuleButton from '../../AE/AEModuleButton';
import { Picker } from '@react-native-picker/picker';
import { supabase } from "../../Supabase/supabaseClient";

export default function ProfileScreen({ navigation }) {
  // --------------------------
  // ESTADOS - DAR DE BAJA
  // --------------------------

  // Determinar si el usuario es proveedor (ajusta según tu lógica de autenticación)
  // Ejemplo: obtener desde props, contexto, o estado global
  const [isProveedor, setIsProveedor] = useState(false);

  useEffect(() => {
    const checkRol = async () => {
      try {
        const rol = await AsyncStorage.getItem('userRol');
        setIsProveedor(Number(rol) === 4);
      } catch (e) {
        setIsProveedor(false);
      }
    };
    checkRol();
  }, []);
  const [bajaCedula, setBajaCedula] = useState("");
  const [bajaMotivo, setBajaMotivo] = useState("");
  const [bajaError, setBajaError] = useState("");
  const [bajaSuccess, setBajaSuccess] = useState("");

  const darDeBajaProveedor = async () => {
    setBajaError("");
    setBajaSuccess("");

    if (!bajaCedula) {
      setBajaError("Debes ingresar el número de cédula/carnet del proveedor.");
      return;
    }

    // Convertir cedula a número para la consulta
    const cedulaInt = parseInt(bajaCedula, 10);
    if (isNaN(cedulaInt)) {
      setBajaError("La cédula debe ser un número válido.");
      return;
    }

    const { data, error } = await supabase
      .from("providers")
      .select("cedula, is_active")
      .eq("cedula", cedulaInt)
      .single();

    if (error || !data) {
      setBajaError("Proveedor no encontrado.");
      return;
    }

    const { error: updateError } = await supabase
      .from("providers")
      .update({ is_active: false, motivo_baja: bajaMotivo || null })
      .eq("cedula", cedulaInt);

    if (updateError) {
      setBajaError("Error al dar de baja al proveedor.");
    } else {
      setBajaSuccess("Proveedor dado de baja correctamente.");
    }
  };

  // --------------------------
  // ESTADOS - EDICIÓN
  // --------------------------
  const [editVisible, setEditVisible] = useState(false);
  const [editCedula, setEditCedula] = useState("");
  const [editNombre, setEditNombre] = useState("");
  const [editCategoriaId, setEditCategoriaId] = useState("");
  const [editEstado, setEditEstado] = useState(true);
  const [editFechaRenovacion, setEditFechaRenovacion] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const cargarProveedor = async () => {
    setEditError("");
    setEditSuccess("");

    if (!editCedula) {
      setEditError("Debes ingresar el número de cédula/carnet del proveedor.");
      return;
    }

    const { data, error } = await supabase
      .from("providers")
      .select("cedula, nombre, categoria_id, is_active, fecha_renovacion")
      .eq("cedula", editCedula)
      .single();

    if (error || !data) {
      setEditError("Proveedor no encontrado.");
      return;
    }

    setEditNombre(data.nombre || "");
    setEditCategoriaId(data.categoria_id ? String(data.categoria_id) : "");
    setEditEstado(data.is_active);
    setEditFechaRenovacion(
      data.fecha_renovacion ? String(data.fecha_renovacion).slice(0, 10) : ""
    );
  };

  const actualizarProveedor = async () => {
    setEditError("");
    setEditSuccess("");

    if (!editCedula) {
      setEditError("El número de cédula/carnet es obligatorio.");
      return;
    }
    if (!editNombre || editNombre.length > 20) {
      setEditError("El nombre debe tener máximo 20 caracteres.");
      return;
    }
    if (!editCategoriaId) {
      setEditError("La categoría seleccionada no existe.");
      return;
    }

    const { error } = await supabase
      .from("providers")
      .update({
        nombre: editNombre,
        categoria_id: editCategoriaId,
        is_active: editEstado,
        fecha_renovacion: editFechaRenovacion || null,
      })
      .eq("cedula", editCedula);

    if (error) {
      setEditError("Error al actualizar proveedor.");
    } else {
      setEditSuccess("Proveedor actualizado correctamente.");
    }
  };

  // --------------------------
  // ESTADOS - BUSCADOR
  // --------------------------
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from("provider_categories")
        .select("id, name");
      if (!error && data) setCategorias(data);
    };
    fetchCategorias();
  }, []);

  const validarCampos = () => {
    if (nombre && nombre.length > 20) {
      setError("El nombre debe tener máximo 20 caracteres.");
      return false;
    }
    if (cedula && cedula.length < 1) {
      setError("El número de cédula/carnet es obligatorio.");
      return false;
    }
    if (categoriaId && !categorias.find((c) => c.id == categoriaId)) {
      setError("La categoría seleccionada no existe.");
      return false;
    }
    setError("");
    return true;
  };

  const buscarProveedores = async () => {
    if (!validarCampos()) return;

    let query = supabase.from("providers").select("cedula, nombre, categoria_id");

    if (nombre) query = query.ilike("nombre", `%${nombre}%`);
    if (cedula) query = query.eq("cedula", cedula);
    if (categoriaId) query = query.eq("categoria_id", categoriaId);

    const { data, error } = await query;

    if (error) {
      setError("Error al buscar proveedores.");
      setResultados([]);
    } else {
      setResultados(data || []);
    }
  };

  // -----------------------------------------------------
  //                    RENDER / UI
  // -----------------------------------------------------

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{"< Volver."}</Text>
      </TouchableOpacity>

      <Image
        source={require("../../assets/avatar1.png")}
        style={styles.logo}
      />

      <View style={styles.profileBox}>
        <Text style={styles.name}>Carlos Barroso.</Text>
        <Text style={styles.email}>Correo universitario.</Text>
        <Text style={styles.desc}>Descripción.</Text>

        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>


      {/* DAR DE BAJA */}
      <View style={styles.editBox}>
        <Text style={styles.editTitle}>Dar de baja proveedor</Text>

        <TextInput
          style={styles.input}
          placeholder="Número de cédula/carnet"
          value={bajaCedula}
          onChangeText={setBajaCedula}
          keyboardType="numeric"
          maxLength={15}
        />

        <TextInput
          style={styles.input}
          placeholder="Motivo de baja (opcional)"
          value={bajaMotivo}
          onChangeText={(t) => setBajaMotivo(t.slice(0, 100))}
          maxLength={100}
        />

        <TouchableOpacity style={styles.searchBtn} onPress={darDeBajaProveedor}>
          <Text style={styles.searchBtnText}>Dar de baja</Text>
        </TouchableOpacity>

        {bajaError ? <Text style={styles.error}>{bajaError}</Text> : null}
        {bajaSuccess ? <Text style={styles.success}>{bajaSuccess}</Text> : null}

        {/* Módulo AE - solo para proveedores */}
        {isProveedor && (
          <AEModuleButton onPress={() => navigation.navigate('AEModule')} />
        )}
      </View>

      {/* EDITAR PROVEEDOR */}
      <View style={styles.editBox}>
        <TouchableOpacity
          style={styles.editToggleBtn}
          onPress={() => setEditVisible((v) => !v)}
        >
          <Text style={styles.editToggleText}>
            {editVisible ? "Ocultar edición de proveedor" : "Editar proveedor"}
          </Text>
        </TouchableOpacity>

        {editVisible && (
          <View style={styles.editFormBox}>
            <Text style={styles.editTitle}>Editar proveedor</Text>

            <TextInput
              style={styles.input}
              placeholder="Número de cédula/carnet"
              value={editCedula}
              onChangeText={setEditCedula}
              keyboardType="numeric"
              maxLength={15}
            />

            <TouchableOpacity style={styles.searchBtn} onPress={cargarProveedor}>
              <Text style={styles.searchBtnText}>Cargar datos</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Nombre proveedor"
              value={editNombre}
              onChangeText={setEditNombre}
              maxLength={20}
            />

            <Picker
              selectedValue={editCategoriaId}
              style={styles.input}
              onValueChange={setEditCategoriaId}
            >
              <Picker.Item label="Selecciona una categoría" value="" />
              {categorias.map((cat) => (
                <Picker.Item 
                  key={cat.id} 
                  label={cat.name} 
                  value={String(cat.id)} 
                />
              ))}
            </Picker>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginRight: 8 }}>Estado:</Text>

              <TouchableOpacity
                style={[
                  styles.estadoBtn,
                  editEstado ? styles.estadoActivo : styles.estadoInactivo,
                ]}
                onPress={() => setEditEstado((e) => !e)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {editEstado ? "Activo" : "Inactivo"}
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Fecha renovación (YYYY-MM-DD)"
              value={editFechaRenovacion}
              onChangeText={setEditFechaRenovacion}
              maxLength={10}
            />

            <TouchableOpacity style={styles.searchBtn} onPress={actualizarProveedor}>
              <Text style={styles.searchBtnText}>Actualizar proveedor</Text>
            </TouchableOpacity>

            {editError ? <Text style={styles.error}>{editError}</Text> : null}
            {editSuccess ? <Text style={styles.success}>{editSuccess}</Text> : null}
          </View>
        )}
      </View>

      {/* BUSCADOR */}
      <View style={styles.searchBox}>
        <Text style={styles.searchTitle}>Buscar proveedores</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre proveedor"
          value={nombre}
          onChangeText={setNombre}
          maxLength={20}
        />

        <TextInput
          style={styles.input}
          placeholder="Cédula/carnet"
          value={cedula}
          onChangeText={setCedula}
          keyboardType="numeric"
        />

        <Picker
          selectedValue={categoriaId}
          style={styles.input}
          onValueChange={setCategoriaId}
        >
          <Picker.Item label="Selecciona categoría" value="" />
          {categorias.map((cat) => (
            <Picker.Item 
              key={cat.id} 
              label={cat.name} 
              value={cat.id} 
            />
          ))}
        </Picker>

        <TouchableOpacity style={styles.searchBtn} onPress={buscarProveedores}>
          <Text style={styles.searchBtnText}>Buscar</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FlatList
          data={resultados}
          keyExtractor={(item) => String(item.cedula)}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>Nombre: {item.nombre}</Text>
              <Text style={styles.resultText}>Cédula: {item.cedula}</Text>
              <Text style={styles.resultText}>
                Categoría: {
                  categorias.find((c) => c.id == item.categoria_id)?.name 
                  || item.categoria_id
                }
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.resultText}>No se encontraron proveedores.</Text>
          }
        />
      </View>

      {/* MENÚ */}
      <View style={styles.menuBox}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Aprobar proveedores.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Aprobar platillos.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Retos.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Chat IA.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Calendario.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --------------------------------------
//          ESTILOS (IGUAL QUE LOS TUYOS)
// --------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  backBtn: { alignSelf: "flex-start", marginBottom: 8 },
  backText: { fontSize: 16, color: "#222", fontWeight: "bold" },

  logo: { width: 70, height: 70, marginBottom: 18 },

  profileBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    width: "100%",
    elevation: 2,
  },

  name: { fontWeight: "bold", fontSize: 17, color: "#222" },
  email: { fontSize: 15, color: "#888" },
  desc: { fontSize: 14, color: "#888" },

  editBtn: { position: "absolute", right: 12, top: 12 },
  editText: { color: "#6C63FF", fontWeight: "bold", fontSize: 15 },

  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    width: "100%",
  },

  searchTitle: { fontWeight: "bold", fontSize: 16, color: "#276EF1" },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 10,
    color: "#222",
  },

  searchBtn: {
    backgroundColor: "#276EF1",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  searchBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  error: { color: "red", textAlign: "center" },
  success: { color: "green", textAlign: "center" },

  resultItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },

  resultText: { fontSize: 15, color: "#222" },

  editBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    width: "100%",
  },

  editToggleBtn: {
    backgroundColor: "#276EF1",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  editToggleText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  editFormBox: { marginTop: 8 },

  editTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#276EF1",
    marginBottom: 8,
  },

  estadoBtn: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  estadoActivo: { backgroundColor: "#4CAF50" },
  estadoInactivo: { backgroundColor: "#F44336" },

  menuBox: { width: "100%", marginTop: 10 },
  menuItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  menuText: { fontSize: 16, color: "#222", fontWeight: "500" },
});
