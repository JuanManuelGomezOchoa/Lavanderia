import { Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import axios from 'axios';

export const LoginView = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loginUser = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const res = await axios.post(
        "https://5f1dkwj7-5000.usw3.devtunnels.ms/users/login", 
        formData
      );
      navigation.navigate("admin");
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas o problema de conexión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleLogin}>Lavandería UTMA</Text>
      <Text style={styles.welcomeText}>¡Bienvenido! Inicia sesión</Text>

      <Text style={styles.label}>Correo electrónico:</Text>
      <TextInput 
        onChangeText={(text) => handleChange("email", text)}
        style={styles.input} 
        placeholder="Ingresa tu correo electrónico"
        placeholderTextColor="#90e0ef"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput 
        onChangeText={(text) => handleChange("password", text)}
        style={styles.input} 
        placeholder="Ingresa tu contraseña"
        placeholderTextColor="#90e0ef"
        secureTextEntry
      />

      <Pressable style={styles.loginButton} onPress={loginUser}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("createUser")}>
        <Text style={styles.createAccountText}>Crear cuenta</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03045e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleLogin: {
    color: '#ffffff',
    marginBottom: 60,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#0077b6',
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#ffffff',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#c1121f',
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createAccountText: {
    color: '#90e0ef',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});