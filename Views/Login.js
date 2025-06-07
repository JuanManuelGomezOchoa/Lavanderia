import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import axios from 'axios';

export const loginView = ()=>{
  const navigation = useNavigation()
   const [DATA, setDATA] = useState({});

  const onChange=(target, value)=>{
    const newData = DATA;
    console.log(target, value)
    newData[target] = value;
    setDATA(newData)
  }
  const loginUser = async()=>{
  try {
    const res = await axios.post("https://5f1dkwj7-5000.usw3.devtunnels.ms/users/login", DATA)
    navigation.navigate("admin")
  } catch (error) {
    console.log("error")
  }
  }
 
  return (
    <View style={styles.container}>
      
      <Text style={styles.titleLogin}>Lavanderia UTMA</Text>
      <Text style={styles.welcomeText}>!Bienvenido Inicia sesion!</Text>

      <Text style={styles.textColor}>Correo electronico:</Text>
      <TextInput onChangeText={(text)=>{onChange("email", text)}} style={styles.dataInput} placeholder='Ingresa tu correo electronico'/>

      <Text style={styles.textColor}>Contraseña</Text>
      <TextInput onChangeText={(text)=>{onChange("password", text)}} style={styles.dataInput} placeholder='Ingresa tu contraseña'/>

      <Pressable style={styles.loginButton} onPress={()=>loginUser()}><Text style={styles.textLogin}>Iniciar sesion</Text></Pressable>

      <Pressable onPress={()=> navigation.navigate("createUser")}><Text>Crear cuenta</Text></Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03045e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleLogin:{
    color:'#fff',
    marginBottom:100,
    fontSize:45
  },
  welcomeText: {
    fontSize:25,
    color:'#fff',
    marginBottom:45
  },
  textColor:{
    color:'#fff'
  },
  dataInput:{
    borderColor:'#fff',
    borderWidth:2,
    borderRadius:15,
    backgroundColor:'#0077b6'
  },
  loginButton:{
        backgroundColor:"#c1121f",
        height:40,
        width:150,
        borderRadius:10,
        marginTop:15,
        borderWidth:5,
        borderColor:"#780000"
    },
    textLogin:{
        color:"#fff",
        textAlign:"center",
        fontSize:20
    }
});
