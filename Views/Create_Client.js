import { TextInput, View, StyleSheet, Text, Pressable } from "react-native"
import { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export const createClient = ()=>{
  const navigation = useNavigation()
    const [DATA, setDATA] = useState({
    rol:"cliente"
  });

  const onChange=(target, value)=>{
    const newData = DATA;
    console.log(target, value)
    newData[target] = value;
    setDATA(newData)
  }

  const registerClient= async()=>{
    try {
      const registered= await axios.post("https://5f1dkwj7-5000.usw3.devtunnels.ms/clients/create", DATA)
      Alert.alert("Registrado", `El usuario ${DATA.name} se ha registrado correctamente`)
      navigation.goBack();
    } catch (error) {
      Alert.alert("No se registró", error)
    }
  }
    return(
        <View style={styles.fondo}>
            <Text style={styles.title}>Crear un nuevo cliente</Text>
            <TextInput onChangeText={(text)=>onChange("name",text)} style={styles.dataInput} placeholder="Ingresa tu nombre"/>
            <TextInput onChangeText={(text)=>onChange("phone_number",text)} style={styles.dataInput} placeholder="Ingresa tu numero telefonico"/>
            <TextInput onChangeText={(text)=>onChange("address",text)} style={styles.dataInput} placeholder="Ingresa tu direccion"/>

            <Pressable style={styles.createButton} onPress={()=>registerClient()}><Text style={styles.textCreate}>Registrar</Text></Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    fondo: {
    flex: 1,
    backgroundColor: '#03045e',
    alignItems: 'center',
    justifyContent: 'center',
    },
    dataInput: {
        borderColor:"#fff",
        backgroundColor:"#0077b6",
        borderWidth:3,
        borderRadius:10,
        marginTop:15
    },
    title:{
        color:"#fff",
        fontSize:35,
        
    },
    createButton:{
        backgroundColor:"#c1121f",
        height:40,
        width:150,
        borderRadius:10,
        marginTop:15,
        borderWidth:5,
        borderColor:"#780000"
    },
    textCreate:{
        color:"#fff",
        textAlign:"center",
        fontSize:20
    }
})