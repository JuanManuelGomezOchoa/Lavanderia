import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import axios from 'axios';

export const Garments = () => {
  const [garments, setGarments] = useState([]);
  const [editingGarment, setEditingGarment] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    observations: ''
  });

  const fetchGarments = async () => {
    try {
      const response = await axios.get('https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/garments');
      setGarments(response.data.garments);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las prendas');
      console.error(error);
    }
  };

  const handleDelete = async (garmentId) => {
    try {
      await axios.delete(`https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/garments/${garmentId}`);
      fetchGarments();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleUpdate = (garment) => {
    setEditingGarment(garment);
    setFormData({
      type: garment.type,
      description: garment.description,
      observations: garment.observations || ''
    });
  };

  const handleSubmitUpdate = async () => {
    try {
      await axios.put(
        `https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/garments/${editingGarment.id}`,
        formData
      );
      Alert.alert('Éxito', 'Prenda actualizada');
      setEditingGarment(null);
      fetchGarments();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al actualizar');
    }
  };

  useEffect(() => {
    fetchGarments();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {garments.map((garment) => (
        <View key={garment.id} style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.type}>{garment.type}</Text>
            <Text style={styles.description}>{garment.description}</Text>
            {garment.observations && (
              <Text style={styles.observations}>Obs: {garment.observations}</Text>
            )}
          </View>
          
          <View style={styles.buttons}>
            <Button
              title="Editar"
              onPress={() => handleUpdate(garment)}
              color="#3498db"
            />
            <Button
              title="Eliminar"
              onPress={() => handleDelete(garment.id)}
              color="#e74c3c"
            />
          </View>
        </View>
      ))}

      <Modal visible={!!editingGarment} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Prenda</Text>
            
            <TextInput
              style={styles.input}
              value={formData.type}
              onChangeText={(text) => setFormData({...formData, type: text})}
              placeholder="Tipo de prenda"
            />
            
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Descripción"
            />
            
            <TextInput
              style={styles.input}
              value={formData.observations}
              onChangeText={(text) => setFormData({...formData, observations: text})}
              placeholder="Observaciones"
              multiline
            />
            
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setEditingGarment(null)}
                color="#95a5a6"
              />
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
    backgroundColor: '#f5f5f5'
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2
  },
  info: {
    marginBottom: 10
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4
  },
  observations: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 4
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
