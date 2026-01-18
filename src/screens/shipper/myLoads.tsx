import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LoadListing from './loadListing';
import CustomTabBar from '../../components/tabBarcomponent';
 // Ensure this path is correct

const MyLoads = () => {
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
          backgroundColor: '#203afa',
          height: 2,
        },
      }}>
      <Topbar.Screen
        name="Current Load"
        component={LoadListing}
        initialParams={{status: 'Current'}}
      />
      <Topbar.Screen
        name="Completed"
        component={LoadListing}
        initialParams={{status: 'Completed'}}
      />
    </Topbar.Navigator>
  );
};

export default MyLoads;
