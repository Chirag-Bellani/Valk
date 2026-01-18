import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddLoad from '../screens/shipper/addLoad';
import BottomNav from './bottomNav';
import LoadDetails from '../screens/shipper/loadDetails';
import AddLorry from '../screens/transporter/addLorry';
import Notifications from '../screens/notification/notifications';
import KYC from '../screens/profile/kycModule/kyc';
import AadhaarPANVerification from '../screens/profile/kycModule/aadhaarPANVerification';
import AadhaarUpload from '../screens/profile/kycModule/aadhaarUpload';
import AddParty from '../screens/profile/partyModule/addParty';
import EditParty from '../screens/profile/partyModule/editParty';
import PartyList from '../screens/profile/partyModule/partyList';
import PANUpload from '../screens/profile/kycModule/panUpload';
import GSTVerification from '../screens/profile/kycModule/gstVerification';
import ManageAccount from '../screens/profile/manageAccount/manageAccount';
import TermsAndConditions from '../screens/profile/termsAndConditions/termsAndConditions';
import PrivacyPolicy from '../screens/profile/privacyPolicy/privacyPolicy';
import LorryStatus from '../screens/transporter/lorryStatus';
import HelpAndSupport from '../screens/profile/helpAndSupport/helpAndSupport';
import {useNavigation} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import BankDetails from '../screens/profile/bankDetails/bankDetails';
import AddBankDetails from '../screens/profile/bankDetails/addBankDetails';
import SelectAddress from '../components/selectAddresss';
import ConfirmLocation from '../components/confirmLocation';
import RepostLoad from '../screens/shipper/repostLoad';
import ManageDocuments from '../screens/shipper/manageDocumet';
import ShowImage from '../screens/shipper/showImage';
import GPS from '../screens/home/gps/gps';
import FastTagScreen from '../screens/home/fastag/fastag';
import UserProfile from '../screens/profile/userProfile/userProfile';
import ShowProfileDocument from '../screens/profile/userProfile/showProfileDocument';
import InsuranceInquiryPage from '../screens/home/insurance/insurance';
import VehicleCurrentLocation from '../screens/shipper/vehicleCurrentLocation';

const Stack = createNativeStackNavigator();

const AppStack = ({initialRoute}) => {
  const navigation = useNavigation();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (initialRoute.name === 'LoadDetails') {
      console.log('Navigating to LoadDetails with params');
      // Navigate to LoadDetails with the provided params
      navigation.navigate('LoadDetails', {post_load_id: initialRoute.params});
      setHasNavigated(true);
    }
  }, [initialRoute, navigation]);

  return (
    <>
      <StatusBar animated={true} backgroundColor="#203afa" />
      <Stack.Navigator initialRouteName="BottomNav">
        <Stack.Screen
          name="BottomNav"
          component={BottomNav}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddLoad"
          component={AddLoad}
          options={{
            headerShown: true,
            headerTitle: 'Add Load',
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
          name="RepostLoad"
          component={RepostLoad}
          options={{
            headerShown: true,
            headerTitle: 'Repost Load',
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
          name="AddLorry"
          component={AddLorry}
          options={{
            headerShown: true,
            headerTitle: 'Add Lorry',
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
          name="LoadDetails"
          component={LoadDetails}
          initialParams={initialRoute.params}
          options={{
            headerShown: true,
            headerTitle: 'Load Detail',
            headerTitleStyle: {
              fontSize: 19,
            },
            headerTitleAlign: 'left',
            headerStyle: {
              backgroundColor: '#203afa',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            headerShown: true,
            headerTitle: 'Notifications',
            headerTitleStyle: {
              fontSize: 19,
            },
            headerTitleAlign: 'left',
            headerStyle: {
              backgroundColor: '#203afa',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="KYC"
          component={KYC}
          options={{
            headerShown: false,
            headerTitleStyle: {
              fontSize: 17,
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Aadhaar&PANVerification"
          component={AadhaarPANVerification}
          options={{
            headerShown: false,
            headerTitleStyle: {
              fontSize: 17,
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Aadhaar Upload"
          component={AadhaarUpload}
          options={{
            headerShown: false,
            headerTitleStyle: {
              fontSize: 17,
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="PAN Upload"
          component={PANUpload}
          options={{
            headerShown: false,
            headerTitleStyle: {
              fontSize: 17,
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="GSTVerification"
          component={GSTVerification}
          options={{
            headerShown: false,
            headerTitleStyle: {
              fontSize: 17,
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="AddParty"
          component={AddParty}
          options={{
            headerShown: true,
            headerTitle: 'Add Party',
            headerTitleStyle: {
              fontSize: 18,
            },
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#203afa',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="EditParty"
          component={EditParty}
          options={{
            headerShown: true,
            headerTitle: 'Edit Party',
            headerTitleStyle: {
              fontSize: 18,
            },
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#203afa',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="PartyList"
          component={PartyList}
          options={{
            headerShown: true,
            headerTitle: 'Party List',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 18,
            },
            headerStyle: {
              backgroundColor: '#203afa',
            },
            headerTintColor: '#fff', // Back arrow color (white)
          }}
        />
        <Stack.Screen
          name="ManageAccount"
          component={ManageAccount}
          options={{
            headerShown: true,
            headerTitle: 'Manage Account',
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
        <Stack.Screen
          name="LorryStatus"
          component={LorryStatus}
          options={{
            headerShown: false,
            headerTitle: 'Lorry Status',
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
          name="HelpAndSupport"
          component={HelpAndSupport}
          options={{
            headerShown: true,
            headerTitle: 'Help And Support',
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
          name="BankDetails"
          component={BankDetails}
          options={{
            headerShown: true,
            headerTitle: 'Bank Details',
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
          name="AddBankDetails"
          component={AddBankDetails}
          options={{
            headerShown: true,
            headerTitle: 'Add Bank Details',
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
          name="SelectAddress"
          component={SelectAddress}
          options={{
            headerShown: true,
            headerTitle: 'Select Address',
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
          name="ConfirmLocation"
          component={ConfirmLocation}
          options={{
            headerShown: true,
            headerTitle: 'Confirm Location',
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
          name="ManageDocuments"
          component={ManageDocuments}
          options={{
            headerShown: true,
            headerTitle: 'Manage Documents',
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
          name="ShowImage"
          component={ShowImage}
          options={{
            headerShown: true,
            headerTitle: 'Show Image',
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
          name="GPS"
          component={GPS}
          options={{
            headerShown: true,
            headerTitle: 'Buy GPS',
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
          name="FastTagScreen"
          component={FastTagScreen}
          options={{
            headerShown: true,
            headerTitle: 'FastTag Service',
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
          name="UserProfile"
          component={UserProfile}
          options={{
            headerShown: true,
            headerTitle: 'User Profile',
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
          name="ShowProfileDocument"
          component={ShowProfileDocument}
          options={{
            headerShown: true,
            headerTitle: 'Company Documents',
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
          name="InsuranceInquiryPage"
          component={InsuranceInquiryPage}
          options={{
            headerShown: true,
            headerTitle: 'Insurance Inquiry',
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
          name="VehicleCurrentLocation"
          component={VehicleCurrentLocation}
          options={{
            headerShown: true,
            headerTitle: 'Vehicle Current Location',
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

export default AppStack;
