import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/login/loginScreen';
import SignupScreen from '../screens/singUp/signUp';
import OtpView from '../screens/otp/otpView';
import PrivacyPolicy from '../screens/profile/privacyPolicy/privacyPolicy';
import TermsAndConditions from '../screens/profile/termsAndConditions/termsAndConditions';
import {StatusBar} from 'react-native';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <>
      <StatusBar animated={true} backgroundColor="#203afa" />
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OtpView"
          component={OtpView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
          options={{
            headerShown: true,
            headerTitle: 'Terms And Conditions',
            headerTitleStyle: {
              fontSize: 18,
            },
            headerTitleAlign: 'left',
            headerStyle: {
              backgroundColor: '#203afa',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{
            headerShown: true,
            headerTitle: 'Privacy Policy',
            headerTitleStyle: {
              fontSize: 18,
            },
            headerTitleAlign: 'left',
            headerStyle: {
              backgroundColor: '#203afa',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </>
  );
};
export default AuthStack;
