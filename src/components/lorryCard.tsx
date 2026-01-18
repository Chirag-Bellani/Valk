import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import lorryCardStyles from '../assets/styles/lorryCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const LorryCard = ({item, navigation, type}) => {
  const [userDetail, setUserDetail] = useState({});
  const [showFullLocation, setShowFullLocation] = useState(false);
  const [isKycModalVisible, setIsKycModalVisible] = useState(false);
  const [isKyc, setIsKyc] = useState(0);

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

  // const getUserDetail = async () => {
  //   const userInfo = await AsyncStorage.getItem('userInfo');
  //   setUserDetail(JSON.parse(userInfo));
  // };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  let vehicleImage;
  switch (item?.get_vehicle_category.vehicle_category.toLowerCase()) {
    case 'truck':
      vehicleImage = require('../assets/images/Truck-right3x-removebg-preview.png');
      break;
    case 'container':
      vehicleImage = require('../assets/images/Container-right3x-removebg-preview.png');
      break;
    case 'trailer':
      vehicleImage = require('../assets/images/Trailor-right3x-removebg-preview.png');
      break;
    case 'lcv':
      vehicleImage = require('../assets/images/LCV-right3x-removebg-preview.png');
      break;
    case 'hyva':
      vehicleImage = require('../assets/images/Hyva-right3x-removebg-preview.png');
      break;
    case 'tanker':
      vehicleImage = require('../assets/images/Tanker-right3x-removebg-preview.png');
      break;
    default:
      vehicleImage = require('../assets/images/hyva-truck.png');
  }

  return (
    <TouchableOpacity
      style={lorryCardStyles.card}
      onPress={() =>
        navigation.navigate('LorryStatus', {lorryDetail: item, type: type})
      }
      disabled={userDetail?.role === 3}>
      {item?.is_verified !== 'Verified' && (
        <View
          style={[
            {
              width: '30%',
              alignSelf: 'flex-start',
              padding: 3,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: moderateScale(-10),
              left: moderateScale(10),
            },
            item?.is_verified === 'Pending'
              ? {backgroundColor: '#F9C45C'}
              : {backgroundColor: '#FF6D43'},
          ]}>
          <Text style={lorryCardStyles.placeBidButtonText}>
            {item?.is_verified}
          </Text>
        </View>
      )}

      {item?.is_verified === 'Verified' && (
        <View
          style={[
            {
              width: '20%',
              alignSelf: 'flex-start',
              padding: 3,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: moderateScale(-10),
              left: moderateScale(10),
            },
            item?.truck_post_status === 'Booked'
              ? {backgroundColor: '#67BAF1'}
              : {backgroundColor: '#6AC75A'},
          ]}>
          <Text style={lorryCardStyles.placeBidButtonText}>
            {item?.truck_post_status}
          </Text>
        </View>
      )}

      <View style={lorryCardStyles.header}>
        <View style={lorryCardStyles.imageContainer}>
          <Image source={vehicleImage} style={lorryCardStyles.truckImage} />
          <Text style={lorryCardStyles.vehicleNo}>{item?.vehicle_no} </Text>
          {item?.is_verified === 'Verified' && (
            <MaterialCommunityIcons
              name="check-decagram"
              size={22}
              color="green"
            />
          )}
        </View>
        {item?.is_verified === 'Verified' && (
          <TouchableOpacity
            style={{
              padding: 5,
              borderRadius: 5,
              backgroundColor: '#3f51b5',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() =>
              navigation.navigate('VehicleCurrentLocation', {
                vehicle_no: item?.vehicle_no,
                type: 'MyLorry',
              })
            }>
            <FontAwesome5 name="map-marker-alt" size={12} color="#fff" />
            <Text style={{paddingLeft: 5, color: '#fff'}}>Track Now</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Separator */}
      <View style={{borderBottomColor: 'lightgrey', borderBottomWidth: 1}} />
      <View
        style={[
          lorryCardStyles.infoRow,
          userDetail && {
            borderBottomColor: 'lightgrey',
            borderBottomWidth: 1,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: moderateScale(10),
          }}>
          <MaterialCommunityIcons name="truck" size={18} color="grey" />
          <Text style={lorryCardStyles.vehicle}>
            {item?.get_vehicle_category?.vehicle_category}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: moderateScale(10),
          }}>
          <MaterialIcons name="height" size={18} color="grey" />
          <Text style={lorryCardStyles.truckType}>
            {item?.get_vehicle_type !== null
              ? item?.get_vehicle_type?.vehicle_type
              : '-'}{' '}
            | {''}
            {item?.get_vehicle_size !== null
              ? item?.get_vehicle_size?.vehicle_size
              : '----'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: moderateScale(10),
          }}>
          <MaterialCommunityIcons name="weight" size={18} color="grey" />
          <Text style={lorryCardStyles.vehicleCapacity}>
            {item?.vehicle_capacity} Tonne(s)
          </Text>
        </View>
      </View>
      {(userDetail?.role === 3 || userDetail?.role === 4) && (
        <Pressable
          onPress={() => {
            navigation.navigate('AddLoad', {vehicle_id: item?.id});
          }}
          style={lorryCardStyles.placeBidButton}>
          <Text style={lorryCardStyles.placeBidButtonText}>Place a Bid</Text>
        </Pressable>
      )}
    </TouchableOpacity>
  );
};

export default LorryCard;
