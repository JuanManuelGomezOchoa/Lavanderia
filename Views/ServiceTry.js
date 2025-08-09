import React, { useState } from "react";
import { TextInput, View, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import axios from "axios";

export const ServiceTry = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: ""
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axios.post(
        "https://5f1dkwj7-5000.usw3.devtunnels.ms/services/create", 
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price)
        }
      );

      Alert.alert("Éxito", "Servicio creado correctamente");
      setFormData({ name: "", description: "", price: "" });
    } catch (error) {
      Alert.alert("Error", error.response?.data?.msg || "No se pudo crear el servicio");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Servicio</Text>
      
      <TextInput
        placeholder="Nombre del servicio"
        placeholderTextColor="#90e0ef"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción del servicio"
        placeholderTextColor="#90e0ef"
        value={formData.description}
        onChangeText={(text) => handleChange("description", text)}
        style={styles.input}
        multiline
      />

      <TextInput
        placeholder="Precio del servicio"
        placeholderTextColor="#90e0ef"
        value={formData.price}
        onChangeText={(text) => handleChange("price", text)}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Crear Servicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#caf0f8',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03045e',
    marginBottom: 30,
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