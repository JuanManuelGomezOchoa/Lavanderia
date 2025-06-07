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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="allviews" component={allViews} />
        <Stack.Screen name="deleteClient" component={deleteClient} />
        <Stack.Screen name="searchPhone" component={searchPhone} />
        <Stack.Screen name="login" component={loginView} />
        <Stack.Screen name="createClient" component={createClient} />
        <Stack.Screen name="createUser" component={createUser} />
        <Stack.Screen name="updateClient" component={updateClient} />
        <Stack.Screen name="admin" component={Admin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}