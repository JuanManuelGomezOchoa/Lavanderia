import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export const GarmentTry = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    observations: ''
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      Alert.alert('Error', 'Nombre y descripción son obligatorios');
      return;
    }

    try {
      const response = await axios.post(
        'https://5f1dkwj7-5000.usw3.devtunnels.ms/garments/create',
        formData
      );

      Alert.alert('Éxito', `Prenda creada con éxito! ID: ${response.data.garment_id}`);
      setFormData({
        name: '',
        description: '',
        observations: ''
      });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al crear la prenda');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nueva Prenda</Text>
      
      <TextInput
        placeholder="Nombre de la prenda"
        placeholderTextColor="#90e0ef"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Descripción"
        placeholderTextColor="#90e0ef"
        value={formData.description}
        onChangeText={(text) => handleChange('description', text)}
        style={[styles.input, styles.multilineInput]}
        multiline
      />
      
      <TextInput
        placeholder="Observaciones (opcional)"
        placeholderTextColor="#90e0ef"
        value={formData.observations}
        onChangeText={(text) => handleChange('observations', text)}
        style={[styles.input, styles.multilineInput]}
        multiline
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Crear Prenda</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#caf0f8',
  },
  title: {
    fontSize: 24,
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
  button: {
    backgroundColor: '#0077b6',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});