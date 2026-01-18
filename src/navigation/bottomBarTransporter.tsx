import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import Home from '../screens/home/home';
import MyLorryHome from '../screens/transporter/myLorryHome';
import FindLoadHome from '../screens/transporter/findLoadHome';
import Profile from '../screens/profile/profile';
;


const Tab = createBottomTabNavigator();

const BottomBarTransporter = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'My Lorry':
              iconName = 'truck';
              break;
            case 'Find Load':
              iconName = 'layers';
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
        name="My Lorry"
        component={MyLorryHome}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Find Load"
        component={FindLoadHome}
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

export default BottomBarTransporter;
