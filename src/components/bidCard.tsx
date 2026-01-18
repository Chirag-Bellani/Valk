import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Alert,
  Pressable,
} from 'react-native';
import React, {useState, useRef} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BidBottomModal from './bidBottomModal';
import Feather from 'react-native-vector-icons/Feather';
import NegotiationChatModal from './negotiationChatModal';
import bidCardStyles from '../assets/styles/bidCard';
import NegotiationChatButton from './negotiationChatButton';
import LrOrInvoiceDownlodModal from './lrOrInvoiceDownlodModal';
import AttachLorryModal from '../screens/transporter/attachLorryModal';
import PayButton from './payButton';
import {callPaymentGateway} from '../services/paymentService';
import {replaceUnderscoreWithSpace} from '../utils';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import TripProgress from './tripstatusIndicator';
import SelectBankAccountModal from './selectBankAccountModal';
import {API_ENDPOINTS} from '../constants/apiEndPoints';
import {apiPost} from '../services/apiUtility';
import {showMessage} from 'react-native-flash-message';
import BankDetails from './bankDetails';

const BidCard = ({
  bidDetail,
  loadData,
  onAction,
  onNegotiate,
  role,
  onLorryAttach,
  onPaymentSuccess,
  bankDetails,
  onBankUpdate,
}) => {
  const [isBidModalVisible, setBidModalVisible] = useState(false);
  const [isAddAccountModalVisible, setAddAccountModalVisible] = useState(false);
  const [isDownlodModalVisible, setDownlodModalVisible] = useState(false);
  const [isLorryModalVisible, setLorryModalVisible] = useState(false);
  const [isNegotiationModalVisible, setIsNegotiationModalVisible] =
    useState(false);
  const [rate, setRate] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isRateFixed, setRateFixed] = useState(false);
  const [showBox, setShowBox] = useState(true);
  const navigation = useNavigation();
  const toggleAnim = useRef(new Animated.Value(0)).current;

  const toggleBidModal = () => {
    setBidModalVisible(!isBidModalVisible);
  };

  const toggleAddAccountModal = () => {
    setAddAccountModalVisible(!isAddAccountModalVisible);
  };

  const toggleDownlodModal = () => {
    setDownlodModalVisible(!isDownlodModalVisible);
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

  // Negotiation Modal Toggle
  const toggleNegotiationModal = () => {
    setIsNegotiationModalVisible(!isNegotiationModalVisible);
  };

  const changeBidStatus = async status => {
    let status_msg = '';

    // Set status message based on bid status
    switch (status) {
      case 'Accept':
        status_msg = 'Accept';
        break;
      case 'Reject':
        status_msg = 'Reject';
        break;
      case 'Reached_Request':
        status_msg = 'Mark As Reached Request';
        break;
      case 'Accept_Reached':
        status_msg = 'Accept Reached Request';
        break;
      case 'Reject_Reached':
        status_msg = 'Reject Reached Request';
        break;
      case 'Loaded_Request':
        status_msg = 'Mark As Loaded Request';
        break;
      case 'Accept_Loaded':
        status_msg = 'accept loaded request';
        break;
      case 'Reject_Loaded':
        status_msg = 'Reject Loaded Request';
        break;
      case 'Completed_Request':
        status_msg = 'Mark As Completed Request';
        break;
      case 'Accept_Completed':
        status_msg = 'Accept Completed Request';
        break;
      case 'Reject_Completed':
        status_msg = 'Reject Completed Request';
        break;
      default:
        status_msg = 'perform this action';
        break;
    }

    return Alert.alert(
      'Are your sure?',
      `Are you sure you want to  ${status_msg}  this bid ?`,
      [
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            const bidData = {...bidDetail, status};

            onAction(bidData);
            setShowBox(false);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'No',
        },
      ],
    );
  };

  const toggleLorryModal = () => {
    setLorryModalVisible(!isLorryModalVisible);
  };

  const handlePayment = async bidId => {
    try {
      const paymentResponse = await callPaymentGateway(bidId);

      {
        paymentResponse.result === 'payment_successfull' &&
          onPaymentSuccess(paymentResponse, bidDetail);
      }

      // Handle the successful payment response
    } catch (error) {
      console.error('Payment Error:', error);
    }
  };

  const buttonConfigs = [
    {
      id: 'accept',
      label: 'Accept',
      icon: <AntDesign name="checkcircle" size={13} color={'white'} />,
      backgroundColor: 'green',
      condition: (bidDetail, role, loadData) => {
        if (role === 2) {
          return ['Negotiate_By_Shipper'].includes(bidDetail?.bid_status);
        }
        if (role === 3 || role === 4) {
          return [''].includes(bidDetail?.bid_status);
        }
        return false; // Default to false for other roles or invalid roles
      },
      onPress: () => changeBidStatus('Accept'),
    },
    {
      id: 'reject',
      label: 'Reject',
      icon: <Entypo name="circle-with-cross" size={13} color={'white'} />,
      backgroundColor: 'red',
      condition: (bidDetail, role) => {
        if (role === 2) {
          return ['Negotiate_By_Shipper'].includes(bidDetail?.bid_status);
        }
        if (role === 3 || role === 4) {
          return ['Pending', 'Negotiate_By_Transporter'].includes(
            bidDetail?.bid_status,
          );
        }
        return false; // Default to false for other roles or invalid roles
      },
      // condition: (bidDetail, role) =>
      //   ['Pending', 'Negotiate_By_Transporter'].includes(bidDetail?.bid_status) && role !== 2,
      onPress: () => changeBidStatus('Reject'),
    },
    {
      id: 'negotiate',
      label: 'Negotiate',
      backgroundColor: '#2E73F2',
      condition: (bidDetail, role) => {
        if (role === 2) {
          return ['Negotiate_By_Shipper'].includes(bidDetail?.bid_status);
        }
        if (role === 3 || role === 4) {
          return ['Pending', 'Negotiate_By_Transporter'].includes(
            bidDetail?.bid_status,
          );
        }
        return false; // Default to false for other roles or invalid roles
      },
      onPress: toggleBidModal,
    },
    {
      id: 'attachLorry',
      label: 'Attach Lorry',
      icon: <Feather name="truck" size={16} color="#FFFFFF" />,
      backgroundColor: '#0032e8',
      condition: (bidDetail, role) =>
        bidDetail?.bid_status === 'Accept' && role === 2,
      onPress: toggleLorryModal,
    },
    {
      id: 'markReached',
      label: 'Ready For Lorry',
      icon: <Feather name="truck" size={16} color="#FFFFFF" />,
      backgroundColor: '#2E73F2',
      condition: (bidDetail, role) =>
        role === 2 &&
        bidDetail?.bid_status === 'Lorry_Attached' &&
        bidDetail?.post_load_data?.post_status === 'Booked',
      onPress: () => changeBidStatus('Reached_Request'),
    },
    {
      id: 'markLoaded',
      label: 'Request for Load Loaded',
      icon: <Feather name="truck" size={16} color={'white'} />,
      backgroundColor: 'blue',
      condition: (bidDetail, role) =>
        bidDetail?.bid_status === 'Reached' && role !== '2',
      onPress: () => changeBidStatus('Loaded_Request'),
    },
    {
      id: 'completionRequest',
      label: 'Reach Now?',
      icon: <Feather name="truck" size={16} color="#FFFFFF" />,
      backgroundColor: '#2E73F2',
      condition: (bidDetail, role) =>
        role === 2 &&
        bidDetail?.bid_status === 'Loaded' &&
        bidDetail?.post_load_data?.post_status === 'Booked',
      onPress: () => changeBidStatus('Completed_Request'),
    },
    {
      id: 'Yes',
      label: 'Yes',
      icon: <AntDesign name="checkcircle" size={13} color={'white'} />,
      backgroundColor: 'green',
      condition: (bidDetail, role) => {
        if (role === 2) {
          // return ['Loaded_Request'].includes(bidDetail?.bid_status);
        }
        if (role === 3 || role === 4) {
          return ['Completed_Request', 'Reached_Request'].includes(
            bidDetail?.bid_status,
          );
        }
        return false; // Default to false for other roles or invalid roles
      },
      onPress: () => {
        // Check if the bid status is 'Reached Request'
        if (bidDetail?.bid_status === 'Reached_Request') {
          var status = 'Accept_Reached';
        } else if (bidDetail?.bid_status === 'Loaded_Request') {
          var status = 'Accept_Loaded';
        } else if (bidDetail?.bid_status === 'Completed_Request') {
          var status = 'Accept_Completed';
        }
        changeBidStatus(status);
      },
    },
    {
      id: 'no',
      label: 'No',
      icon: <Entypo name="circle-with-cross" size={13} color={'white'} />,
      backgroundColor: 'red',
      condition: (bidDetail, role) => {
        if (role === 2) {
          // return ['Loaded_Request'].includes(bidDetail?.bid_status);
        }
        if (role === 3 || role === 4) {
          return ['Completed_Request', 'Reached_Request'].includes(
            bidDetail?.bid_status,
          );
        }
        return false; // Default to false for other roles or invalid roles
      },
      onPress: () => {
        // Check if the bid status is 'Reached Request'
        if (bidDetail?.bid_status === 'Reached_Request') {
          var status = 'Reject_Reached';
          // Change the bid status to 'Reject'
        } else if (bidDetail?.bid_status === 'Completed_Request') {
          var status = 'Reject_Completed';
        }
        changeBidStatus(status);
      },
    },
  ];

  const statusTexts = {
    Pending: {
      2: 'Waiting For Acceptance',
      3: '',
      4: '',
    },
    Accept: {
      2: '', // Role 2 should not see this
      3: 'Wait For Lorry Attachment',
      4: 'Wait For Lorry Attachment',
    },
    Negotiate_By_Shipper: {
      // Default to blank if no role-specific logic applies
      2: '', // Role 2 should not see this
      3: 'Waiting For Acceptance', // Role 3-specific text
      4: 'Waiting For Acceptance', // Role 3-specific text
    },
    Negotiate_By_Transporter: {
      // Default to blank if no role-specific logic applies
      2: 'Waiting For Acceptance', // Role 2-specific text
      3: '', // Role 3 should not see this
      4: '', // Role 3 should not see this
    },
    Payment_Request: {
      2: 'Waiting For Acceptance', // Role 2-specific text
      3: '', // Role 3 should not see this
      4: '', // Role 3 should not see this
    },
    Lorry_Attached: {
      2: '', // Role 2 should not see this
      3: 'Lorry Attached', // Role 3-specific text,
      4: 'Lorry Attached', // Role 3-specific text,
    },
    Reached_Request: {
      2: 'Waiting For Acceptance', // Role 2 should not see this
      3: '',
      4: '',
    },
    Reached: {
      2: 'Wait For Load Request', // Role 2 should not see this
      3: '', // Role 3-specific text,
      4: '', // Role 3-specific text,
    },
    Loaded_Request: {
      2: 'Waiting For Payment', // Role 2 should not see this
      3: '', // Role 3-specific text,
      4: '', // Role 3-specific text,
    },
    Loaded: {
      2: '', // Role 2 should not see this
      3: 'Wait For Trip Completion', // Role 3-specific text,
      4: 'Wait For Trip Completion', // Role 3-specific text,
    },
    Completed_Request: {
      2: 'Waiting For Acceptance', // Role 2 should not see this
      3: '', // Role 3-specific text,
      4: '', // Role 3-specific text,
    },
    Completed: {
      2: 'Trip Completed', // Role 2 should not see this
      3: 'Trip Completed', // Role 3-specific text,
      4: 'Trip Completed', // Role 3-specific text,
    },
  };

  const statusLabels = {
    Reject: {
      2: 'Bid Rejected', // Role 2 should not see this
      3: 'Bid Rejected', // Role 3-specific text,
      4: 'Bid Rejected', // Role 3-specific text,
    },
    Reached_Request: {
      2: '', // Role 2 should not see this
      3: 'Lorry Received?',
      4: 'Lorry Received?',
    },
    Loaded_Request: {
      2: '', // Role 2 should not see this
      3: 'Load Loaded?', // Role 3-specific text,
      4: 'Load Loaded?', // Role 3-specific text,
    },
    Completed_Request: {
      2: '', // Role 2 should not see this
      3: 'Load Delivered?', // Role 3-specific text,
      4: 'Load Delivered?', // Role 3-specific text,
    },
    Completed: {
      default: 'Request Completed Successfully!',
    },
  };

  const getStatusText = (bidStatus, role) => {
    const status = statusTexts[bidStatus];
    if (!status) return null;
    return status[role] || ''; // Use role-specific text if available, otherwise default.
  };

  const getStatusLabel = (bidStatus, role) => {
    const status = statusLabels[bidStatus];
    if (!status) return null;
    return status[role] || ''; // Use role-specific text if available, otherwise default.
  };

  const statusText = getStatusText(bidDetail?.bid_status, role);
  const statusLabel = getStatusLabel(bidDetail?.bid_status, role);

  const renderButtons = () => {
    return buttonConfigs
      .filter(config => config.condition(bidDetail, role, loadData)) // Filter buttons based on conditions
      .map(config => (
        <TouchableOpacity
          key={config?.id}
          style={[
            bidCardStyles.actionButton,
            {backgroundColor: config?.backgroundColor, marginLeft: 10},
          ]}
          onPress={config?.onPress}>
          {config?.icon && config?.icon}
          <Text style={bidCardStyles.buttonText}>{config?.label}</Text>
        </TouchableOpacity>
      ));
  };

  const NegotiationButton = ({onPress}) => (
    <View style={{marginLeft: 10}}>
      <NegotiationChatButton onPress={onPress} />
    </View>
  );

  return (
    <>
      <View style={bidCardStyles.container}>
        <View style={bidCardStyles.topRow}>
          <View>
            <View style={{flexDirection: 'row'}}>
              {(role === 3 || role === 4) && (
                <>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => {
                      const userId =
                        role === 2
                          ? loadData?.get_load_post_by?.id
                          : bidDetail?.get_bid_by?.id;

                      navigation.navigate('UserProfile', {
                        userId,
                        bidDetail,
                        type: 'BidCard',
                      });
                    }}
                    activeOpacity={0.5}>
                    {bidDetail?.get_bid_by?.bid_by_logo_url ? (
                      <Image
                        source={{
                          uri: bidDetail?.get_bid_by?.bid_by_logo_url,
                        }}
                        style={bidCardStyles.bidderLogo}
                      />
                    ) : (
                      <Image
                        source={require('../assets/images/profile.png')}
                        style={bidCardStyles.bidderLogo}
                      />
                    )}
                    <Text style={bidCardStyles.bidderName}>
                      {bidDetail?.bid_status === 'Pending' ||
                      bidDetail?.bid_status === 'Reject' ||
                      bidDetail?.bid_status === 'Negotiate_By_Shipper' ||
                      bidDetail?.bid_status === 'Negotiate_By_Transporter'
                        ? bidDetail?.get_bid_by?.company_name
                        : bidDetail?.get_bid_by?.company_name}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {role === 2 && (
                <>
                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '95%',
                    }}>
                    {/* Left side - Bid Amount */}
                    <View style={{flex: 1}}>
                      <Text
                        style={[bidCardStyles.amountText, {textAlign: 'left'}]}>
                        ₹{bidDetail?.amount}
                      </Text>
                      <Text
                        style={[
                          bidCardStyles.bidAmountText,
                          {textAlign: 'left'},
                        ]}>
                        Bid Amount ({loadData?.price_type})
                      </Text>
                    </View>

                    {/* Right side - Bid Status */}
                    <View>
                      <Text
                        style={[
                          bidCardStyles.statusText,
                          {fontSize: 15},
                          {
                            color:
                              bidDetail?.bid_status === 'Reject' ||
                              bidDetail?.bid_status === 'Pending'
                                ? 'red'
                                : bidDetail?.bid_status === 'Accept' ||
                                  bidDetail?.bid_status === 'Completed'
                                ? 'green'
                                : '#eba80c',
                          },
                        ]}>
                        {replaceUnderscoreWithSpace(bidDetail?.bid_status)}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
            <Text style={bidCardStyles.vehicleText}></Text>
            {bidDetail?.remarks !== null && (
              <Text style={bidCardStyles.vehicleText}>
                {bidDetail?.remarks}
              </Text>
            )}
          </View>
          {(role === 3 || role === 4) && (
            <View style={bidCardStyles.amountContainer}>
              <Text style={bidCardStyles.amountText}>₹{bidDetail?.amount}</Text>
              <Text style={bidCardStyles.bidAmountText}>
                Bid Amount ({loadData?.price_type})
              </Text>
              <Text
                style={[
                  bidCardStyles.statusText,
                  {
                    color:
                      bidDetail?.bid_status === 'Reject' ||
                      bidDetail?.bid_status === 'Pending'
                        ? 'red'
                        : bidDetail?.bid_status === 'Accept' ||
                          bidDetail?.bid_status === 'Completed'
                        ? 'green'
                        : '#eba80c',
                  },
                ]}>
                {replaceUnderscoreWithSpace(bidDetail?.bid_status)}
              </Text>
            </View>
          )}
        </View>
        <View style={bidCardStyles.actionButtonContainer}>
          {statusLabel ? ( // Check if statusText is not empty
            <Text style={bidCardStyles.loadedRequestText}>{statusLabel}</Text>
          ) : null}
          {/* Accepet Reject As per Shiper or transporter role */}
          {statusText ? ( // Check if statusText is not empty
            <View style={bidCardStyles.waitingForAcceptanceContainer}>
              {bidDetail?.bid_status === 'Completed' ? (
                <AntDesign name="checkcircle" size={18} color={'green'} />
              ) : (
                <Feather name="clock" size={18} color={'grey'} />
              )}
              <Text style={bidCardStyles.waitingForAcceptanceText}>
                {statusText}
              </Text>
            </View>
          ) : null}
          {((loadData?.payment_type === 'Advance' &&
            (bidDetail?.bid_status === 'Payment_Request' ||
              bidDetail?.bid_status === 'Negotiate_By_Transporter' ||
              bidDetail?.bid_status === 'Pending')) ||
            bidDetail?.bid_status === 'Loaded_Request') &&
            (role === 3 || role === 4) && (
              <View style={{width: '20%', paddingVertical: 4}}>
                <PayButton onPress={() => handlePayment(bidDetail?.id)} />
              </View>
            )}
          {renderButtons()}
          {bidDetail?.bid_status !== 'Completed' && (
            <View style={{marginLeft: 13}}>
              <NegotiationButton onPress={toggleNegotiationModal} />
            </View>
          )}
          {bidDetail?.bid_status === 'Completed' && (
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                padding: 12,
                backgroundColor: '#0032e8', // Change background when disabled
                // justifyContent: 'center',
                // alignItems: 'center',
                alignSelf: 'flex-end',
                borderRadius: 10,
                zIndex: -1,
              }}
              onPress={toggleDownlodModal}>
              <Feather name="download" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
        {/* old driver details */}
        {bidDetail?.bid_status !== 'Pending' &&
          bidDetail?.bid_status !== 'Negotiate_By_Shipper' &&
          bidDetail?.bid_status !== 'Negotiate_By_Transporter' &&
          bidDetail?.bid_status !== 'Reject' &&
          bidDetail?.bid_status !== 'Payment_request' &&
          role === 2 &&
          (bidDetail?.get_bank_by_bid !== null ? (
            <BankDetails bankData={bidDetail?.get_bank_by_bid} />
          ) : (
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                padding: 12,
                marginBottom: 5,
                backgroundColor: '#0032e8', // Change background when disabled
                // justifyContent: 'center',
                // alignItems: 'center',
                alignSelf: 'center',
                borderRadius: 10,
                zIndex: -1,
              }}
              onPress={toggleAddAccountModal}>
              <Text style={{color: '#fff'}}>
                Add Recevied Amount Bank Account
              </Text>
            </TouchableOpacity>
          ))}
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
            // handleSubmit={handleSubmit}
            postLoadId={bidDetail?.post_load_id}
            bidID={bidDetail?.id}
            bidData={bidDetail}
            handleCancel={handleCancel}
            requestType={'negotiate'}
            status={
              role === 2 ? 'Negotiate_By_Transporter' : 'Negotiate_By_Shipper'
            }
            // status={'Negotiate_By_Shipper'}
            onNegotiate={onNegotiate}
          />
        )}
        {isNegotiationModalVisible && (
          <NegotiationChatModal
            isModalVisible={isNegotiationModalVisible}
            toggleModal={toggleNegotiationModal}
            loadData={bidDetail}
            bidStatus={bidDetail?.bid_status}
            type="shipper"
          />
        )}
        {isDownlodModalVisible && (
          <LrOrInvoiceDownlodModal
            isDownlodModalVisible={isDownlodModalVisible}
            toggleModal={toggleDownlodModal}
            status={bidDetail?.bid_status}
            loadData={loadData}
            onpress={() => setDownlodModalVisible(false)}
          />
        )}
        {isLorryModalVisible && (
          <AttachLorryModal
            isVisible={isLorryModalVisible}
            onClose={toggleLorryModal}
            bidDetails={bidDetail}
            onLorryAttach={onLorryAttach}
          />
        )}
        {role === 2 && (
          <SelectBankAccountModal
            isModalVisible={isAddAccountModalVisible}
            toggleModal={toggleAddAccountModal}
            handleCancel={toggleAddAccountModal}
            data={bankDetails}
            bidDetails={bidDetail}
            onChange={setBankAccount}
            value={bankAccount}
            onBankUpdate={onBankUpdate}
            // renderItem={(item) => (
            //   <View style={bidCardStyles.itemContainer}>
            //     <Text style={bidCardStyles.bankName}>{item.AccountNo} / {item.bankName}</Text>
            //   </View>
            // )}
          />
        )}
      </View>
      {/* Documents Section */}
      {!(
        bidDetail?.bid_status === 'Pending' ||
        bidDetail?.bid_status === 'Negotiate_By_Transporter' ||
        bidDetail?.bid_status === 'Negotiate_By_Shipper' ||
        bidDetail?.bid_status === 'Reject' ||
        bidDetail?.bid_status === 'Payment_Request'
      ) && (
        <View style={bidCardStyles.documentsSection}>
          <Pressable
            style={bidCardStyles.documentsCard}
            onPress={() =>
              navigation.navigate('ManageDocuments', {
                bidData: bidDetail,
                role: role,
              })
            }>
            <View style={bidCardStyles.documentsHeader}>
              <View style={{flexDirection: 'row'}}>
                <FontAwesome name="file-alt" size={20} color="#333" />
                <Text style={bidCardStyles.documentsTitle}>
                  Transit documents
                </Text>
              </View>
              <View>
                <FontAwesome
                  name="chevron-circle-right"
                  size={20}
                  color="#333"
                />
              </View>
            </View>

            <View style={bidCardStyles.tabsContainer}>
              <View
                style={[
                  bidCardStyles.tabButton,
                  bidDetail?.lr_bilty !== null && {backgroundColor: '#bdf7b0'},
                ]}>
                <Text style={[bidCardStyles.tabText]}>LR / Bilty</Text>
              </View>

              <View
                style={[
                  bidCardStyles.tabButton,
                  bidDetail?.driver_doc !== null && {
                    backgroundColor: '#bdf7b0',
                  },
                ]}>
                <Text style={[bidCardStyles.tabText]}>Driver Doc</Text>
              </View>
              <View
                style={[
                  bidCardStyles.tabButton,
                  bidDetail?.pod !== null && {backgroundColor: '#bdf7b0'},
                ]}>
                <Text style={[bidCardStyles.tabText]}>POD</Text>
              </View>
              <View
                style={[
                  bidCardStyles.tabButton,
                  bidDetail?.e_way !== null && {backgroundColor: '#bdf7b0'},
                ]}>
                <Text style={[bidCardStyles.tabText]}>E-Way</Text>
              </View>
            </View>
          </Pressable>
        </View>
      )}
      {bidDetail?.bid_status !== 'Negotiate_By_Transporter' &&
        bidDetail?.bid_status !== 'Pending' &&
        bidDetail?.bid_status !== 'Negotiate_By_Shipper' &&
        bidDetail?.bid_status !== 'Reject' &&
        bidDetail?.bid_status !== 'Payment_Request' && (
          <TripProgress
            status={bidDetail?.bid_status}
            bidDetail={bidDetail}
            role={role}
            navigation={navigation}
          />
        )}
    </>
  );
};
export default BidCard;
