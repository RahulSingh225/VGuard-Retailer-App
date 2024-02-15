import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, VguardRishtaUser } from '../utils/modules/UserData';
import { api, logoutUser, newTokens, logOut } from '../utils/apiservice';

interface AuthContextProps {
  setIsUserAuthenticated: Dispatch<SetStateAction<boolean>>;
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
    let diffAcc = user.vguardRishtaUser.diffAcc ? user.vguardRishtaUser.diffAcc.toString() : '0';
    await AsyncStorage.setItem('USER', JSON.stringify(user.vguardRishtaUser));
    await AsyncStorage.setItem('refreshToken', JSON.stringify(user.tokens.refreshToken));
    await AsyncStorage.setItem('diffAcc', diffAcc);
    setIsUserAuthenticated(true);
  };

  const logout = async () => {
    try {
      const response = await logoutUser();
      await AsyncStorage.clear();
      setIsUserAuthenticated(false);
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const user: string = await AsyncStorage.getItem('USER') as string;
        const refreshToken: string = await AsyncStorage.getItem('refreshToken') as string;
        const userData = JSON.parse(user);
        const refreshTokenData = JSON.parse(refreshToken);
        if (userData && refreshTokenData) {
          const { accessToken, newRefreshToken } = await newTokens(refreshTokenData);
          await AsyncStorage.setItem('refreshToken', JSON.stringify(newRefreshToken));
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          setIsUserAuthenticated(true);
        } else {
          throw new Error("No data in async storage");
        }
      } catch (error: any) {
        console.error(error.message);
      }
    })();
  }, []);

  // useEffect(() => {
  //   const interceptor = api.interceptors.response.use(
  //     response => response,
  //     async error => {
  //       console.log(error.config, error.response.status)
  //       if (error.response.status === 401) {
  //         const refreshToken = await AsyncStorage.getItem('refreshToken') as string;
  //         const refreshTokenData = JSON.parse(refreshToken);
  //         const { accessToken, newRefreshToken } = await newTokens(refreshTokenData);
  //         await AsyncStorage.setItem('refreshToken', JSON.stringify(newRefreshToken));
  //         api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  //         return api.request(error.config);
  //       }
  //       if (error.response.status === 404) {
  //         console.error("E2", error.response);
  //         const user: string = await AsyncStorage.getItem("USER") as string;
  //         const userData: VguardRishtaUser = JSON.parse(user);
  //         const response = await logOut(userData.userId);
  //         await AsyncStorage.clear();
  //         setIsUserAuthenticated(false);
  //       }
  //       return Promise.reject(error);
  //     }
  //   );
  //   return () => {
  //     api.interceptors.response.eject(interceptor);
  //   }
  // }, [])

  return (
    <AuthContext.Provider value={{ isUserAuthenticated, setIsUserAuthenticated, login, logout, showPopup, popupAuthContent, setShowPopup }}>
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
