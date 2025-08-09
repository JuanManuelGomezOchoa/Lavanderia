import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const API_URL = "https://5f1dkwj7-5000.usw3.devtunnels.ms/users";

export const UserCrud = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/get-all`);
      setUsers(res.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    }
  };

 const handleDelete = async (id) => {
  try {
    await axios.delete(`${API_URL}/delete/${id}`);
    fetchUsers();
    Alert.alert("Éxito", "Usuario eliminado correctamente");
  } catch (error) {
    Alert.alert("Error", "No se pudo eliminar el usuario");
  }
};


  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setFormData({ name: user.name, email: user.email });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/update/${editingUserId}`, formData);
      setEditingUserId(null);
      fetchUsers();
      Alert.alert("Éxito", "Usuario actualizado correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el usuario");
    }
  };

  const handleCreateUser = () => {
    navigation.navigate("createUser");
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {editingUserId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Nombre"
            placeholderTextColor="#90e0ef"
            style={styles.input}
          />
          <TextInput
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Email"
            placeholderTextColor="#90e0ef"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.editButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingUserId(null)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userText}>Email: {item.email}</Text>
          <Text style={styles.userText}>Rol: {item.rol}</Text>
          <Text style={styles.userText}>Estado: {item.state}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuarios</Text>
      
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={handleCreateUser}
      >
        <Text style={styles.buttonText}>Crear Usuario</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={users.length === 0 && styles.emptyContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay usuarios registrados</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#caf0f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#03045e',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#0077b6',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#90e0ef',
  },
  editContainer: {
    marginTop: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#03045e',
  },
  userText: {
    fontSize: 14,
    marginBottom: 3,
    color: '#0077b6',
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#00b4d8',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#03045e',
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#00b4d8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#c1121f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#90e0ef',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: '#0077b6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});