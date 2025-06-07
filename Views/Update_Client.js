import { TextInput, View, StyleSheet, Text, Pressable, Alert } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from "react";

export const updateClient = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { client} = route.params;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleUpdate = () => {
    fetch(`http://127.0.0.1:5000/clients/update/${client.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone_number: phone,
        address,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar");
        return res.json();
      })
      .then(() => {
        Alert.alert("Éxito", "Cliente actualizado correctamente");
        navigation.goBack(); 
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "No se pudo actualizar el cliente");
      });
  };

  return (
    <View style={styles.fondo}>
      <Text style={styles.titleUpdate}>Actualizar datos del cliente</Text>

      <TextInput
        style={styles.dataInput}
        placeholder="Nuevo nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.dataInput}
        placeholder="Nuevo número telefónico"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.dataInput}
        placeholder="Nueva dirección"
        value={address}
        onChangeText={setAddress}
      />

      <Pressable style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.textUpdate}>Actualizar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#03045e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  dataInput: {
    width: "100%",
    borderColor: "#fff",
    backgroundColor: "#0077b6",
    color: "#fff",
    borderWidth: 3,
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  titleUpdate: {
    color: "#fff",
    fontSize: 30,
    marginBottom: 50,
    textAlign: "center",
  },
  updateButton: {
    backgroundColor: "#c1121f",
    height: 40,
    width: 150,
    borderRadius: 10,
    marginTop: 25,
    borderWidth: 5,
    borderColor: "#780000"
  },
  textUpdate: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20
  }
});
