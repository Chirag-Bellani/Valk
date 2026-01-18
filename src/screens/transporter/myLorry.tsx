import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FixedBottom from '../../components/fixedBottom';
import styles from '../../assets/styles/main';
import LorryCard from '../../components/lorryCard';
import { apiPost } from '../../services/apiUtility';
import { API_ENDPOINTS } from '../../constants/apiEndPoints';
import LorryCardSkeleton from '../../skeleton/lorryCardSkeleton';
import KycModal from '../../components/kycModal';

const MyLorry = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [lorryList, setLorryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [isKycModalVisible, setIsKycModalVisible] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [isKyc, setIsKyc] = useState('');

  const fetchLorryList = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    // let formData = new FormData();
    // formData.append('user_id', JSON.parse(userInfo).id);
    try {
      const response = await apiPost(
        API_ENDPOINTS.LORRY.GET_LORRY_LIST,
        // formData,
      );
      if (response.success) {
        setLorryList(response.data);
      } else {
        console.log('Failed to fetch data');
        setLorryList([]);
      }
      // setRefreshing(false);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
          API_ENDPOINTS.USER.GET_PROFILE, formData
        );

        if (response.success) {
          setUserDetail(response.data);
          setIsKyc(response.data.mainDetail.get_user_party_detail.is_kyc);
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
    fetchLorryList();
    fetchUserDetail();
  }, [isFocused]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
        <FlatList
          data={[1, 1, 1, 1, 1, 1]}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={() => <LorryCardSkeleton />}
        />
      </View>
    );
  }

  return (
    <>
      {/* <MyLorryCard /> */}
      {!loading && lorryList.length === 0 && (
        <View style={[styles.noDataContainer, { flex: 1 }]}>
          <Text style={styles.noDataText}> Data Not Found</Text>
        </View>
      )}
      {!loading && lorryList.length !== 0 && (
        <FlatList
          data={lorryList}
          renderItem={({ item, index }) => (
            <LorryCard item={item} key={item?.id} navigation={navigation} type='MyLorry' />
          )}
          keyExtractor={(item, index) => item?.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchLorryList}
            />
          }
        />
      )}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <FixedBottom>
          <View style={styles.container}>
            <View
              // colors={['#4c669f', '#3b5998', '#192f6a']}
              style={{
                padding: 6,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 25,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                elevation: 5,
                paddingRight: 10,
                backgroundColor: '#0032e8',
              }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  isKyc === 1
                    ? navigation.navigate('AddLorry') : setIsKycModalVisible(true)
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Feather
                    name="truck"
                    size={26}
                    color="#fff"
                    style={{ paddingRight: 5, paddingLeft: 5 }}
                  />
                  <Text style={styles.buttonText}>Post Lorry</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </FixedBottom>
      </View>
      <KycModal
        isVisible={isKycModalVisible}
        onClose={() => setIsKycModalVisible(false)}
        userDetail={userDetail}
      />
    </>
  );
};

export default MyLorry;
