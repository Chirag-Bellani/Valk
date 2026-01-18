import {View, Text} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FindLorryHome from './findLoadList';
import MyLoads from '../shipper/myLoads';
import MyLorry from './myLorry';
import CustomTabBar from '../../components/tabBarcomponent';


const MyLorryHome = () => {
  const Topbar = createMaterialTopTabNavigator();

  return (
    <Topbar.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'transparent',
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontSize: 15,
          padding: 3,
          fontWeight: '600',
          textTransform: 'capitalize',
        },
        tabBarIndicatorStyle: {
          backgroundColor: 'blue',
          height: 2,
        },
      }}>
      <Topbar.Screen
        name="My Lorry Home"
        component={MyLorry}
        options={{title: 'My Lorry'}}
        initialParams={{status: 'BookedLorries'}}
      />
    </Topbar.Navigator>
  );
};

export default MyLorryHome;
