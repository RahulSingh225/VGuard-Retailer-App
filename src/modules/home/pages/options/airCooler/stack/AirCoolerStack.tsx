import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../../../../../../../colors';
import AirCooler from '../AirCooler';

const AirCoolerStack: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.yellow,
        },
        headerShown: false,
      }}>
      <Stack.Screen
        name="Air Cooler"
        component={AirCooler}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AirCoolerStack;
