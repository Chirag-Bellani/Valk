import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { apiPost, clearAuthToken, saveAuthToken } from '../services/apiUtility';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loginError, setLoginError] = useState('');

  const login = async (mobileno, registerNewUser) => {
    // setIsLoading(true);
    try {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      let formData = new FormData();

      formData.append('mobile_no', mobileno);
      formData.append('fcmToken', fcmToken);
      const response = await apiPost('authenticate-user', formData);
      if (response.success == true) {
        let userInfo = response.data;
        if (userInfo.user === 'New') {
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          registerNewUser(userInfo);
        } else {
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          await saveAuthToken(userInfo.api_token);
          setUserInfo(userInfo); // Assuming `setUserInfo` is in scope
          setUserToken(userInfo.api_token);
          // await AsyncStorage.setItem('authToken', JSON.stringify(userInfo.api_token));
          // let userToken = await AsyncStorage.getItem('authToken');
        }
      } else {
        setLoginError(response.message);
      }
    } catch (error) {
      console.log('___________error________', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('___________logout________');
    setIsLoading(true);

    try {
      const response = await apiPost('logout-user');

      if (response.success) {
        setUserToken(null);
        setUserInfo(null);
        await AsyncStorage.removeItem('authToken');
        // clearAuthToken()
        let userToken = await AsyncStorage.getItem('authToken');

        AsyncStorage.removeItem('userInfo');
        setIsLoading(false);
        setLoginError('');
        isLoggedIn();
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('authToken');
      if (userToken !== null) {
        setUserToken(userToken);
      }
      setIsLoading(false);
    } catch (e) {
      console.log('is logged in error $(e)');
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, isLoading, setIsLoading, userToken, userInfo, loginError, setUserInfo, setUserToken }}>
      {children}
    </AuthContext.Provider>
  );
};
