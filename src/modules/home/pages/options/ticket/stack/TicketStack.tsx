import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TicketHistory from '../TicketHistory';
import Ticket from '../Ticket';
import colors from '../../../../../../../colors';

const TicketStack: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.yellow,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Tickets"
        component={Ticket}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Ticket History"
        component={TicketHistory}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default TicketStack;
