import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { allViews } from './AllViews';
import { createClient } from './Create_Client';
import { createUser } from './Create_User';
import { LoginView} from './Login';
import { updateClient } from './Update_Client';
import { Admin } from './Admin';
import { searchPhone } from './Search_By_Phone';
import { deleteClient } from './Delete_Client';
import { CreateOrder } from './CreateOrder';
import { Services } from './Services';
import { Garments } from './Garments';
import { GarmentTry } from './GarmentTry'; //Esta es la vista para crear las garments
import { ServiceTry } from './ServiceTry'; //Esta es la vista para crear los services
import { ClientCrud } from './ClientCrud';
import { UserCrud } from './UserCrud';
import { Dashboard } from './Dashboard';
import { OrderDetail } from './OrderDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="dashboard">
        <Stack.Screen name="allviews" component={allViews} />
        <Stack.Screen name="deleteClient" component={deleteClient} />
        <Stack.Screen name="searchPhone" component={searchPhone} />
        <Stack.Screen name="login" component={LoginView} />
        <Stack.Screen name="createClient" component={createClient} />
        <Stack.Screen name="createUser" component={createUser} />
        <Stack.Screen name="updateClient" component={updateClient} />
        <Stack.Screen name="admin" component={Admin} />
        <Stack.Screen name="seeingServices" component={Services} />
        <Stack.Screen name="createOrder" component={CreateOrder}/>
        <Stack.Screen name="seeingGarments" component={Garments}/>
        <Stack.Screen name="service" component={ServiceTry}/>
        <Stack.Screen name="clientCrud" component={ClientCrud}/>
        <Stack.Screen name="userCrud" component={UserCrud} />
        <Stack.Screen name="dashboard" component={Dashboard} />
        <Stack.Screen name="garment" component={GarmentTry}/> 
        <Stack.Screen name="orderDetail" component={OrderDetail}/> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}