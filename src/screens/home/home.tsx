import {View, Text, FlatList, ScrollView, LogBox} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageSlider from './imageSlider';
import LatestPostLoadCard from './latestPostLoadCard';
import HomeTopHeader from './homeTopHeader';
import {useFocusEffect} from '@react-navigation/native';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import AdditionalServiceCard from './additionalServiceCard';

const Home = ({navigation}) => {
  const [loginusername, setLoginUserName] = useState('');
  const [latestPostLoadsList, setLatestPostLoadsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [userDetail, setUserDetail] = useState({});
  const [additionalServiceData, setAdditionalServiceData] = useState([]);

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
          setLoginUserName(response.data.mainDetail.name);
          setRole(response.data.mainDetail.role);
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

  const fetchLatestPostLoadsList = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    try {
      let formData = new FormData();
      formData.append('user_id', JSON.parse(userInfo).id);

      const response = await apiPost(
        API_ENDPOINTS.LOAD.LATEST_POST_LOADS,
        formData,
      );

      if (response.success) {
        setLatestPostLoadsList(response.data);
      } else {
        setLatestPostLoadsList([]);
      }
    } catch (error) {
      console.log('Error fetching Latest Post Loads:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fastagSmallImage = additionalServiceData.find(
    item => item?.name === 'FasTag',
  );
  const gpsSmallImage = additionalServiceData.find(
    item => item?.name === 'GPS',
  );

  const insuranceSmallImage = additionalServiceData.find(
    item => item?.name === 'Insurance',
  );

  const AdditionalServices = [
    {
      id: 1,
      name: 'GPS Service',
      description: 'Valk gps service',
      image: {uri: gpsSmallImage?.small_image},
      screen: 'GPS',
      data: additionalServiceData,
    },
    {
      id: 2,
      name: 'Fastag Services',
      description: 'Valk fastag service',
      image: {uri: fastagSmallImage?.small_image},
      screen: 'FastTagScreen',
      data: additionalServiceData,
    },
    {
      id: 3,
      name: 'Insurance Inquiry',
      description: 'Valk Insurance Inquiry',
      image: {uri: insuranceSmallImage?.small_image},
      screen: 'InsuranceInquiryPage',
      data: additionalServiceData,
    },
  ];

  const fetchAdditionalServiceData = async () => {
    setLoading(true);
    try {
      const response = await apiPost(
        API_ENDPOINTS.FASTAG_GPS_INSURANCE.FASTAG_GPS_INSURANCE_LIST,
      );
      if (response.success) {
        setAdditionalServiceData(response.data);
      } else {
        setAdditionalServiceData([]);
      }
      // setRefreshing(false);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserDetail();
      fetchLatestPostLoadsList();
    }, []),
  );
  useEffect(() => {
    fetchUserDetail();
    fetchLatestPostLoadsList();
  }, [loading]);

  useEffect(() => {
    fetchAdditionalServiceData();
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <HomeTopHeader
        loginusername={loginusername}
        loginuserData={userDetail}
        role={role}
      />

      {/*  Center Image Slider Componenet */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingBottom: 50}}>
        <ImageSlider />

        <View style={{marginLeft: '3%', marginTop: '3%'}}>
          {latestPostLoadsList.length > 0 && (
            <Text style={{fontSize: 18, color: 'black', fontWeight: '600'}}>
              Recent Loads
            </Text>
          )}
          <FlatList
            data={latestPostLoadsList}
            horizontal
            contentContainerStyle={{paddingBottom: 25}}
            renderItem={({item}) => (
              <LatestPostLoadCard
                item={item}
                navigation={navigation}
                role={role}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={{marginLeft: '3%'}}>
          <Text style={{fontSize: 18, color: 'black', fontWeight: '600'}}>
            Additional Services
          </Text>
          <FlatList
            data={AdditionalServices}
            contentContainerStyle={{paddingBottom: 25}}
            renderItem={({item}) => (
              <AdditionalServiceCard item={item} navigation={navigation} />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default Home;
