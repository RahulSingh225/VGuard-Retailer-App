import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import New from '../New';
import DailyWinner from '../DailyWinner';
import colors from '../../../../../../../colors';

const NewStack: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.yellow
        },
        headerShown: false
      }}
    >
      <Stack.Screen
        name="What's New?"
        component={New}
        options={{
          headerShown: true
        }}
      />
      <Stack.Screen
        name="Daily Winner"
        component={DailyWinner}
        options={{
          headerShown: true
        }}
      />
    </Stack.Navigator>
  );
};

export default NewStack;
