import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData } from '../utils/modules/UserData';
import { logoutUser } from '../utils/apiservice';

interface AuthContextProps {
  isUserAuthenticated: boolean;
  login: (user: UserData) => Promise<void>;
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

  const login = async (user: UserData) => {
    console.log("LOGGING IN")
    const diffAcc = user.diffAcc;
    setIsUserAuthenticated(true);
    await AsyncStorage.setItem('USER', JSON.stringify(user));
    await AsyncStorage.setItem('diffAcc', diffAcc);
  };

  const logout = async () => {
    try {
      const response = await logoutUser();
      await AsyncStorage.removeItem('USER');
      await AsyncStorage.removeItem('diffAcc');
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
