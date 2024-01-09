import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../utils/apiservice';

interface User {
  // Define your user properties here
}

interface AuthContextProps {
  isUserAuthenticated: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  popupAuthContent: string;
  showPopup: boolean;
  setShowPopup: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupAuthContent, setPopupContent] = useState('Please Enter Credentials of a Retailer');

  const login = async (user: User) => {
      await AsyncStorage.setItem('USER', JSON.stringify(user));
      setIsUserAuthenticated(true);
  };

  const logout = async () => {
    try {
      const response = await logoutUser();
      console.log(response.data, "LOGOUT");
      await AsyncStorage.removeItem('USER');
      await AsyncStorage.removeItem('refreshToken');
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
    <AuthContext.Provider value={{ isUserAuthenticated, login, logout, showPopup, popupAuthContent, setShowPopup }}>
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
