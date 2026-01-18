import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  RefreshControl,
  FlatList,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadCard from '../../components/loadCard';
import {useIsFocused} from '@react-navigation/native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import styles from '../../assets/styles/main';
import GooglePlacesSearch from '../../components/googlePlaceSearch';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import LoadCardSkeleton from '../../skeleton/loadCardSkeleton';

const FindLoadList = ({route, navigation}) => {
  const isFocused = useIsFocused();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filteredLoadList, setFilteredLoadList] = useState([]);
  const [loadList, setLoadList] = useState([]);
  const [bidData, setBidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);

  const fetchLoadList = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('from', from);
    formData.append('to', to);
    try {
      const response = await apiPost(API_ENDPOINTS.LOAD.FIND_LOAD, formData);
      if (response.success) {
        setLoadList(response.data);
        setFilteredLoadList(response.data);
      } else {
        console.log('Failed to fetch data');
        setLoadList([]);
        setFilteredLoadList([]);
      }
      setRefreshing(false);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchBidList = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);

    try {
      const response = await apiPost(
        API_ENDPOINTS.BID.GET_MY_BIDS_LIST,
        formData,
      );
      setRefreshing(false);
      setLoading(false);
      if (response.success) {
        setBidData(response.data);
      } else {
        console.log('Failed to fetch data');
        setBidData([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const negotiateTransporterRate = async negotiateData => {
    //setIsLoading(true);
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);

    formData.append('bid_id', negotiateData.bidID);
    formData.append('post_load_id', negotiateData.postLoadId);
    formData.append('amount', negotiateData.rate);
    formData.append('remarks', negotiateData.remarks);
    formData.append('bid_status', negotiateData.status);

    try {
      const response = await apiPost(
        API_ENDPOINTS.BID.STORE_LOAD_BID_NEGOTIATE,
        formData,
      );
      if (response.success) {
        showMessage({
          message: response.message,
          description: '',
          type: 'success',
        });
        fetchBidList();

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

  const addBid = async firstBidData => {
    const formData = new FormData();
    formData.append('bid_id', firstBidData.bidID);
    formData.append('post_load_id', firstBidData.postLoadId);
    formData.append('amount', firstBidData.rate);
    formData.append('remarks', firstBidData.remarks);

    try {
      const response = await apiPost(API_ENDPOINTS.BID.ADD_BID, formData);
      if (response.success == true) {
        showMessage({
          message: response.message,
          description: '',
          type: 'success',
        });
        setLoading(false);
      } else {
        showMessage({
          message: response.message,
          description: '',
          type: 'danger',
        });
        setLoading(false);
      }
      fetchLoadList();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  const renderCardInfo = ({item}) => {
    return (
      <LoadCard
        loadDetail={item}
        key={item?.id}
        navigation={navigation}
        type={route?.params?.status === 'FindLoad' ? 'FindLoad' : 'MyBid'}
        negotiateTransporterRate={negotiateTransporterRate}
        firstBidByTrasnporter={addBid}
      />
    );
  };

  const filterLoadList = data => {
    const filteredData = data.filter(item => {
      const itemFrom = item?.from_location
        ? item?.from_location.toLowerCase()
        : '';
      const itemTo = item?.to_location ? item?.to_location.toLowerCase() : '';
      const searchFrom = from.toLowerCase();
      const searchTo = to.toLowerCase();

      return (
        (!from || itemFrom.includes(searchFrom)) &&
        (!to || itemTo.includes(searchTo))
      );
    });
    setFilteredLoadList(filteredData);
    setLoading(false);
  };

  useEffect(() => {
    if (route?.params?.status === 'FindLoad') {
      fetchLoadList();
    } else if (route?.params?.status === 'MyBid') {
      fetchBidList();
    }
  }, [isFocused]);

  const handleSearch = () => {
    setLoading(true);
    filterLoadList(loadList);
  };
  const handleFrom = (data, details) => {
    setFrom(data?.description);
  };
  const handleTo = (data, details) => {
    setTo(data?.description);
  };

  if (loading) {
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={[1, 1, 1]}
          showsVerticalScrollIndicator={false}
          renderItem={() => <LoadCardSkeleton />}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{flex: 1}}>
        {route?.params?.status === 'FindLoad' && (
          <>
            <View style={{height: '35%', position: 'relative'}}>
              <View
                style={{
                  height: '60%',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  backgroundColor: '#203afa',
                }}></View>
            </View>
            <View
              style={{
                width: '93%',
                paddingTop: 35,
                padding: 20,
                backgroundColor: 'white',
                position: 'absolute',
                top: 15,
                alignSelf: 'center',
                borderRadius: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              <View
                style={{
                  width: '90%',
                  // height: 150,
                  borderColor: 'lightgrey',
                  borderWidth: 1,
                  alignSelf: 'center',
                  borderRadius: 15,
                  position: 'relative',
                }}>
                <View
                  style={{
                    width: '90%',
                    // height: '50%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomColor: 'lightgrey',
                    borderBottomWidth: 1,
                    alignSelf: 'center',
                  }}>
                  <Ionicons name="location-outline" color={'grey'} size={22} />
                  <GooglePlacesSearch
                    onPlaceSelected={handleFrom}
                    placeHolder={'From'}
                    customStyles={{
                      textInputContainer: {
                        width: '100%', // Customize width to fit the design
                        paddingHorizontal: 5,
                        marginBottom: 10,
                      },
                      textInput: {
                        paddingTop: 20,
                        color: 'black',
                      },
                      listView: {
                        position: 'absolute', // This makes the dropdown overlay
                        top: 40,
                        backgroundColor: '#fff',
                        borderRadius: 7,
                        shadowColor: '#000',
                        marginTop: 10,
                        // shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,
                        elevation: 5,
                        zIndex: 5,
                      },
                      row: {
                        paddingVertical: 10,
                      },
                    }}
                  />
                </View>
                <View
                  style={{
                    width: '90%',
                    // height: '50%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    zIndex: -2,
                  }}>
                  <Ionicons name="location-outline" color={'grey'} size={22} />
                  <GooglePlacesSearch
                    onPlaceSelected={handleTo}
                    placeHolder={'To'}
                    customStyles={{
                      textInputContainer: {
                        width: '100%', // Customize width to fit the design
                        paddingHorizontal: 5,
                        marginBottom: 10,
                      },
                      textInput: {
                        paddingTop: 20,
                        color: 'black',
                      },
                      listView: {
                        width: '100%',
                        position: 'absolute', // This makes the dropdown overlay
                        top: 40,
                        backgroundColor: '#fff',
                        borderRadius: 7,
                        shadowColor: '#000',
                        marginTop: 10,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,
                        elevation: 5,
                        zIndex: 5,
                      },
                      row: {
                        paddingVertical: 10,
                      },
                    }}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={{
                  width: '90%',
                  padding: 12,
                  backgroundColor: loading ? '#a1a1a1' : '#0032e8', // Change background when disabled
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: '6%',
                  borderRadius: 10,
                  zIndex: -1,
                }}
                onPress={handleSearch}
                disabled={loading}>
                <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
                  Search
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!loading && filterLoadList.length === 0 && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Data Not Found</Text>
          </View>
        )}

        {!loading && filterLoadList.length !== 0 && (
          <View
            style={
              route?.params?.status === 'FindLoad'
                ? {
                    marginTop: '5%',
                    alignSelf: 'center',
                    width: '95%',
                    zIndex: -2,
                  }
                : null
            }>
            <FlatList
              data={
                route?.params?.status === 'FindLoad'
                  ? filteredLoadList
                  : bidData
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCardInfo}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              enableEmptySections={true}
              ListEmptyComponent={
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>Data Not Available</Text>
                </View>
              }
              contentContainerStyle={
                route?.params?.status === 'FindLoad'
                  ? {paddingBottom: '100%', marginTop: '5%'}
                  : {paddingBottom: '5%', paddingTop: '1%'} // Example for other status
              }
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={
                    route?.params?.status === 'FindLoad'
                      ? fetchLoadList
                      : fetchBidList
                  }
                />
              }
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default FindLoadList;
