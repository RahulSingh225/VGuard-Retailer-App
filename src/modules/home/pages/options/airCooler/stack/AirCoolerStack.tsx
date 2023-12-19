import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../../../../../../../colors';
import AirCooler from '../AirCooler';
import RedemptionHistory from '../../redeemPoints/RedemptionHistory';
import UniqueCodeHistory from '../../scanQR/pages/UniqueCodeHistory';

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
        name="Redeem Points"
        component={AirCooler}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Redemption History"
        component={RedemptionHistory}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Unique Code History"
        component={UniqueCodeHistory}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AirCoolerStack;
