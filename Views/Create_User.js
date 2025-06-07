import { Text, TextInput, View, StyleSheet, Pressable } from "react-native"
import { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export const createUser = ()=>{
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

  const registerUser= async()=>{
    try {
      const registered= await axios.post("https://5f1dkwj7-5000.usw3.devtunnels.ms/users/register", DATA)
      Alert.alert("Usuario registrado correctamente")
      navigation.navigate("login")
    } catch (error) {
      Alert.alert("No se registro", error)
    }
  }
    return(
        <View style={styles.fondo}>
            <Text style={styles.titleClient}>Crear nuevo usuario</Text>
            <TextInput onChangeText={(text)=>onChange("name",text)} style={styles.dataInput} placeholder="Ingresa tu nombre"/>
            <TextInput onChangeText={(text)=>onChange("email",text)} style={styles.dataInput} placeholder="Ingresa tu correo electronico"/>
            <TextInput onChangeText={(text)=>onChange("password",text)} style={styles.dataInput} placeholder="Ingresa tu contraseña"/>

            <Pressable onPress={()=>registerUser()} style={styles.sendButton}><Text style={styles.textUser}>Registrar</Text></Pressable>
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
    titleClient:{
        color:"#fff",
        fontSize:35,
    },
    sendButton:{
        backgroundColor:"#c1121f",
        height:40,
        width:150,
        borderRadius:10,
        marginTop:15,
        borderWidth:5,
        borderColor:"#780000"
    },
    dataText:{
        textAlign:"center"
    },
    textUser:{
        color:"#fff",
        textAlign:"center",
        fontSize:20
    }
})