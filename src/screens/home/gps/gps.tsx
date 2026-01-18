import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Linking,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Accordion from 'react-native-collapsible/Accordion';
import InqueryModal from '../../../components/inquiryModal';
import {apiPost} from '../../../services/apiUtility';
import {API_ENDPOINTS} from '../../../constants/apiEndPoints';
import {showMessage} from 'react-native-flash-message';
import {useIsFocused} from '@react-navigation/native';

const SECTIONS = [
  {
    title: 'Real-Time vehicle tracking',
    content1: 'Track real-time vehicle location & speed',
    content2: 'View & download unlimited trip history',
    icon: require('../../../assets/images/truck_location.png'),
  },
  {
    title: 'Ensure safe driving',
    content1: 'Real-time notification of vehicle over-speeding.',
    content2: 'Report unauthorized moverment of vehicle',
    icon: require('../../../assets/images/truck_safety.png'),
  },
  {
    title: 'Theft protection',
    content1: 'Lock & unlock your vehicle from anywhere.',
    content2: 'Instant alerts for ignition ON & OFF',
    icon: require('../../../assets/images/theft_protection.png'),
  },
  {
    title: 'Pan-India technician network',
    content1: 'Pan-India network of technical engineers.',
    content2: '24x7 free GPS repair & installation',
    icon: require('../../../assets/images/tools.png'),
  },
  {
    title: '24X7 customer support',
    content1:
      'Contact us 24X7 for any customer support on toll-free pan-India customer care number',
    icon: require('../../../assets/images/help.png'),
  },
];

const GPS = ({navigation, route}) => {
  const gpsService = route.params?.data.find(item => item?.name === 'GPS');

  const [activeSections, setActiveSections] = useState([]);
  const [isInquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [mobileNo, setMobileNo] = useState('');
  const [quelity, setQuelity] = useState('');
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [selectedCardServiceRequestId, setSelectedCardServiceRequestId] =
    useState('');

  const [mobileNoError, setMobileNoError] = useState(false);
  const [quelityError, setQuelityError] = useState(false);

  const handleMobileNoChange = text => {
    setMobileNo(text);
    setMobileNoError(false);
  };

  const handleQualityChange = text => {
    setQuelity(text);
    setQuelityError(false);
  };

  const toggleInquiryModal = () => {
    setInquiryModalVisible(!isInquiryModalVisible);
  };

  const handleCancel = () => {
    toggleInquiryModal();
  };
  const renderHeader = (section, index, isActive) => (
    <View style={styles.header}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={section?.icon}
          style={{width: scale(40), height: scale(40), tintColor: 'blue'}}
        />
        <Text style={styles.headerText}>{section?.title}</Text>
      </View>
      <Text style={styles.icon}>{isActive ? '−' : '+'}</Text>
    </View>
  );

  const renderContent = section => (
    <View style={styles.content}>
      <Text style={styles.contentText}>
        {'\u2022'} {section?.content1}
      </Text>
    </View>
  );

  const handlePress = () => {
    toggleInquiryModal();
    // Alert.alert("Comming Soon", "This feature is coming soon!");
  };

  const GpsCard = ({item: gpsDetails}) => {
    const bookingDetails = [];

    const fieldKeys = Object.keys(gpsDetails).filter(
      key => key.startsWith('field_') && key.endsWith('_amt'),
    );

    // Process each field
    fieldKeys.forEach(fieldKey => {
      const amount = gpsDetails[fieldKey];
      const labelKey = fieldKey.replace('_amt', '_label');
      const label = gpsDetails[labelKey];

      // Only add if both amount and label are not null/undefined
      if (
        amount !== null &&
        amount !== undefined &&
        label !== null &&
        label !== undefined
      ) {
        bookingDetails.push({
          label,
          amount: `₹${amount}`,
        });
      }
    });

    const transformedItem = {
      bankName: gpsDetails?.title,
      bookingDetails,
    };

    return (
      <View style={styles.priceCard}>
        <Text style={styles.priceTitle}>{gpsDetails?.title}</Text>

        {/* Dynamic Fee Breakdown */}
        <View style={styles.feeContainer}>
          {transformedItem?.bookingDetails?.map((fee, index) => (
            <View key={index} style={styles.feeRow}>
              <Text style={styles.feeText}>{fee?.label}</Text>
              <Text style={styles.feeText}>{fee?.amount}</Text>
            </View>
          ))}
        </View>

        {/* Plan Benefits */}
        <View style={styles.benefits}>
          <Text style={styles.benefitText}>
            ✅ India's best hardware & mobile application
          </Text>
          <Text style={styles.benefitText}>
            ✅ Pan-India free installation within 24 hours
          </Text>
          <Text style={styles.benefitText}>
            ✅ Free repair & replacement warranty
          </Text>
        </View>

        {/* Booking Price Info */}
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>Book with</Text>
          <Text style={styles.bookingText}>{gpsDetails?.field_1_amt}</Text>
        </View>

        {/* Buy Plan Button */}
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => {
            handlePress();
            setSelectedCardId(gpsDetails?.id);
            setSelectedCardServiceRequestId(gpsDetails?.service_id);
          }}>
          <Text style={styles.buyButtonText}>BUY THIS PLAN</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const addGpsInquiry = async () => {
    setQuelityError(false);
    setMobileNoError(false);

    let hasError = false;
    if (mobileNo === '') {
      setMobileNoError(true);
      hasError = true;
    }
    if (quelity === '') {
      setQuelityError(true);
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let formData = new FormData();
    formData.append('mobile_no', mobileNo);
    formData.append('quality', quelity);
    formData.append('service_id', selectedCardServiceRequestId);
    formData.append('service_detail_id', selectedCardId);

    try {
      const response = await apiPost(
        API_ENDPOINTS.FASTAG_GPS_INSURANCE.ADD_INQUIRY,
        formData,
      );
      if (response.success) {
        navigation.navigate('Home');
        showMessage({
          message: response.message,
          description: '',
          type: 'success',
        });
        setMobileNo('');
        setQuelity('');
      } else {
        console.log('Failed to fetch data');
      }
      // setRefreshing(false);
    } catch (error) {
      console.log(error.message);
    } finally {
      toggleInquiryModal();
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, padding: scale(10)}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top GPS image */}
        <ImageBackground
          source={{uri: gpsService?.large_image}}
          style={{width: '100%', height: verticalScale(200)}}
          resizeMode="stretch">
          <View style={{marginTop: verticalScale(10)}}>
            <Text style={styles.title}>Track your vehicle with</Text>
            <Text style={styles.subtitle}>India's Best Vehicle Tracker</Text>
          </View>
          <LinearGradient
            colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.2)']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: moderateScale(400),
            }}
          />
        </ImageBackground>

        {/* GPS Plans & Pricing */}
        <View
          style={{marginTop: verticalScale(20), paddingHorizontal: scale(12)}}>
          <Text style={styles.sectionTitle}>GPS Plans & Pricing</Text>
          <Text style={styles.sectionSubtitle}>
            All plans are exclusive of GST
          </Text>

          {/* Pricing Card */}
          <FlatList
            data={gpsService?.get_services_details}
            contentContainerStyle={{paddingBottom: 25}}
            renderItem={({item}) => <GpsCard item={item} />}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {/* 2 year plans */}
        <View
          style={{marginTop: verticalScale(20), paddingHorizontal: scale(12)}}>
          {/* Pricing Card */}
          {/* <View style={styles.priceCard}>
            <Text style={styles.priceTitle}>2-Years Plan</Text>

            Yearly Fee Breakdown
            <View style={styles.feeContainer}>
              <View style={styles.feeRow}>
                <Text style={styles.feeText}>2-Year Fee</Text>
                <Text style={styles.feeText}>₹3,389</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeText}>After 2 Years Fee</Text>
                <Text style={styles.feeText}>₹2,287/Year</Text>
              </View>
            </View>

            Plan Benefits
            <View style={styles.benefits}>
              <Text style={styles.benefitText}>✅ India's best hardware & mobile application</Text>
              <Text style={styles.benefitText}>✅ Pan-India free installation within 24 hours</Text>
              <Text style={styles.benefitText}>✅ Free repair & replacement warranty</Text>
            </View>

            Booking Price Info
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingText}>Book with</Text>
              <Text style={styles.bookingText}>Only ₹3,389</Text>
            </View>

            Buy Plan Button
            <TouchableOpacity style={styles.buyButton} onPress={handlePress}>
              <Text style={styles.buyButtonText}>BUY THIS PLAN</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Our Key Features & Accordion */}
        <View style={{paddingVertical: scale(20)}}>
          <Text style={styles.sectionTitle}>Our Key Features</Text>
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={setActiveSections}
            underlayColor="tranparent"
          />
        </View>

        {/* help info container */}
        <View
          style={{
            marginVertical: verticalScale(20),
            justifyContent: 'center',
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: verticalScale(5),
            paddingHorizontal: scale(10),
            gap: scale(5),
          }}>
          <Image
            source={require('../../../assets/images/info.png')}
            style={{
              width: moderateScale(20),
              height: moderateVerticalScale(20),
            }}
          />
          <Text
            style={{
              color: 'black',
              fontSize: moderateScale(14),
              paddingTop: verticalScale(10),
            }}>
            Boss respresentative will reach out to you within 24 hours to setup
            the free GPS installation
          </Text>
        </View>

        {/* help line number bg */}

        <ImageBackground
          source={require('../../../assets/images/helpLineBg.png')}
          style={{marginBottom: verticalScale(12), padding: moderateScale(10)}}>
          <Text style={{color: 'black', fontSize: moderateScale(22)}}>
            Still have doubts?
          </Text>
          <Text
            style={{
              color: 'grey',
              fontSize: moderateScale(14),
              marginTop: verticalScale(5),
            }}>
            Contact us with all your questions
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: moderateScale(20),
              marginTop: verticalScale(5),
            }}>
            +91- 9825134269
          </Text>
          <Pressable
            style={styles.buyButton}
            onPress={() => {
              Linking.openURL(`tel:${9825134269}`);
            }}>
            <Text style={styles.buyButtonText}>CAll NOW</Text>
          </Pressable>
        </ImageBackground>
      </ScrollView>
      <InqueryModal
        isModalVisible={isInquiryModalVisible}
        toggleModal={toggleInquiryModal}
        mobileNo={mobileNo}
        setMobileNo={handleMobileNoChange}
        quality={quelity}
        setQuality={handleQualityChange}
        handleSubmit={addGpsInquiry}
        handleCancel={handleCancel}
        mobileError={mobileNoError}
        quelityError={quelityError}
        disable={loading}
        type="GPS"
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: moderateScale(17),
    textAlign: 'center',
  },
  subtitle: {
    color: 'black',
    fontSize: moderateScale(25),
    textAlign: 'center',
    fontWeight: '500',
    marginTop: verticalScale(7),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#000',
  },
  sectionSubtitle: {
    color: 'black',
    fontSize: moderateScale(12),
  },
  priceCard: {
    backgroundColor: '#fff',
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(26),
    width: '110%',
    alignSelf: 'center',
  },
  priceTitle: {
    color: 'black',
    fontSize: moderateScale(18),
    fontWeight: '500',
  },
  feeContainer: {
    marginTop: verticalScale(16),
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.6,
    paddingBottom: verticalScale(10),
    marginBottom: verticalScale(12),
  },
  feeText: {
    color: 'black',
    fontSize: moderateScale(13),
  },
  benefits: {
    marginTop: verticalScale(25),
  },
  benefitText: {
    color: 'black',
    fontSize: moderateScale(12),
  },
  bookingInfo: {
    marginTop: verticalScale(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'lightblue',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(13),
    borderRadius: moderateScale(7),
  },
  bookingText: {
    color: 'black',
    fontSize: moderateScale(13),
  },
  buyButton: {
    width: '100%',
    backgroundColor: '#203afa',
    alignSelf: 'center',
    marginVertical: verticalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(5),
  },
  buyButtonText: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: moderateScale(5),
    marginVertical: verticalScale(3),
    alignItems: 'center',
  },
  headerText: {
    fontSize: moderateScale(14),
    color: 'black',
  },
  icon: {
    fontSize: moderateScale(18),
    color: 'black',
  },
  content: {
    borderColor: '#999',
    borderTopWidth: 0.6,
    backgroundColor: '#fff',
  },
  contentText: {
    fontSize: moderateScale(14),
    color: 'black',
  },
});

export default GPS;
