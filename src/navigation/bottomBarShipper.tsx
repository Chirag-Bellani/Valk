import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import Home from '../screens/home/home';
import MyLoads from '../screens/shipper/myLoads';
import FindLorryHome from '../screens/shipper/findLorryHome';
import Profile from '../screens/profile/profile';
import PartyCard from '../screens/shipper/findPartyCard';



const Tab = createBottomTabNavigator();

const BottomBarShipper = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'My Loads':
              iconName = 'layers';
              break;
            case 'Find Lorry':
              iconName = 'truck';
              break;

            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'question';
              break;
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { paddingBottom: 9, fontSize: 12 },
        tabBarStyle: { padding: 10, height: 60 },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="My Loads"
        component={MyLoads}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Find Lorry"
        component={FindLorryHome}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomBarShipper;
