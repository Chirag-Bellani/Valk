import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Modal,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import LoadCard from '../../components/loadCard';
import Feather from 'react-native-vector-icons/Feather';
import FixedBottom from '../../components/fixedBottom';
import mainStyles from '../../assets/styles/main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import LoadCardSkeleton from '../../skeleton/loadCardSkeleton';
import KycModal from '../../components/kycModal';

const LoadListing = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [loadList, setLoadList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [isKyc, setIsKyc] = useState('');
  const [userDetail, setUserDetail] = useState(null);
  const [isKycModalVisible, setIsKycModalVisible] = useState(false);

  const fetchLoadListByTransporter = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('post_status', route.params.status);
    formData.append('type', 'All');
    try {
      const response = await apiPost(
        API_ENDPOINTS.LOAD.GET_LOAD_DETAIL,
        formData,
      );
      if (response.success) {
        setLoadList(response.data);
      } else {
        console.log('Failed to fetch data');
        setLoadList([]);
      }
      setRefreshing(false);
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

  const AcceptRejectBid = async bidData => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('bid_id', bidData.id);
    formData.append('post_load_id', bidData.post_load_id);
    formData.append('bid_status', bidData.status);

    try {
      const response = await apiPost(
        API_ENDPOINTS.LOAD.LOAD_ACCEPT_REJECT,
        formData,
      );
      if (response.success) {
        // fetchLoadListByTransporter();
        showMessage({
          message: response.message,
          description: '',
          type: 'success',
        });

        // setRefreshing(true);
      } else {
        showMessage({
          message: response.message,
          description: '',
          type: 'danger',
        });
        console.log('Failed to fetch data');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderCardInfo = ({item}) => {
    return (
      <LoadCard
        loadDetail={item}
        key={item.id}
        userDetail={userDetail}
        navigation={navigation}
        type={route.params.status}
        onAction={AcceptRejectBid}
      />
    );
  };

  useEffect(() => {
    fetchLoadListByTransporter();
    fetchUserDetail();
  }, [isFocused]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <FlatList
          data={[1, 1, 1, 1, 1, 1]}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={() => <LoadCardSkeleton />}
        />
      </View>
    );
  }

  return (
    <>
      {/* LoadCard List */}
      <View style={{flex: 1, paddingVertical: 10}}>
        {!loading && loadList.length === 0 && (
          <View style={[mainStyles.noDataContainer, {flex: 1}]}>
            <Text style={mainStyles.noDataText}>Data Not Available</Text>
          </View>
        )}
        {!loading && loadList.length !== 0 && (
          <FlatList
            data={loadList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCardInfo}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            enableEmptySections={true}
            contentContainerStyle={{paddingBottom: 100}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchLoadListByTransporter}
              />
            }
          />
        )}
        <View style={{flex: 1}}>
          {route.params.status === 'Current' && (
            <FixedBottom>
              <View>
                <View
                  // colors={['#4c669f', '#3b5998', '#192f6a']}
                  style={{
                    padding: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 25,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 5},
                    shadowOpacity: 0.3,
                    elevation: 5,
                    paddingRight: 10,
                    backgroundColor: '#0032e8',
                  }}>
                  <TouchableOpacity
                    style={mainStyles.button}
                    onPress={() => {
                      isKyc === 1
                        ? navigation.navigate('AddLoad')
                        : setIsKycModalVisible(true);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Feather
                        name="box"
                        size={26}
                        color="#fff"
                        style={{paddingRight: 5, paddingLeft: 5}}
                      />
                      <Text style={mainStyles.buttonText}>Post Loads</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </FixedBottom>
          )}
        </View>
      </View>
      <KycModal
        isVisible={isKycModalVisible}
        onClose={() => setIsKycModalVisible(false)}
        userDetail={userDetail}
      />
    </>
  );
};

export default LoadListing;
