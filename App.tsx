import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';

import Navbar from './src/shared/components/Navbar';
import { InNavbarRoute, Route } from './src/types/Route';

const Stack = createNativeStackNavigator();

const routes: Route[] = [
  { name: 'home', component: () => null, inNavbar: false },
];

export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {routes.map(({ name, component }) => (
            <Stack.Screen key={name} name={name} component={component} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
      <Navbar routes={routes.filter(({ inNavbar }) => inNavbar) as InNavbarRoute[]} navigationRef={navigationRef} />
    </SafeAreaView>
  );
}
