import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export const searchPhone = () => {
    const navigation = useNavigation();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [filteredClients, setFilteredClients] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = () => {
        if (phoneNumber.trim() === "") {
            setFilteredClients([]);
            setError(null);
            return;
        }
        fetch(`https://5f1dkwj7-5000.usw3.devtunnels.ms/clients/search/phone?phone=${phoneNumber}`)
            .then((res) => {
                if (!res.ok) throw new Error("Cliente no encontrado");
                return res.json();
            })
            .then((data) => {
                setFilteredClients([data]);
                setError(null);
            })
            .catch((err) => {
                setFilteredClients([]);
                setError(err.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buscar cliente por número</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Introduce el número telefónico"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
            </View>

            <Pressable onPress={handleSearch}>
                <Text style={styles.buttonText}>Buscar</Text>
            </Pressable>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.cardsWrapper}>
                {filteredClients.map((c, index) => (
                    <View key={index} style={styles.notes}>
                        <Text style={styles.textNote}>Nombre: {c.name}</Text>
                        <Text style={styles.textNote}>Tel: {c.phone_number}</Text>
                        <Text style={styles.textNote}>Dirección: {c.address}</Text>

                        <View style={styles.iconContainer}>
                            <Pressable style={styles.editButton} onPress={() => navigation.navigate("updateClient", { client: c })}>
                                <Text>Editar</Text>
                            </Pressable>

                            <Pressable style={styles.deleteButton} onPress={() => navigation.navigate("deleteClient", { clientId: c.id })}>
                                <Text>Eliminar</Text>
                            </Pressable>



                        </View>
                    </View>
                ))}
            </View>

            <Pressable onPress={() => navigation.navigate("createClient")}>
                <Text style={styles.textLink}>Crear cliente</Text>
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
    },
    title: {
        fontSize: 25,
        marginBottom: 10,
        color:"#fff"
    },
    searchContainer: {
        marginBottom: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        backgroundColor:"#00b4d8"
    },
    editButton:{
    backgroundColor:"#fdf0d5",
    borderRadius:8    
   },
   deleteButton:{
    backgroundColor:"#c1121f",
    borderRadius:8
   },
    button: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
    },
    buttonText: {
        backgroundColor:"#c1121f",
        height:40,
        width:150,
        borderRadius:10,
        marginTop:15,
        borderWidth:5,
        borderColor:"#780000",
        textAlign:"center",
        color:"#fff"
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    cardsWrapper: {
        marginTop: 10,
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    textLink:{
        color:"#fff"
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

});
