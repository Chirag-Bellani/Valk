import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Pressable,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import BidBottomModal from './bidBottomModal';
import Share from 'react-native-share';
import loadCardStyles from '../assets/styles/loadCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiPost} from '../services/apiUtility';
import {API_ENDPOINTS} from '../constants/apiEndPoints';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KycModal from './kycModal';
import {EndPoint} from '../services';

const LoadCard = ({
  loadDetail,
  type,
  negotiateTransporterRate,
  firstBidByTrasnporter,
  bidDetails,
}) => {
  const navigation = useNavigation();
  const [isBidModalVisible, setBidModalVisible] = useState(false);
  const [isRateFixed, setRateFixed] = useState(false);
  const [rate, setRate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isNegotiationModalVisible, setIsNegotiationModalVisible] =
    useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const isFocused = useIsFocused();
  const [isKycModalVisible, setIsKycModalVisible] = useState(false);
  const [isKyc, setIsKyc] = useState(0);

  const toggleAnim = useRef(new Animated.Value(0)).current;

  const toggleBidModal = () => {
    setBidModalVisible(!isBidModalVisible);
  };

  const handleCancel = () => {
    toggleBidModal();
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

  // const toggleLorryModal = () => {
  //   setLorryModalVisible(!isLorryModalVisible);
  // };

  // const changeBidStatus = async (status: string) => {
  //   return Alert.alert(
  //     'Are your sure?',
  //     'Are you sure you want to ' + status + ' this bid ?',
  //     [
  //       // The "Yes" button
  //       {
  //         text: 'Yes',
  //         onPress: () => {

  //           const bidData = { ...loadDetail, status };
  //           // Pass the updated truckData to the onAction function
  //           onAction(bidData);

  //           // setStatus(status);
  //           setShowBox(false);
  //         },
  //       },
  //       // The "No" button
  //       // Does nothing but dismiss the dialog when tapped
  //       {
  //         text: 'No',
  //       },
  //     ],
  //   );
  // };

  const handleShare = async () => {
    const role =
      userDetail?.mainDetail?.role === 4
        ? 'Commission agent'
        : userDetail?.mainDetail?.role === 3
        ? 'Shipper'
        : 'Transporter';

    const userLocation =
      userDetail?.mainDetail?.user_location != null
        ? `\n${userDetail.mainDetail.user_location}`
        : '';

    const companyName = userDetail?.mainDetail?.company_name || '';

    const isStandardLoad =
      type === 'FindLoad' || type === 'Current' || type === 'Completed';

    const loadData = isStandardLoad ? loadDetail : loadDetail?.post_load_data;

    const fromLocation = loadData?.from_location || '';
    const toLocation = loadData?.to_location || '';
    const cargo = loadData?.get_cargo?.cargo || '';
    const qty = loadData?.qty || '';
    const unit = loadData?.unit || '';
    const expectedPrice = isStandardLoad
      ? loadDetail?.expected_price
      : loadDetail?.amount;

    const vehicleCategory =
      loadData?.get_vehicle_category?.vehicle_category || '';
    const vehicleType = loadData?.get_vehicle_type?.vehicle_type || '';
    const vehicleSize = loadData?.get_vehicle_size?.vehicle_size;
    const vehicleInfo = `${vehicleCategory} (${vehicleType})${
      vehicleSize ? ` (${vehicleSize})` : ''
    }`;

    const totalPrice = loadData?.expected_price || 0;
    const pricePerTonne = (totalPrice / qty).toFixed(2);

    const postLoadId =
      type === 'FindLoad' || type === 'Current' || type === 'Completed'
        ? loadDetail.id
        : loadDetail?.post_load_id;

    const encodedId = btoa(String(postLoadId));
    const url = `https://valkservices.in/load-details/${encodedId}`;

    const message = `
Hi,

I have a load that needs to be shipped.

Load Details:

📍 From: ${fromLocation}
📍 To: ${toLocation}
📦 Material: ${cargo} (${qty} ${unit})
🚛 Required Lorry Type: ${vehicleInfo}
💸 Price: ${expectedPrice} ₹ ${
      loadData?.price_type === 'Per Tonne'
        ? ` (${pricePerTonne}₹ / Per Tonne)`
        : ''
    }

${url}

Regards,
Valk
${companyName}
${role}${userLocation}
`;

    try {
      const shareOptions = {
        message,
        title: 'Share Load Details',
      };

      const result = await Share.open(shareOptions);

      if (result.action === Share.sharedAction) {
        // Shared successfully
      } else if (result.action === Share.dismissedAction) {
        // Share dismissed
      }
    } catch (error) {
      console.error('Error sharing load details:', error);
    }
  };

  const toggleRateFixed = () => {
    setRateFixed(!isRateFixed);
    Animated.timing(toggleAnim, {
      toValue: isRateFixed ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlerCardPress = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const role = JSON.parse(userInfo).role;
    if (role == 3 || role == 4) {
      navigation.navigate('LoadDetails', {
        post_load_id: loadDetail.id,
        type: type,
      });
    } else if (role == 2) {
      navigation.navigate('LoadDetails', {
        post_load_id:
          type === 'FindLoad' ? loadDetail.id : loadDetail.post_load_id,
        type: type,
        poststatus: loadDetail?.bid_status,
      });
    }
  };

  const userProfileNavigation = () => {
    if (type === 'FindLoad') {
      navigation.navigate('UserProfile', {
        userId: loadDetail?.get_load_post_by?.id,
        bidDetail: {
          bid_status: loadDetail?.post_status,
          bidDetails: bidDetails,
        },
        type: 'LoadCard',
      });
    } else {
      navigation.navigate('UserProfile', {
        userId: loadDetail?.post_load_data?.get_load_post_by?.id,
        bidDetail: {
          bid_status: loadDetail?.bid_status,
          bidDetails: bidDetails,
        },
        type: 'LoadCard',
      });
    }
  };

  const renderStatusMessage = () => {
    if (type === 'FindLoad') return null; // handled separately at the bottom

    const isBooked = loadDetail.post_load_data?.post_status === 'Booked';
    const isCompleted = loadDetail.post_load_data?.post_status === 'Completed';

    switch (true) {
      case type === 'MyBid' &&
        loadDetail.bid_status === 'Lorry_Attached' &&
        isBooked:
        return renderMessage('Request For Lorry Reached');

      case type === 'MyBid' && loadDetail.bid_status === 'Reached' && isBooked:
        return renderMessage('Wait for loaded request');

      case type === 'MyBid' &&
        loadDetail.bid_status === 'Loaded_Request' &&
        isBooked:
        return renderMessage('Loaded Request');

      case type === 'MyBid' &&
        loadDetail.bid_status === 'Payment_Request' &&
        isBooked:
        return renderMessage('Waiting For Payment');

      case type === 'MyBid' && loadDetail.bid_status === 'Loaded' && isBooked:
        return renderMessage('Request for Completion');

      case type === 'MyBid' &&
        loadDetail.bid_status === 'Completed' &&
        isCompleted:
        return (
          <View style={loadCardStyles.completionMessage}>
            <Feather name="thumbs-up" size={18} color={'green'} />
            <Text style={loadCardStyles.completionMessageText}>
              Trip completed, Load dropped at drop point!!
            </Text>
          </View>
        );

      case type === 'MyBid' && loadDetail.bid_status === 'Reject':
        return (
          <View style={loadCardStyles.errorMessage}>
            <Feather name="x" size={18} color={'red'} />
            <Text style={loadCardStyles.errorMessageText}>
              Your Bid Is Rejected
            </Text>
          </View>
        );

      case type === 'MyBid' &&
        (loadDetail.bid_status === 'Pending' ||
          loadDetail.bid_status === 'Reached_Request' ||
          loadDetail.bid_status === 'Completed_Request' ||
          loadDetail.bid_status === 'Negotiate_By_Transporter'):
        return renderMessage('Waiting For Acceptance');

      default:
        return null;
    }
  };

  const renderMessage = text => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View style={loadCardStyles.waitingForAcceptanceContainer}>
        <Feather name="clock" size={18} color={'grey'} />
        <Text style={loadCardStyles.waitingForAcceptanceText}>{text}</Text>
      </View>
    </View>
  );

  useEffect(() => {
    fetchUserDetail();
  }, [isFocused]);

  const getPostStatusColor = () => {
    if (loadDetail?.bid_status === 'Reject') return 'red';
    if (loadDetail?.bid_status === 'Pending') return 'orange';
    if (loadDetail?.bid_status === 'Completed') return '#6AC75A';
    return '#67BAF1'; // for 'Running' or any other status
  };

  return (
    <Pressable
      style={loadCardStyles.card}
      onPress={handlerCardPress}
      disabled={loadDetail?.bid_status === 'Reject'}>
      {type === 'Current' || type === 'Completed' || type === 'MyBid' ? (
        <View
          style={[
            loadCardStyles.postStatus,
            type === 'MyBid' && {backgroundColor: getPostStatusColor()},
          ]}>
          <Text style={{color: 'white', fontWeight: '500', fontSize: 12}}>
            {type === 'Current' || type === 'Completed'
              ? loadDetail?.post_status
              : loadDetail?.bid_status === 'Reject' ||
                loadDetail?.bid_status === 'Pending' ||
                loadDetail?.bid_status === 'Completed'
              ? loadDetail?.bid_status
              : 'Running'}
          </Text>
        </View>
      ) : null}
      <>
        {/* from location */}
        <View style={loadCardStyles.textContainer}>
          {/* From Location */}
          <View style={loadCardStyles.locationRow}>
            <Ionicons
              name="location-sharp"
              color="#4CAF50"
              size={18}
              style={loadCardStyles.icon}
            />
            <Text style={loadCardStyles.locationText}>
              {type === 'FindLoad' || type === 'Current' || type === 'Completed'
                ? loadDetail?.from_location
                : type === 'MyBid'
                ? loadDetail?.post_load_data?.from_location
                : ''}
            </Text>
          </View>

          {/* Dashed line */}
          <View style={loadCardStyles.lineContainer}>
            <View style={loadCardStyles.dottedLine} />
          </View>

          {/* To Location */}
          <View style={loadCardStyles.locationRow}>
            <Ionicons
              name="location-sharp"
              color="#F44336"
              size={18}
              style={loadCardStyles.icon}
            />
            <Text style={loadCardStyles.locationText}>
              {type === 'FindLoad' || type === 'Current' || type === 'Completed'
                ? loadDetail?.to_location
                : type === 'MyBid'
                ? loadDetail?.post_load_data?.to_location
                : ''}
            </Text>
          </View>

          {/* Posted Time + Distance + Share */}
          <View style={loadCardStyles.postedTimeContainer}>
            <Text style={loadCardStyles.postedTimeText}>
              Posted{' '}
              {type === 'FindLoad' || type === 'Current' || type === 'Completed'
                ? moment(loadDetail?.created_at).fromNow()
                : type === 'MyBid'
                ? moment(loadDetail?.post_load_data?.created_at).fromNow()
                : ''}
            </Text>

            <View style={loadCardStyles.rightInfoContainer}>
              <View style={loadCardStyles.distanceContainer}>
                <Text style={loadCardStyles.distanceText}>
                  {type === 'FindLoad' ||
                  type === 'Current' ||
                  type === 'Completed'
                    ? loadDetail?.distance
                    : type === 'MyBid'
                    ? loadDetail?.post_load_data?.distance
                    : ''}
                </Text>
              </View>
              {(loadDetail?.post_status === 'Pending' ||
                loadDetail?.post_load_data?.post_status === 'Pending') &&
                loadDetail?.bid_status !== 'Reject' && (
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
        </View>

        <View style={loadCardStyles.divider} />
        {/* middle section */}
        <View style={loadCardStyles.cardContent}>
          <View style={loadCardStyles.leftContent}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={loadCardStyles.detailRow}>
                <Image
                  source={require('../assets/images/box.png')}
                  style={loadCardStyles.icon}
                />
                <Text style={loadCardStyles.detailText}>
                  {type === 'FindLoad' ||
                  type === 'Current' ||
                  type === 'Completed'
                    ? `${loadDetail?.get_cargo?.cargo} ${
                        loadDetail?.is_odc_consignment === 1
                          ? `(${loadDetail?.length}ft X ${loadDetail?.breadth}ft X ${loadDetail?.height}ft) `
                          : ''
                      }`
                    : type === 'MyBid'
                    ? `${loadDetail?.post_load_data?.get_cargo?.cargo} ${
                        loadDetail?.post_load_data?.is_odc_consignment === 1
                          ? `(${loadDetail?.post_load_data?.length}ft X ${loadDetail?.post_load_data?.breadth}ft X ${loadDetail?.post_load_data?.height}ft) `
                          : ''
                      }`
                    : null}
                </Text>
              </View>
              {(loadDetail?.price_type === 'Per Tonne' ||
                loadDetail?.post_load_data?.price_type === 'Per Tonne') && (
                <View style={loadCardStyles.detailRow}>
                  <Image
                    source={require('../assets/images/rupee.png')}
                    style={loadCardStyles.icon}
                  />
                  <Text style={loadCardStyles.detailText}>
                    {type === 'FindLoad' ||
                    type === 'Current' ||
                    type === 'Completed'
                      ? `${(
                          loadDetail?.expected_price / loadDetail?.qty
                        )?.toFixed(2)}`
                      : type === 'MyBid'
                      ? `${(
                          loadDetail?.post_load_data?.expected_price /
                          loadDetail?.post_load_data?.qty
                        )?.toFixed(2)}`
                      : null}{' '}
                    /{' '}
                    {type === 'FindLoad' ||
                    type === 'Current' ||
                    type === 'Completed'
                      ? loadDetail?.price_type
                      : type === 'MyBid'
                      ? loadDetail?.post_load_data?.price_type
                      : null}
                  </Text>
                </View>
              )}
            </View>
            <View style={loadCardStyles.detailRow}>
              <Image
                source={require('../assets/images/box-truck.png')}
                style={loadCardStyles.icon}
              />

              <Text style={loadCardStyles.detailText}>
                {/* 30.00 Tone(s) Truck */}
                {type === 'FindLoad' ||
                type === 'Current' ||
                type === 'Completed'
                  ? [loadDetail?.qty, loadDetail?.unit, ' ']
                  : type === 'MyBid'
                  ? [
                      loadDetail?.post_load_data?.qty,
                      loadDetail?.post_load_data?.unit,
                      ,
                      ' ',
                    ]
                  : null}
                {type === 'FindLoad' ||
                type === 'Current' ||
                type === 'Completed'
                  ? `${loadDetail?.get_vehicle_category?.vehicle_category} (${loadDetail?.get_vehicle_type?.vehicle_type})` +
                    (loadDetail?.get_vehicle_size?.vehicle_size !== null &&
                    loadDetail?.get_vehicle_size?.vehicle_size !== undefined
                      ? ` (${loadDetail?.get_vehicle_size?.vehicle_size})`
                      : '')
                  : type === 'MyBid'
                  ? `${loadDetail?.post_load_data?.get_vehicle_category?.vehicle_category} (${loadDetail?.post_load_data?.get_vehicle_type?.vehicle_type})` +
                    (loadDetail?.post_load_data?.get_vehicle_size
                      ?.vehicle_size !== null &&
                    loadDetail?.post_load_data?.get_vehicle_size
                      ?.vehicle_size !== undefined
                      ? ` (${loadDetail?.post_load_data?.get_vehicle_size?.vehicle_size})`
                      : '')
                  : null}
              </Text>
            </View>
            <View style={loadCardStyles.detailRow}>
              <Image
                source={require('../assets/images/time.png')}
                style={loadCardStyles.icon}
              />
              <Text style={loadCardStyles.detailText}>
                {type === 'MyBid'
                  ? `${moment(loadDetail?.post_load_data?.pickup_date).format(
                      'DD-MMM-YY',
                    )} `
                  : `${moment(loadDetail?.pickup_date).format('DD-MMM-YY')} `}
                ,{' '}
                {type === 'MyBid'
                  ? `${moment(
                      loadDetail?.post_load_data?.pickup_time,
                      'HH:mm:ss',
                    ).format('h:mm A')} `
                  : `${moment(loadDetail?.pickup_time, 'HH:mm:ss').format(
                      'h:mm A',
                    )} `}
              </Text>
            </View>
          </View>
        </View>

        <View style={loadCardStyles.divider} />
        {/* empty park */}
        {(loadDetail?.get_vehicle_category?.vehicle_category == 'Container' ||
          loadDetail?.post_load_data?.get_vehicle_category?.vehicle_category ==
            'Container') &&
          loadDetail?.empty_park !== null && (
            <>
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                }}>
                <View style={loadCardStyles.emptyParkContainer}>
                  <Text style={loadCardStyles.detailText}>Empty Park: </Text>

                  <Text style={loadCardStyles.detailText}>
                    {type === 'FindLoad' ||
                    type === 'Current' ||
                    type === 'Completed'
                      ? [loadDetail?.empty_park]
                      : loadDetail?.post_load_data?.empty_park}
                  </Text>
                </View>
                <View style={loadCardStyles.divider} />
              </View>
            </>
          )}

        {/* post by name */}
        {userDetail?.mainDetail?.role === 2 && (
          <>
            <View style={loadCardStyles.shipperContainer}>
              <Image
                source={require('../assets/images/profile.png')}
                style={loadCardStyles.shipperIcon}
              />
              <View
                style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                <Pressable onPress={userProfileNavigation}>
                  <Text style={loadCardStyles.shipperText}>
                    {type === 'MyBid'
                      ? `${loadDetail?.post_load_data?.get_load_post_by?.company_name} `
                      : `${loadDetail?.get_load_post_by?.company_name} `}
                  </Text>
                </Pressable>
                <Text style={loadCardStyles.shipperText}>
                  {type === 'MyBid'
                    ? loadDetail?.post_load_data?.get_load_post_by?.role === 3
                      ? 'Shipper'
                      : 'Comission Agent'
                    : loadDetail?.get_load_post_by?.role === 3
                    ? 'Shipper' // Don't show anything if role is 3 and not 'MyBid'
                    : 'Comission Agent'}
                </Text>
              </View>
            </View>
            <View style={loadCardStyles.divider} />
          </>
        )}

        {/* footer section */}
        <View
          style={[
            loadCardStyles.expectedRateContainer,
            {
              backgroundColor: '#ededed',
              paddingVertical: 5,
              paddingHorizontal: 5,
            },
          ]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Text style={loadCardStyles.amountText}>
                ₹
                {type === 'FindLoad' ||
                type === 'Current' ||
                type === 'Completed'
                  ? loadDetail?.expected_price
                  : type === 'MyBid'
                  ? loadDetail?.amount
                  : null}
              </Text>
              {/* <View style={{ backgroundColor: '#e5e5e5', padding: 5, borderRadius: 5, marginLeft: 5 }}>
                <Text style={[loadCardStyles.rateText, { marginLeft: 5 }]}>
                  {type === 'FindLoad' || type === 'Current' || type === 'Completed'
                    ? loadDetail?.price_type
                    : type === 'MyBid'
                      ? loadDetail?.post_load_data?.price_type
                      : null}
                </Text>
              </View> */}
            </View>
            <View
              style={{
                backgroundColor: '#e5e5e5',
                padding: 5,
                borderRadius: 5,
                marginLeft: 5,
              }}>
              <Text style={[loadCardStyles.rateText, {marginLeft: 5}]}>
                {type === 'FindLoad' ||
                type === 'Current' ||
                type === 'Completed'
                  ? 'Expected Rate'
                  : type === 'MyBid'
                  ? 'Bid Amount'
                  : null}
              </Text>
              <Text style={{color: 'black', fontSize: 10, marginLeft: 5}}>
                {type === 'FindLoad' ||
                type === 'Current' ||
                type === 'Completed'
                  ? `(${loadDetail?.advance_per} %) ${loadDetail?.payment_type} `
                  : type === 'MyBid'
                  ? `(${loadDetail?.post_load_data?.advance_per} %) ${loadDetail?.post_load_data?.payment_type} `
                  : null}
              </Text>
            </View>
          </View>
          {type === 'Current' && (
            <Pressable
              style={[loadCardStyles.shareButton, {padding: 10}]}
              onPress={handlerCardPress}>
              <Image
                source={require('../assets/images/bid.png')}
                style={loadCardStyles.shareIcon}
              />
              <Text style={loadCardStyles.shareButtonText}>
                Bids({loadDetail?.total_bids_count})
              </Text>
            </Pressable>
          )}

          {type === 'FindLoad' && (
            <Pressable
              style={[loadCardStyles.shareButton, {padding: 10}]}
              onPress={() => {
                isKyc === 1 ? toggleBidModal() : setIsKycModalVisible(true);
              }}>
              <Image
                source={require('../assets/images/bid.png')}
                // style={{ width: 20, height: 20 }}
                style={loadCardStyles.shareIcon}
              />
              <Text style={loadCardStyles.shareButtonText}>Bid Now</Text>
            </Pressable>
          )}
        </View>
        {/* repost */}
        {type === 'Current' && (
          <Pressable
            style={({pressed}) => [loadCardStyles.repostButton]}
            onPress={() =>
              navigation.navigate('RepostLoad', {loadDetail: loadDetail})
            }>
            <Text style={loadCardStyles.repostButtonText}>Repost</Text>
          </Pressable>
        )}

        {/* status section old */}
        {/* {
          loadDetail.bid_status === 'Pending' &&
          type === 'Current' &&
          loadDetail.post_load_data?.post_status !== 'Booked' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={loadCardStyles.waitingForAcceptanceContainer}>
                <Feather name="clock" size={18} color={'grey'} />
                <Text style={loadCardStyles.waitingForAcceptanceText}>
                  Wait For Lorry Attachment
                </Text>
              </View>
            </View>
          )
        }
        {
          loadDetail.bid_status !== 'Pending' &&
          type !== 'MyBid' &&
          loadDetail.post_status === 'Booked' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={loadCardStyles.waitingForAcceptanceContainer}>
                <Feather name="clock" size={18} color={'grey'} />
                <Text style={loadCardStyles.waitingForAcceptanceText}>
                  Lorry Attachment
                </Text>
              </View>
            </View>
          )
        }
        {
          type === 'MyBid' &&
          loadDetail.bid_status === 'Lorry Attached' &&
          loadDetail.post_load_data?.post_status === 'Booked' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={loadCardStyles.waitingForAcceptanceContainer}>
                <Feather name="clock" size={18} color={'grey'} />
                <Text style={loadCardStyles.waitingForAcceptanceText}>
                  Request For Lorry Reached
                </Text>
              </View>
            </View>
          )
        }

        {
          type === 'MyBid' &&
          loadDetail.bid_status === 'Reached' &&
          loadDetail.post_load_data?.post_status === 'Booked' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={loadCardStyles.waitingForAcceptanceContainer}>
                <Feather name="clock" size={18} color={'grey'} />
                <Text style={loadCardStyles.waitingForAcceptanceText}>
                  Wait for loaded request
                </Text>
              </View>
            </View>
          )
        }

        {
          type === 'MyBid' &&
          loadDetail.bid_status === 'Loaded Request' &&
          loadDetail.post_load_data?.post_status === 'Booked' && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={loadCardStyles.waitingForAcceptanceContainer}>
                  <Feather name="clock" size={18} color={'grey'} />
                  <Text style={loadCardStyles.waitingForAcceptanceText}>
                    Loaded Request
                  </Text>
                </View>
              </View>
            </>
          )
        }
        {
          type === 'MyBid' &&
          loadDetail.bid_status === 'Loaded' &&
          loadDetail.post_load_data?.post_status === 'Booked' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={loadCardStyles.waitingForAcceptanceContainer}>
                <Feather name="clock" size={18} color={'grey'} />
                <Text style={loadCardStyles.waitingForAcceptanceText}>
                  Request for Completion
                </Text>
              </View>
            </View>
          )
        }
        {
          type === 'MyBid' &&
          loadDetail.bid_status === 'Completed' &&
          loadDetail.post_load_data?.post_status === 'Completed' && (
            <View style={loadCardStyles.completionMessage}>
              <Text style={loadCardStyles.completionMessageText}>
                Request completed, Load dropped at drop point!!
              </Text>
            </View>
          )
        }

        {
          type === 'MyBid' &&
          loadDetail.bid_status === 'Reject' && (
            <View style={loadCardStyles.errorMessage}>
              <Text style={loadCardStyles.errorMessageText}>
                Your Bid Is Rejected
              </Text>
            </View>
          )
        }

        {
          type === 'MyBid' &&
          (loadDetail.bid_status === 'Pending' ||
            loadDetail.bid_status === 'Reached_Request' ||
            loadDetail.bid_status === 'Completed_Request' ||
            loadDetail.bid_status === 'Negotiate_By_Transporter') && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={loadCardStyles.waitingForAcceptanceContainer}>
                  <Feather name="clock" size={18} color={'grey'} />
                  <Text style={loadCardStyles.waitingForAcceptanceText}>
                    Waiting For Acceptance
                  </Text>
                </View>
              </View>
            </>
          )
        } */}

        {/* status section new */}
        {/* {renderStatusMessage()} */}
        {type === 'FindLoad' && (
          <>
            {isBidModalVisible && (
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
                  type === 'MyBid' ? 'Negotiate_By_Transporter' : 'addBid'
                }
                // handleSubmit={handleSubmit}
                postLoadId={
                  type === 'MyBid' ? loadDetail?.post_load_id : loadDetail?.id
                }
                bidID={loadDetail?.id}
                handleCancel={handleCancel}
                bidData={loadDetail}
                status={type === 'MyBid' ? 'Negotiate_By_Transporter' : ''}
                loadDetailType={'Load Card'}
                addFirstBid={firstBidByTrasnporter}
              />
            )}
          </>
        )}
        {type === 'MyBid' && isBidModalVisible && (
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
              type === 'MyBid' ? 'Negotiate_By_Transporter' : 'addBid'
            }
            // handleSubmit={handleSubmit}
            postLoadId={
              type === 'MyBid' ? loadDetail?.post_load_id : loadDetail?.id
            }
            bidID={loadDetail?.id}
            handleCancel={handleCancel}
            onNegotiate={negotiateTransporterRate}
            status={type === 'MyBid' ? 'Negotiate_By_Transporter' : ''}
          />
        )}

        {/* old lorry attachmodal status and nogotiaion modal */}
        {(type === 'MyBid' && loadDetail?.bid_status === 'Pending') ||
          (loadDetail?.bid_status === 'Negotiate_By_Shipper' && (
            <>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={loadCardStyles.waitingForAcceptanceContainer}>
                  <Feather name="clock" size={18} color={'grey'} />
                  <Text style={loadCardStyles.waitingForAcceptanceText}>
                    Wait for loaded request
                  </Text>
                </View>
              </View> */}
            </>
          ))}
        {/* {type === 'MyBid' &&
          (loadDetail?.post_load_data?.post_status === 'Pending' ||
            loadDetail?.bid_status === 'Accept') && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {loadDetail?.bid_status === 'Accept' && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View
                        style={loadCardStyles.waitingForAcceptanceContainer}>
                        <Feather name="clock" size={18} color={'grey'} />
                        <Text style={loadCardStyles.waitingForAcceptanceText}>
                          Attach Lorry
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
              {isLorryModalVisible && (
              <AttachLorryModal
                isVisible={isLorryModalVisible}
                onClose={toggleLorryModal}
                loadDetails={loadDetail}
              />
            )}
              Negotiation Modal Component
              {isNegotiationModalVisible && (
              <NegotiationChatModal
                isModalVisible={isNegotiationModalVisible}
                toggleModal={toggleNegotiationModal}
                loadData={loadDetail}
                bidStatus={loadDetail.bid_status}
              />
            )}
            </>
          )} */}
      </>
      <KycModal
        isVisible={isKycModalVisible}
        onClose={() => setIsKycModalVisible(false)}
        userDetail={userDetail}
      />
    </Pressable>
  );
};

export default LoadCard;
