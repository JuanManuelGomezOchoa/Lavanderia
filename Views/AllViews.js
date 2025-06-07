import { Pressable, View, Text } from "react-native"
import { useNavigation } from '@react-navigation/native';



export const allViews = ()=>{
    const navigation = useNavigation()
    return(
        <View>
            <Text>Esta vista es provisional solo para navegar entre todas las vistas</Text>

        <Pressable onPress={()=> navigation.navigate("login")}><Text>Login</Text></Pressable>
        <Pressable onPress={()=> navigation.navigate("createClient")}><Text>Crear cliente</Text></Pressable>
        <Pressable onPress={()=> navigation.navigate("createUser")}><Text>Crear usuario</Text></Pressable>
        <Pressable onPress={()=> navigation.navigate("updateClient")}><Text>Actualizar usuario</Text></Pressable>

        </View>
    )
}