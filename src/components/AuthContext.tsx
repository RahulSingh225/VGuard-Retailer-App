import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDigestPostRequest } from '../utils/apiservice';

interface User {
  // Define your user properties here
}

interface AuthContextProps {
  isUserAuthenticated: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const login = async (user: User) => {
    await AsyncStorage.setItem('USER', JSON.stringify(user));
    setIsUserAuthenticated(true);
  };

  const logout = async () => {
    try {
      const path = 'user/logoutUser';
      createDigestPostRequest(path, '');
      await AsyncStorage.removeItem('USER');
      setIsUserAuthenticated(false);
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('USER')
      .then((value) => {
        if (value) {
          login(JSON.parse(value));
        } else {
          logout();
        }
      })
      .catch((error) => {
        console.error('AsyncStorage error:', error);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isUserAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
