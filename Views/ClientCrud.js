import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://5f1dkwj7-5000.usw3.devtunnels.ms/clients';

export const ClientCrud = () => {
  const navigation = useNavigation();
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedClient, setEditedClient] = useState({
    name: '',
    phone_number: '',
    address: ''
  });
  const [searchFilter, setSearchFilter] = useState('name'); // 'name' or 'phone'
  const [searchQuery, setSearchQuery] = useState('');

  const fetchClients = async (filter = '', parameter = '') => {
    try {
      let url = `${API_URL}/search`;
      
      // Si hay parámetros de búsqueda, los añadimos a la URL
      if (filter && parameter) {
        url += `?filter=${filter}&parameter=${encodeURIComponent(parameter)}`;
      }
      
      const response = await axios.get(url);
      setClients(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchClients(searchFilter, searchQuery);
    } else {
      fetchClients(); // Recargar todos los clientes si no hay query
    }
  };

  const handleDelete = async (clientId) => {
  try {
    await axios.delete(`${API_URL}/delete/${clientId}`);
    setClients(prevClients => prevClients.filter(client => client.id !== clientId));
    Alert.alert('Éxito', 'Cliente eliminado correctamente');
  } catch (error) {
    Alert.alert('Error', 'No se pudo eliminar el cliente');
  }
};


  const startEditing = (client) => {
    setEditingId(client.id);
    setEditedClient({
      name: client.name,
      phone_number: client.phone_number,
      address: client.address
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/update/${editingId}`, editedClient);
      await fetchClients(searchFilter, searchQuery); // Mantener los filtros después de actualizar
      setEditingId(null);
      Alert.alert('Éxito', 'Cliente actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el cliente');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const renderItem = ({ item }) => {
    if (editingId === item.id) {
      return (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={editedClient.name}
            onChangeText={(text) => setEditedClient({ ...editedClient, name: text })}
            placeholder="Nombre"
            placeholderTextColor="#90e0ef"
          />
          <TextInput
            style={styles.input}
            value={editedClient.phone_number}
            onChangeText={(text) => setEditedClient({ ...editedClient, phone_number: text })}
            placeholder="Teléfono"
            placeholderTextColor="#90e0ef"
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            value={editedClient.address}
            onChangeText={(text) => setEditedClient({ ...editedClient, address: text })}
            placeholder="Dirección"
            placeholderTextColor="#90e0ef"
          />
          <View style={styles.editButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingId(null)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.clientItem}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.name}</Text>
          <Text style={styles.clientText}>Teléfono: {item.phone_number}</Text>
          <Text style={styles.clientText}>Dirección: {item.address}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => startEditing(item)}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, searchFilter === 'name' && styles.activeFilter]}
            onPress={() => setSearchFilter('name')}
          >
            <Text style={styles.filterButtonText}>Nombre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, searchFilter === 'phone' && styles.activeFilter]}
            onPress={() => setSearchFilter('phone')}
          >
            <Text style={styles.filterButtonText}>Teléfono</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Buscar por ${searchFilter === 'name' ? 'nombre' : 'teléfono'}`}
          placeholderTextColor="#90e0ef"
          onSubmitEditing={handleSearch}
        />
        
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate("createClient")}
      >
        <Text style={styles.buttonText}>+ Crear cliente</Text>
      </TouchableOpacity>
      
      <FlatList
        data={clients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={clients.length === 0 && styles.emptyContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay clientes registrados</Text>}
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
  searchContainer: {
    marginBottom: 15,
  },
  filterButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#90e0ef',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00b4d8',
  },
  activeFilter: {
    backgroundColor: '#0077b6',
  },
  filterButtonText: {
    color: '#03045e',
    fontWeight: '500',
  },
  searchInput: {
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
  searchButton: {
    backgroundColor: '#0077b6',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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
  clientItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#90e0ef',
  },
  editContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00b4d8',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#03045e',
  },
  clientText: {
    color: '#0077b6',
    marginBottom: 3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#00b4d8',
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    color: '#03045e',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#0077b6',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#00b4d8',
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#c1121f',
    marginLeft: 10,
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
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});