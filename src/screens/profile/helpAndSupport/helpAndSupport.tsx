import {
  View,
  Text,
  Pressable,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {apiPost} from '../../../services/apiUtility';
import {API_ENDPOINTS} from '../../../constants/apiEndPoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HelpAndSupport = () => {
  const [comapnyData, setCompanyData] = useState('');
  const [loading, setLoading] = useState(true);
  const [phoneNo, setPhoneNo] = useState('');

  const getComapanyData = async () => {
    try {
      const response = await apiPost(
        API_ENDPOINTS.HELPANDSUPPORT.GET_HELP_AND_SUPPORT_LIST,
      );
      if (response.success) {
        setCompanyData(response.data);
      } else {
        console.log('Failed to fetch data');
        setCompanyData([]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchUserDetail = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');

      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        const formData = new FormData();
        formData.append('user_id', parsedUserInfo.id);
        const response = await apiPost(
          API_ENDPOINTS.USER.GET_PROFILE,
          formData,
        );

        if (response.success) {
          setPhoneNo(response.data.mainDetail.mobile_no);
        } else {
          console.log('Failed to fetch user details');
        }
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = async () => {
    const phoneNumber = comapnyData.phone;
    const message = `Hi, My Register Mobile No on Valk is ${phoneNo} i want to talk with the support agent regarding the query.`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message,
    )}`;
    const fallbackUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message,
    )}`;

    try {
      const supported = await Linking.canOpenURL(fallbackUrl);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Try fallback to wa.me
        await Linking.openURL(fallbackUrl);
      }
    } catch (err) {
      Alert.alert(
        'Error',
        'Could not open WhatsApp. Please make sure it is installed.',
      );
    }
  };

  useEffect(() => {
    getComapanyData();
    fetchUserDetail();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
        <Text style={{color: '#203afa', fontSize: 19, paddingVertical: 5}}>
          Contact No:{' '}
        </Text>
        <Pressable
          //   onPress={() => {
          //     Linking.openURL(`tel:${comapnyData.phone}`);
          //           }}
          onPress={openWhatsApp}>
          <Text style={{color: '#000000', fontSize: 15}}>
            {comapnyData.phone}
          </Text>
        </Pressable>
      </View>
      <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
        <Text style={{color: '#203afa', fontSize: 19, paddingVertical: 5}}>
          email Address:{' '}
        </Text>
        <Pressable
          onPress={() => {
            Linking.openURL(`mailto:${comapnyData.email}`);
          }}>
          <Text style={{color: '#000000', fontSize: 15}}>
            {comapnyData.email}
          </Text>
        </Pressable>
      </View>
      <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
        <Text style={{color: '#203afa', fontSize: 19, paddingVertical: 5}}>
          Office Address:{' '}
        </Text>
        <Pressable
          onPress={() => {
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                comapnyData.address,
              )}`,
            );
          }}>
          <Text style={{color: '#000000', fontSize: 15, flexShrink: 1}}>
            {comapnyData.address}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HelpAndSupport;
