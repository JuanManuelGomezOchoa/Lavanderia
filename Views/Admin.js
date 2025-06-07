import { Pressable, View, Text, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

export const Admin = () => {
    const navigation = useNavigation();

    const [clients, setClients] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [filteredClients, setFilteredClients] = useState([]);

    // Buscar por nombre
    useEffect(() => {
        if (searchName.trim() === "") {
            setFilteredClients([]);
            return;
        }
        fetch(`https://5f1dkwj7-5000.usw3.devtunnels.ms/clients/search/name?name=${searchName}`)
            .then((res) => res.json())
            .then((data) => setFilteredClients(data))
            .catch((err) => console.error("Error al conectar:", err));
    }, [searchName]);


    return (
        <View style={styles.fondo}>
            <Text style={styles.titleAdmin}>Vista de administrador</Text>

            <View style={styles.dashboard}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Busca por nombre"
                        value={searchName}
                        onChangeText={(text) => {
                            setSearchName(text);
                        }}
                    />
                </View>

                <Pressable onPress={() => navigation.navigate("searchPhone")}>
                    <Text style={styles.textFindPhone}>Buscar cliente por numero</Text>
                </Pressable>


                <View style={styles.cardsWrapper}>
                    {filteredClients.map((c, index) => {
                        return (
                            <View key={index} style={styles.notes}>
                                <Text style={styles.textNote}>Nombre: {c.name}</Text>
                                <Text style={styles.textNote}>Numero telefonico: {c.phone_number}</Text>
                                <Text style={styles.textNote}>Direccion: {c.address}</Text>

                                <View style={styles.iconContainer}>
                                    <Pressable style={styles.editButton} onPress={() => navigation.navigate("updateClient", { client: c })}>
                                        <Text>Editar</Text>
                                    </Pressable>

                                    <Pressable style={styles.deleteButton} onPress={() => navigation.navigate("deleteClient", { clientId: c.id })}>
                                        <Text>Eliminar</Text>
                                    </Pressable>


                                </View>
                            </View>
                        );
                    })}
                </View>

                <View>
                    <Pressable style={styles.createClientButton} onPress={() => navigation.navigate("createClient")}>
                        <Text style={styles.textCreateClient}>Crear cliente</Text>
                    </Pressable>
                </View>
            </View>
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
   titleAdmin:{
    color:"#fff",
    fontSize:25
   },
   navbar: {
      backgroundColor: "#375261",
      justifyContent: "flex-end",
      paddingVertical: 30,
   },

   nabvarText: {
      color: "white",
      textAlign: "right",
      paddingHorizontal: 30,
      fontSize: 24,
      fontWeight: 500,
   },

   dashboard: {
      backgroundColor: "#eaffff",
      alignItems: "center",
      width:"auto",
      height:"auto",
      borderRadius:15
   },

   cardsWrapper: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      padding: 20,
   },

   notes: {
      backgroundColor: "#90e0ef",
      width: 150,
      height: 150,
      margin: 10,
      padding: 10,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
   },

   textNote: {
      fontSize: 15,
      color: "#caf0f8",
      fontWeight: "bold",
      textAlign: "center",
   },

   iconContainer: {
      flexDirection: "row",
      paddingTop: 10,
      gap: 10,
   },

   searchContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 15,
      width: "80%",
      gap: 15,
   },

   searchInput: {
      backgroundColor: "white",
      height: 40,
      borderColor: "#375261",
      borderWidth: 1,
      borderRadius: 10,
      width: "100%",
      paddingHorizontal: 10,
   },
   editButton:{
    backgroundColor:"#fdf0d5",
    borderRadius:8    
   },
   deleteButton:{
    backgroundColor:"#c1121f",
    borderRadius:8
   },
   createClientButton:{
    backgroundColor:"#03045e",
    borderRadius:8,
    marginBottom:15
   },
   textCreateClient:{
    color:"#fff"
   },
   textFindPhone:{
    color:"#03045e"
   }
});
