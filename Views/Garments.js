import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export const Garments = () => {
  const navigation = useNavigation();
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
    }
  };

  const handleDelete = async (garmentId) => {
    try {
      await axios.delete(`https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/garments/${garmentId}`);
      fetchGarments();
      Alert.alert('Éxito', 'Prenda eliminada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la prenda');
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
      Alert.alert('Éxito', 'Prenda actualizada correctamente');
      setEditingGarment(null);
      fetchGarments();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la prenda');
    }
  };

  useEffect(() => {
    fetchGarments();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate("garment")}
      >
        <Text style={styles.buttonText}>+ Crear Prenda</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {garments.length === 0 ? (
          <Text style={styles.emptyText}>No hay prendas registradas</Text>
        ) : (
          garments.map((garment) => (
            <View key={garment.id} style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.type}>{garment.type}</Text>
                <Text style={styles.description}>{garment.description}</Text>
                {garment.observations && (
                  <Text style={styles.observations}>Obs: {garment.observations}</Text>
                )}
              </View>
              
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleUpdate(garment)}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(garment.id)}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={!!editingGarment} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Prenda</Text>
            
            <TextInput
              style={styles.input}
              value={formData.type}
              onChangeText={(text) => setFormData({...formData, type: text})}
              placeholder="Tipo de prenda"
              placeholderTextColor="#90e0ef"
            />
            
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Descripción"
              placeholderTextColor="#90e0ef"
            />
            
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={formData.observations}
              onChangeText={(text) => setFormData({...formData, observations: text})}
              placeholder="Observaciones"
              placeholderTextColor="#90e0ef"
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditingGarment(null)}
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
    backgroundColor: '#caf0f8'
  },
  createButton: {
    backgroundColor: '#0077b6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
    marginBottom: 0
  },
  scrollContainer: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#0077b6',
    fontSize: 16,
    marginTop: 20
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#90e0ef',
  },
  info: {
    marginBottom: 12
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#03045e'
  },
  description: {
    fontSize: 14,
    color: '#0077b6',
    marginBottom: 6
  },
  observations: {
    fontSize: 14,
    color: '#00b4d8',
    fontStyle: 'italic'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16
  },
  editButton: {
    backgroundColor: '#00b4d8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8
  },
  deleteButton: {
    backgroundColor: '#c1121f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#90e0ef'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#03045e'
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
    fontSize: 16
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10
  },
  cancelButton: {
    backgroundColor: '#90e0ef',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  saveButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8
  }
});