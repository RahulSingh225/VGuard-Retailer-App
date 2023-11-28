import React from 'react';
import { AuthProvider } from './src/components/AuthContext';
import AppNavigator from './src/components/AppNavigator';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
