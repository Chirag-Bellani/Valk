import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import KycModal from '../../components/kycModal';
import { apiPost } from '../../services/apiUtility';
import { API_ENDPOINTS } from '../../constants/apiEndPoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShipperTopHeaderButtons = () => {
  const navigation = useNavigation();
  const [isKycModalVisible, setIsKycModalVisible] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const isFocused = useIsFocused();
  const [isKyc, setIsKyc] = useState(0);

  const fetchUserDetail = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');

      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        const formData = new FormData();
        formData.append('user_id', parsedUserInfo.id);
        const response = await apiPost(
          API_ENDPOINTS.USER.GET_PROFILE, formData
        );

        if (response.success) {
          setUserDetail(response.data);
          setIsKyc(response.data?.mainDetail?.get_user_party_detail?.is_kyc);
        } else {
          console.log('Failed to fetch user details');
        }
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [isFocused]);

  return (
    <>
      <TouchableOpacity
        style={{
          borderColor: 'white',
          borderWidth: 1,
          borderRadius: 25,
          padding: '4%',
          marginLeft: '5%',
          width: '43%',
          flexDirection: 'row',
          marginTop: '1%',
          marginBottom: '3%',
        }}
        onPress={() => {
          isKyc === 1 ?
            navigation.navigate('AddLoad') :
            setIsKycModalVisible(true);
        }}>
        <Entypo name="globe" size={22} color="white" />
        <Text style={{ fontSize: 18, color: 'white', marginLeft: '7%' }}>
          Post Loads
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          borderColor: 'white',
          borderWidth: 1,
          borderRadius: 25,
          padding: '4%',
          marginLeft: '3%',
          width: '40%',
          flexDirection: 'row',
          marginTop: '1%',
          marginBottom: '3%',
        }}
        onPress={() => {
          navigation.navigate('Find Lorry');
        }}>
        <MaterialCommunityIcons
          name="truck-cargo-container"
          size={25}
          color="white"
        />
        <Text style={{ fontSize: 18, color: 'white', marginLeft: '5%', width: '100%' }}>
          Find Lorry
        </Text>
      </TouchableOpacity>
      <KycModal
        isVisible={isKycModalVisible}
        onClose={() => setIsKycModalVisible(false)}
        userDetail={userDetail}
      />
    </>
  );
};

export default ShipperTopHeaderButtons;
