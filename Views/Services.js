import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export const Services = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/services');
      setServices(response.data.services);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los servicios');
    }
  };

  const handleDelete = async (serviceId) => {
  try {
    await axios.delete(`https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/services/${serviceId}`);
    fetchServices();
    Alert.alert('Éxito', 'Servicio eliminado correctamente');
  } catch (error) {
    Alert.alert('Error', 'No se pudo eliminar el servicio');
  }
};


  const handleUpdate = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString()
    });
  };

  const handleSubmitUpdate = async () => {
    try {
      await axios.put(
        `https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/services/${editingService.id}`,
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price)
        }
      );
      Alert.alert('Éxito', 'Servicio actualizado correctamente');
      setEditingService(null);
      fetchServices();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el servicio');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate("service")} // Navega a la pantalla de creación
      >
        <Text style={styles.buttonText}>+ Crear Servicio</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {services.length === 0 ? (
          <Text style={styles.emptyText}>No hay servicios registrados</Text>
        ) : (
          services.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <Text style={styles.servicePrice}>${service.price}</Text>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleUpdate(service)}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(service.id)}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={!!editingService} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Servicio</Text>
            
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Nombre del servicio"
              placeholderTextColor="#90e0ef"
            />
            
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Descripción"
              placeholderTextColor="#90e0ef"
              multiline
            />
            
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
              placeholder="Precio"
              placeholderTextColor="#90e0ef"
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditingService(null)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSubmitUpdate}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#caf0f8',
  },
  createButton: {
    backgroundColor: '#0077b6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
    marginBottom: 0,
  },
  scrollContainer: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#0077b6',
    fontSize: 16,
    marginTop: 20,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#90e0ef',
  },
  serviceInfo: {
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03045e',
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#0077b6',
    marginBottom: 6,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00b4d8',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#90e0ef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03045e',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#00b4d8',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#03045e',
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#90e0ef',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});