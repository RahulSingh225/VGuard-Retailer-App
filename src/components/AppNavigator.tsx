// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from '../modules/common/services/BottomTab';
import AuthNavigator from '../modules/auth/stack/AuthNavigator';
import { useAuth } from './AuthContext';

const AppNavigator: React.FC = () => {
  const { isUserAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isUserAuthenticated ? <BottomTab /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
