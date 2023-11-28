import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../pages/Profile';
// import EditProfile from '../pages/EditProfile';

const ProfileStack: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Profile" component={Profile} />
      {/* <Stack.Screen name="editProfile" component={EditProfile} /> */}
    </Stack.Navigator>
  );
};

export default ProfileStack;
