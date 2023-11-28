import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../pages/LoginScreen';
import HomeStack from '../../home/stack/HomeStack';
import SplashScreen from '../pages/SplashScreen';
import ForgotPassword from '../pages/ForgotPassword';
import LoginWithNumber from '../pages/LoginWithNumber';


const AuthNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="forgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      <Stack.Screen name="loginWithNumber" component={LoginWithNumber} options={{ headerShown: false }} />
      <Stack.Screen name="loginwithotp" component={LoginWithNumber} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeStack} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
