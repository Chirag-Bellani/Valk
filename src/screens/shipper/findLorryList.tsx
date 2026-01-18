import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  RefreshControl,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LorryCard from '../../components/lorryCard';
import {useIsFocused} from '@react-navigation/native';
import styles from '../../assets/styles/main';
import GooglePlacesSearch from '../../components/googlePlaceSearch';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import LorryCardSkeleton from '../../skeleton/lorryCardSkeleton';
import PartyCard from './findPartyCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FindLorryList = ({route, navigation}) => {
  const isFocused = useIsFocused();
  const [currentLocation, setCurrentLocation] = useState('');
  const [filteredPartyList, setFilteredPartyList] = useState([]);
  const [partyList, setPartyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [userDetail, setUserDetail] = useState({});
  const [locationLatitude, setlocationLatitude] = useState('');
  const [locationLognitude, setLocationLognitude] = useState('');

  const fetchPartyList = async () => {
    try {
      let formData = new FormData();
      formData.append('latitude', locationLatitude);
      formData.append('longitude', locationLognitude);
      // formData.append('user_location', currentLocation);
      console.log('formData', formData);
      const response = await apiPost(
        API_ENDPOINTS.LORRY.GET_PARTY_PROFILE_LIST,
        formData,
      );

      if (response.success) {
        console.log('response', response.data.length);
        setPartyList(response.data);
        setFilteredPartyList(response.data);
        // setlocationLatitude('');
        // setLocationLognitude('');
      } else {
        setPartyList([]);
        setFilteredPartyList([]);
      }
    } catch (error) {
      console.error('Error fetching lorry list:', error.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
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
          // await AsyncStorage.setItem('userInfo', JSON.stringify(json.data));
        } else {
          console.log('Failed to fetch user details');
        }
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
    } finally {
    }
  };

  const renderCardInfo = ({item}) => (
    <PartyCard
      item={item}
      key={item.id}
      navigation={navigation}
      userDetail={userDetail}
    />
  );

  useEffect(() => {
    fetchPartyList();
    fetchUserDetail();
  }, [isFocused]);

  const handleFrom = (data, details) => {
    setlocationLatitude(details?.geometry?.location?.lat);
    setLocationLognitude(details?.geometry?.location?.lng);
    setCurrentLocation(data?.description);
  };

  // const handleSearch = () => {
  //   setLoading(true);

  //   // Clear the search text

  //   const previousState = [...partyList];
  //   const filteredData = partyList.filter(item =>
  //     item?.mainDetail?.user_location?.includes(currentLocation),
  //   );
  //   console.log('currentLocation', currentLocation);
  //   console.log('filteredData', filteredData);
  //   if (filteredData.length === 0) {
  //     // Reset to the previous state
  //     setFilteredPartyList(previousState);
  //   } else {
  //     // Update with the filtered data
  //     setFilteredPartyList(filteredData);
  //   }
  //   setCurrentLocation('');
  //   setLoading(false);
  // };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
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
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{flex: 1}}>
        <>
          <View style={{height: '30%', position: 'relative'}}>
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
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              zIndex: 10,
            }}>
            <View
              style={{
                width: '90%',
                borderColor: 'lightgrey',
                borderWidth: 1,
                alignSelf: 'center',
                borderRadius: 15,
                position: 'relative',
              }}>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Ionicons name="location-outline" color={'grey'} size={22} />
                <GooglePlacesSearch
                  onPlaceSelected={handleFrom}
                  onChangeText={text => {
                    if (text === '') {
                      // User cleared the input completely
                      setlocationLatitude('');
                      setLocationLognitude('');
                    }
                  }}
                  placeHolder={'Search Current Location'}
                  customStyles={{
                    textInputContainer: {
                      width: '100%',
                      paddingHorizontal: 5,
                    },
                    textInput: {
                      // paddingTop: 20,
                      color: 'black',
                    },
                    listView: {
                      position: 'absolute',
                      top: 40,
                      backgroundColor: '#fff',
                      borderRadius: 7,
                      shadowColor: '#000',
                      marginTop: 10,
                      shadowOffset: {width: 0, height: 1},
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
                backgroundColor: loading ? '#a1a1a1' : '#0032e8',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: '6%',
                borderRadius: 10,
                zIndex: -1,
              }}
              onPress={fetchPartyList}
              disabled={loading}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </>
        {!loading && filteredPartyList.length === 0 && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Data Not Found</Text>
          </View>
        )}
        {!loading && filteredPartyList.length !== 0 && (
          <View style={{paddingVertical: 10}}>
            <FlatList
              data={filteredPartyList}
              // data={dummyData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCardInfo}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: '80%'}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => fetchPartyList()}
                />
              }
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default FindLorryList;
