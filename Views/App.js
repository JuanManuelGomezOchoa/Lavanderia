import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { allViews } from './AllViews';
import { createClient } from './Create_Client';
import { createUser } from './Create_User';
import { loginView } from './Login';
import { updateClient } from './Update_Client';
import { Admin } from './Admin';
import { searchPhone } from './Search_By_Phone';
import { deleteClient } from './Delete_Client';
import { CreateOrder } from './CreateOrder';
import { Services } from './Services';
import { Garments } from './Garments';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="seeingGarments">
        <Stack.Screen name="allviews" component={allViews} />
        <Stack.Screen name="deleteClient" component={deleteClient} />
        <Stack.Screen name="searchPhone" component={searchPhone} />
        <Stack.Screen name="login" component={loginView} />
        <Stack.Screen name="createClient" component={createClient} />
        <Stack.Screen name="createUser" component={createUser} />
        <Stack.Screen name="updateClient" component={updateClient} />
        <Stack.Screen name="admin" component={Admin} />
        <Stack.Screen name="seeingServices" component={Services} />
        <Stack.Screen name="createOrder" component={CreateOrder}/>
        <Stack.Screen name="seeingGarments" component={Garments}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}