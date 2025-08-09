import { TextInput, View, StyleSheet, Text, Pressable, Alert } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export const createClient = () => {
  const navigation = useNavigation();
  const [DATA, setDATA] = useState({
    rol: "cliente"
  });

  const onChange = (target, value) => {
    setDATA(prev => ({
      ...prev,
      [target]: value
    }));
  };

  const registerClient = async () => {
    try {
      await axios.post("https://5f1dkwj7-5000.usw3.devtunnels.ms/clients/create", DATA);
      Alert.alert("Registrado", `El cliente ${DATA.name} se ha registrado correctamente`);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar el cliente");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear nuevo cliente</Text>
      
      <TextInput 
        onChangeText={(text) => onChange("name", text)} 
        style={styles.input} 
        placeholder="Nombre completo"
        placeholderTextColor="#90e0ef"
      />
      
      <TextInput 
        onChangeText={(text) => onChange("phone_number", text)} 
        style={styles.input} 
        placeholder="Número telefónico"
        placeholderTextColor="#90e0ef"
        keyboardType="phone-pad"
      />
      
      <TextInput 
        onChangeText={(text) => onChange("address", text)} 
        style={styles.input} 
        placeholder="Dirección"
        placeholderTextColor="#90e0ef"
      />

      <Pressable 
        style={styles.button} 
        onPress={registerClient}
      >
        <Text style={styles.buttonText}>Registrar</Text>
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
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#0077b6',
    borderWidth: 2,
    borderColor: '#00b4d8',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#ffffff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#c1121f',
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});