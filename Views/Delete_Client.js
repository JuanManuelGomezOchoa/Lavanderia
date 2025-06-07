import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export const deleteClient = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clientId } = route.params;

  const handleDelete = () => {
    fetch(`https://5f1dkwj7-5000.usw3.devtunnels.ms/clients/delete/${clientId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar");
        return res.json();
      })
      .then(() => {
        Alert.alert("Eliminado", "Cliente eliminado con éxito");
        navigation.goBack(); 
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "Hubo un problema al eliminar");
      });
  };

  return (
    <View style={styles.fondo}>
      <Text style={styles.titleDelete}>Eliminar cliente</Text>
      <Text style={{ color: "white", marginVertical: 20 }}>
        ¿Estás seguro de que quieres eliminar al cliente?
      </Text>
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.textDelete}>Eliminar</Text>
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
  },
  dataInput: {
    borderColor: "#fff",
    backgroundColor: "#0077b6",
    borderWidth: 3,
    borderRadius: 10,
    marginTop: 15,
    padding: 10,
    width: 300,
    color: "#fff"
  },
  titleDelete: {
    color: "#fff",
    fontSize: 30,
    marginBottom: 100
  },
  deleteButton: {
    backgroundColor: "#c1121f",
    height: 40,
    width: 150,
    borderRadius: 10,
    marginTop: 25,
    borderWidth: 5,
    borderColor: "#780000"
  },
  textDelete: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20
  }
});

