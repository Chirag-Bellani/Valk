import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomBarShipper from './bottomBarShipper';
import BottomBarTransporter from './bottomBarTransporter';
import { useIsFocused } from '@react-navigation/native';


const Tab = createBottomTabNavigator();

const BottomNav = () => {

  const [role, setRole] = useState('');
  const isFocused = useIsFocused();

  const UsertProfileData = async () => {
    let Role = await AsyncStorage.getItem('userInfo');
    setRole(JSON.parse(Role).role);
  };

  useEffect(() => {
    UsertProfileData();
  }, [isFocused]);

  return (
    <>
      {(role == "3" || role == "4") ? <BottomBarShipper /> : <BottomBarTransporter />}
    </>
  );
};

export default BottomNav;
