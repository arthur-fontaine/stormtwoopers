import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { StatusBar, SafeAreaView, LogBox } from 'react-native';

import Auth from './src/Auth';
import { twitterAuthenticationAtom } from './src/Auth/atoms/twitterAuthenticationAtom';
import Home from './src/Home';
import Navbar from './src/shared/components/Navbar';
import { Route } from './src/types/Route';

if (Constants.expoConfig?.extra?.env === 'production') {
  LogBox.ignoreAllLogs();
}

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const routes: Route[] = [
  { name: 'auth', component: Auth, inNavbar: false, showNavbar: false },
  {
    name: 'home',
    component: Home,
    inNavbar: true,
    showNavbar: true,
    icons: {
      active: require('./assets/icons/home-screen-active.png'),
      inactive: require('./assets/icons/home-screen-inactive.png'),
    },
  },
];

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [navigationReady, setNavigationReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'Lato-Thin': require('./assets/fonts/Lato/Lato-Thin.ttf'),
    'Lato-ThinItalic': require('./assets/fonts/Lato/Lato-ThinItalic.ttf'),
    'Lato-Light': require('./assets/fonts/Lato/Lato-Light.ttf'),
    'Lato-LightItalic': require('./assets/fonts/Lato/Lato-LightItalic.ttf'),
    'Lato-Regular': require('./assets/fonts/Lato/Lato-Regular.ttf'),
    'Lato-Italic': require('./assets/fonts/Lato/Lato-Italic.ttf'),
    'Lato-Bold': require('./assets/fonts/Lato/Lato-Bold.ttf'),
    'Lato-BoldItalic': require('./assets/fonts/Lato/Lato-BoldItalic.ttf'),
    'Lato-Black': require('./assets/fonts/Lato/Lato-Black.ttf'),
    'Lato-BlackItalic': require('./assets/fonts/Lato/Lato-BlackItalic.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && navigationReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, navigationReady]);

  const [twitterAuthentication] = useAtom(twitterAuthenticationAtom);

  useEffect(() => {
    if (twitterAuthentication.accessToken) {
      navigationRef.navigate('home' as never);
    }
  }, [twitterAuthentication.accessToken, navigationRef]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar />
      <NavigationContainer
        ref={navigationRef}
        onReady={() => setNavigationReady(true)}
        initialState={twitterAuthentication.accessToken ? { routes: [{ name: 'home' }] } : undefined}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {routes.map(({ name, component }) => (
            <Stack.Screen key={name} name={name} component={component} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
      <Navbar
        routes={routes}
        navigationRef={navigationRef}
      />
    </SafeAreaView>
  );
}
