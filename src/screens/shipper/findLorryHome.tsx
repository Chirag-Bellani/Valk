import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FindLorryList from './findLorryList';
import CustomTabBar from '../../components/tabBarcomponent';


const FindLorry = () => {
  const Topbar = createMaterialTopTabNavigator();

  return (
    <Topbar.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
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
      }}
    >
      <Topbar.Screen
        name="My Lorry List"
        component={FindLorryList}
        options={{ title: "Find Lorry" }}
        initialParams={{ status: 'Available' }}
      />
    </Topbar.Navigator>
  );
};

export default FindLorry;
