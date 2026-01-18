import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';
import BidCard from '../../components/bidCard';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import messaging from '@react-native-firebase/messaging';
import LoadDetailSkeleton from '../../skeleton/loadDetailSkeleton';
import Share from 'react-native-share';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import loadCardStyles from '../../assets/styles/loadCard';
import KycModal from '../../components/kycModal';
import BidBottomModal from '../../components/bidBottomModal';

const LoadDetails = ({navigation, route}) => {
  const [bids, setBids] = useState([]);
  const [bidsImage, setBidsImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [loadDetail, setLoadDetail] = useState([]);
  const [role, setRole] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [bankDetails, setBankDetails] = useState([]);
  const [isKycModalVisible, setIsKycModalVisible] = useState(false);
  const [isBidModalVisible, setBidModalVisible] = useState(false);
  const [rate, setRate] = useState('');
  const [isRateFixed, setRateFixed] = useState(false);
  const [remarks, setRemarks] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      fetchBidByLoad();
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const toggleBidModal = () => {
    setBidModalVisible(!isBidModalVisible);
  };

  const handleCancel = () => {
    toggleBidModal();
  };

  const toggleRateFixed = () => {
    setRateFixed(!isRateFixed);
    Animated.timing(toggleAnim, {
      toValue: isRateFixed ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleAnim = useRef(new Animated.Value(0)).current;

  const addBankDetails = async bankData => {
    let formData = new FormData();
    formData.append('id', bankData.bid_id);
    formData.append('bank_id', bankData.bank_id);

    try {
      const response = await apiPost(
        API_ENDPOINTS.BID.UPDATE_BANK_DETAILS_BY_BID,
        formData,
      );
      if (response.success) {
        showMessage({
          message: response.message,
          description: '',
          type: 'success',
        });
        fetchBidByLoad();
      } else {
        console.log('Failed to fetch data');
      }
      // setRefreshing(false);
    } catch (error) {
      console.log(error.message);
    } finally {
    }
  };

  const acceptRejectBid = async bidData => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    try {
      let formData = new FormData();
      formData.append('bid_id', bidData.id);
      formData.append('post_load_id', bidData.post_load_id);
      formData.append('bid_status', bidData.status);

      const response = await apiPost(
        API_ENDPOINTS.LOAD.LOAD_ACCEPT_REJECT,
        formData,
      );

      if (response.success) {
        showMessage({
          message: response.message,
          description: '',
          type: 'success',
        });
        fetchBidByLoad();

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

  const onPaymentSuccess = async (paymentResponse, bidData) => {
    try {
      let formData = new FormData();
      formData.append('bid_id', bidData.id);
      formData.append('easepayid', paymentResponse?.payment_response.easepayid);
      formData.append('status', paymentResponse?.payment_response.status);

      const response = await apiPost('payment-success', formData);
      if (response.success) {
        fetchBidByLoad();
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

  const negotiateRate = async negotiateData => {
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
        fetchBidByLoad();

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

  const attachLorryDetail = async lorryData => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('vehicle_id', lorryData.vehicle_id);
    formData.append('bid_id', lorryData.bid_id);
    formData.append('driver_name', lorryData.driver_name);
    formData.append('driver_mobile_no', lorryData.driver_mobile_no);
    formData.append('bid_status', 'Lorry_Attached');

    try {
      const response = await apiPost(
        API_ENDPOINTS.LORRY.ATTACH_LORRY,
        formData,
      );
      if (response.success) {
        showMessage({
          message: response.message,
          type: 'success',
        });
      } else {
        showMessage({
          message: response.message,
          type: 'danger',
        });
      }
      fetchBidByLoad();
    } catch (error) {
      console.log(error.message);
      showMessage({
        message: error.message,
        type: 'danger',
      });
    }
  };

  // fetch load detail by load id
  const getLoadDetailByLoadId = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('type', 'Single');
    formData.append('post_load_id', route.params.post_load_id);
    try {
      const response = await apiPost(
        API_ENDPOINTS.LOAD.GET_LOAD_DETAIL,
        formData,
      );
      if (response.success) {
        setLoadDetail(response.data);
      } else {
        console.log('Failed to fetch data');
        setLoadDetail([]);
      }
      setRefreshing(false);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  // fetch bid by load id
  const fetchBidByLoad = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('post_load_id', route.params.post_load_id);
    try {
      const response = await apiPost(
        API_ENDPOINTS.BID.GET_BIDS_BY_POST_LOAD_ID,
        formData,
      );
      if (response.success) {
        setBids(response.data);
      } else {
        console.log('Failed to fetch data');
        setBids([]);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // fetch user detail
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
          setRole(response.data.mainDetail.role);
        } else {
          console.log('Failed to fetch user details');
        }
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
    } finally {
    }
  };

  const handleShare = async () => {
    try {
      // Check and format user location properly
      const userLocation =
        userDetail?.mainDetail?.user_location &&
        userDetail?.mainDetail?.user_location !== 'null'
          ? `\n📍 ${userDetail?.mainDetail?.user_location}`
          : '';

      const vehicleCategory =
        loadDetail?.get_vehicle_category?.vehicle_category || '';
      const vehicleType = loadDetail?.get_vehicle_type?.vehicle_type || '';
      const vehicleSize = loadDetail?.get_vehicle_size?.vehicle_size;
      const vehicleInfo = `${vehicleCategory} (${vehicleType})${
        vehicleSize ? ` (${vehicleSize})` : ''
      }`;

      const totalPrice = loadDetail?.expected_price || 0;
      const qty = loadDetail?.qty || 1;
      const pricePerTonne = (totalPrice / qty).toFixed(2);

      const encodedId = btoa(String(loadDetail?.id));
      const url = `https://valkservices.in/load-details/${encodedId}`;
      // Construct the message
      const shareOptions = {
        message: `
Hi,

I have a load that needs to be shipped.

📌 **Load Details:**

📍 From: ${loadDetail?.from_location}
📍 To: ${loadDetail?.to_location}
📦 Material: ${loadDetail?.get_cargo?.cargo} ${loadDetail?.qty} ${
          loadDetail?.unit
        }
🚛 Required Lorry Type: ${vehicleInfo}
💸 Price: ${totalPrice}₹ ${
          loadDetail?.price_type === 'Per Tonne'
            ? ` (${pricePerTonne}₹ / Per Tonne)`
            : ''
        }

${url}


**Regards,**
Valk,
${userDetail?.mainDetail?.company_name}
${
  userDetail?.mainDetail?.role === 3 || userDetail?.mainDetail?.role === 4
    ? 'Shipper'
    : 'Transporter'
}${userLocation}
`,
        title: 'Share Load Details',
      };

      // Share the message
      const result = await Share.open(shareOptions);

      if (result.action === Share.sharedAction) {
        // Handle shared action
      } else if (result.action === Share.dismissedAction) {
        // Handle dismissed action
      }
    } catch (error) {
      console.error('Error sharing referral code:', error);
    }
  };

  const fetchBankDetails = async () => {
    try {
      const response = await apiPost(API_ENDPOINTS.BANK.GET_BANK_DETAILS);
      if (response.success) {
        setBankDetails(response.data.get_party_bank_details);
      } else {
        console.log('Failed to fetch data');
        setBankDetails([]);
      }
      // setRefreshing(false);
    } catch (error) {
      console.log(error.message);
    } finally {
    }
  };

  const addBid = async () => {
    const formData = new FormData();
    formData.append('bid_id', route.params.post_load_id);
    formData.append('post_load_id', route.params.post_load_id);
    formData.append('amount', rate);
    formData.append('remarks', remarks);

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
      fetchBidByLoad();
      getLoadDetailByLoadId();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    getLoadDetailByLoadId();
    fetchBidByLoad();
    fetchUserDetail();
    fetchBankDetails();
  }, [isFocused]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <FlatList
          data={[1]}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={() => <LoadDetailSkeleton />}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/cargo-containers.png')}
              style={styles.loadImage}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.material}>
                {loadDetail?.get_cargo?.cargo}
              </Text>
              {loadDetail?.is_odc_consignment === 1 && (
                <Text style={{color: 'black', fontSize: 12}}>
                  ({loadDetail?.length}ft X {loadDetail?.breadth}ft X{' '}
                  {loadDetail?.height}ft)
                </Text>
              )}
              <Text style={styles.postedText}>
                Posted {moment(loadDetail?.created_at).fromNow()}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.price}>₹{loadDetail?.expected_price}</Text>
            {loadDetail?.price_type === 'Per Tonne' && (
              <Text style={{fontSize: 12, color: '#000'}}>
                ({(loadDetail?.expected_price / loadDetail?.qty)?.toFixed(2)} /{' '}
                {loadDetail?.price_type})
              </Text>
            )}
            <Text style={styles.truckType}>
              {loadDetail?.get_vehicle_category?.vehicle_category} |{' '}
              {loadDetail?.qty} {loadDetail?.unit}
            </Text>
            <Text style={styles.truckType}>
              {loadDetail?.get_vehicle_type?.vehicle_type
                ? loadDetail?.get_vehicle_type?.vehicle_type
                : null}
            </Text>
            <Text style={styles.truckType}>
              {[
                loadDetail?.get_vehicle_size?.vehicle_size
                  ? `(${loadDetail?.get_vehicle_size.vehicle_size})`
                  : null,
              ]
                .filter(Boolean)
                .join(' ')}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.routeContainer}>
          <View style={styles.routeHeader}>
            <Text style={styles.sectionTitle}>Route</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              <Text style={styles.distance}>Dist: {loadDetail?.distance}</Text>
              {loadDetail?.post_status === 'Pending' && (
                <TouchableOpacity
                  onPress={handleShare}
                  style={loadCardStyles.topShareicon}>
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color="blue"
                    style={loadCardStyles.shareIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <Ionicons name="location-sharp" color={'#4CAF50'} size={16} />
              <Text style={styles.locationText}>
                {loadDetail?.from_location}
              </Text>
            </View>
            <View style={styles.locationItem}>
              <Ionicons name="location-sharp" color={'#F44336'} size={16} />
              <Text style={styles.locationText}>{loadDetail?.to_location}</Text>
            </View>
          </View>
        </View>

        {(loadDetail?.get_vehicle_category?.vehicle_category == 'Container' ||
          loadDetail?.post_load_data?.get_vehicle_category?.vehicle_category ==
            'Container') &&
          loadDetail?.empty_park !== null && (
            <>
              <View style={styles.divider} />
              <View style={styles.emptyParkContainer}>
                <Text style={styles.sectionTitle}>Empty Park:</Text>

                <Text style={styles.locationText}>
                  {/* 30.00 Tone(s) Truck */}
                  {loadDetail?.empty_park}
                </Text>
              </View>
            </>
          )}

        {userDetail?.mainDetail?.role === 2 && (
          <>
            <View style={loadCardStyles.divider} />
            <Pressable
              style={loadCardStyles.shipperContainer}
              onPress={() =>
                navigation.navigate('UserProfile', {
                  userId: loadDetail?.get_load_post_by?.id,
                  bidDetail: {bid_status: loadDetail?.post_status},
                  type: 'LoadDetails',
                })
              }>
              <Image
                source={require('../../assets/images/profile.png')}
                style={loadCardStyles.shipperIcon}
              />
              <View
                style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={loadCardStyles.shipperText}>
                  {loadDetail?.get_load_post_by?.company_name}
                </Text>
                <Text style={loadCardStyles.shipperText}>
                  {loadDetail?.get_load_post_by?.role === 3
                    ? 'Shipper'
                    : 'Comission Agent'}
                </Text>
              </View>
            </Pressable>
          </>
        )}

        <View style={styles.divider} />
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>PICKUP</Text>
            <Text style={styles.footerValue}>
              {moment(loadDetail?.pickup_date).format('DD MMM YYYY')}
            </Text>
            <Text style={styles.footerValue}>
              {moment(loadDetail?.pickup_time, 'HH:mm:ss').format('h:mm A')}
            </Text>
          </View>

          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>PAYMENT TERMS</Text>
            <Text style={styles.footerValue}>
              {loadDetail?.payment_type === 'Advance'
                ? `${loadDetail?.advance_per}% Advance`
                : loadDetail?.payment_type}
            </Text>
          </View>

          {userDetail?.mainDetail?.role === 2 &&
            bids.length == 0 &&
            route.params?.poststatus !== 'Reject' && (
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => {
                  userDetail?.mainDetail?.get_user_party_detail?.is_kyc === 1
                    ? toggleBidModal()
                    : setIsKycModalVisible(true);
                }}>
                <Image
                  source={require('../../assets/images/bid.png')}
                  style={styles.shareIcon}
                />
                <Text style={styles.shareButtonText}>Bid Now</Text>
              </TouchableOpacity>
            )}
        </View>
      </View>

      {/* Bids List */}
      {!loading && bids.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Data Not available</Text>
        </View>
      ) : (
        <FlatList
          // data={bids.filter(bid => bid.bid_status !== 'Reject')}
          data={bids}
          renderItem={({item}) => (
            <BidCard
              bidDetail={item}
              loadData={loadDetail}
              onAction={acceptRejectBid}
              onNegotiate={negotiateRate}
              role={role}
              onLorryAttach={attachLorryDetail}
              onPaymentSuccess={onPaymentSuccess}
              bankDetails={bankDetails}
              onBankUpdate={addBankDetails}
            />
          )}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.bidsList}
        />
      )}
      <BidBottomModal
        isModalVisible={isBidModalVisible}
        toggleModal={toggleBidModal}
        rate={rate}
        setRate={setRate}
        isRateFixed={isRateFixed}
        toggleRateFixed={toggleRateFixed}
        toggleAnim={toggleAnim}
        remarks={remarks}
        setRemarks={setRemarks}
        requestType={
          route?.params?.type === 'MyBid'
            ? 'Negotiate_By_Transporter'
            : 'addBid'
        }
        // handleSubmit={handleSubmit}
        postLoadId={route?.params?.post_load_id}
        bidID={route?.params?.bid_id}
        handleCancel={handleCancel}
        bidData={loadDetail}
        status={
          route?.params.type === 'MyBid' ? 'Negotiate_By_Transporter' : ''
        }
        loadDetailType={'Load Card'}
        addFirstBid={addBid}
      />
      <KycModal
        isVisible={isKycModalVisible}
        onClose={() => setIsKycModalVisible(false)}
        userDetail={userDetail}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  loadImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  material: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  postedText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  truckType: {
    fontSize: 13,
    // fontWeight: 'bold',
    flex: 1,
    color: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  routeContainer: {
    // marginBottom: 8,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  distance: {
    fontSize: 14,
    color: '#333',
  },
  locationContainer: {
    marginTop: 4,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flexShrink: 1,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    alignItems: 'flex-start',
  },
  footerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0032e8', // Modern blue color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20, // More rounded look
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Shadow for Android
  },
  shareIcon: {
    width: 18,
    height: 18,
    tintColor: 'white',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
  },
  bidsList: {
    // paddingHorizontal: 16,
  },
  documentsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  documentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  tabsContainer: {
    marginTop: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  tabButton: {
    backgroundColor: '#e2e2e2',
    padding: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeTab: {
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  activeTabText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  emptyParkContainer: {
    padding: 5,
    flexDirection: 'row',
  },
});
export default LoadDetails;
