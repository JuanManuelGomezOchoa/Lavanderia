import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import axios from 'axios';

export const Services = () => {
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
      console.log('Error al cargar servicios:', error);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      const response = await axios.delete(`https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/services/${serviceId}`);
      if (response.data.success) {
        fetchServices();
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al conectar con el servidor');
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
      const response = await axios.put(
        `https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/services/${editingService.id}`,
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price)
        }
      );

      if (response.data.success) {
        Alert.alert('Éxito', 'Servicio actualizado correctamente');
        setEditingService(null);
        fetchServices();
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al conectar con el servidor');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {services.map((service) => (
        <View key={service.id} style={styles.serviceCard}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.servicePrice}>${service.price}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              title="Editar"
              onPress={() => handleUpdate(service)}
              color="#3498db"
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Eliminar"
              onPress={() => handleDelete(service.id)}
              color="#ff4444"
            />
          </View>
        </View>
      ))}

      {/* Modal para editar */}
      <Modal
        visible={!!editingService}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Servicio</Text>
            
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Nombre del servicio"
            />
            
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Descripción"
              multiline
            />
            
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
              placeholder="Precio"
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setEditingService(null)}
                color="#999"
              />
              <View style={styles.buttonSpacer} />
              <Button
                title="Guardar"
                onPress={handleSubmitUpdate}
                color="#2ecc71"
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceInfo: {
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonSpacer: {
    width: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});