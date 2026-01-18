import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import InqueryModal from '../../../components/inquiryModal';
import {API_ENDPOINTS} from '../../../constants/apiEndPoints';
import {apiPost} from '../../../services/apiUtility';
import {showMessage} from 'react-native-flash-message';
import {moderateScale, verticalScale, scale} from 'react-native-size-matters';
import Accordion from 'react-native-collapsible/Accordion';

const InsuranceInquiryPage = ({navigation, route}) => {
  const insuranceService = route.params?.data.find(
    item => item?.name === 'Insurance',
  );
  const [isInquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState('Cargo');
  const [mobileNo, setMobileNo] = useState('');
  const [material, setMaterial] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [activeSections, setActiveSections] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [selectedCardServiceRequestId, setSelectedCardServiceRequestId] =
    useState('');
  const [mobileNoError, setMobileNoError] = useState(false);
  const [materialError, setMaterialError] = useState(false);
  const [billAmountError, setBillAmountError] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const renderHeader = (section, index, isActive) => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image source={section.icon} style={styles.headerImage} />
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
      {section?.content2 ? (
        <Text style={styles.contentText}>
          {'\u2022'} {section?.content2}
        </Text>
      ) : null}
    </View>
  );

  const SECTIONS = [
    {
      title: 'Comprehensive Coverage',
      content1: 'Protection against damage, theft, and loss of cargo.',
      content2: 'Coverage for natural disasters and accidents during transit.',
      icon: require('../../../assets/images/Activation.png'),
    },
    {
      title: 'Quick Claim Settlement',
      content1: 'Fast and hassle-free claim processing.',
      content2: 'Dedicated claim support team available 24/7.',
      icon: require('../../../assets/images/recharge.png'),
    },
    {
      title: 'Flexible Premium Plans',
      content1: 'Customizable insurance plans based on cargo value.',
      content2: 'Competitive premium rates with no hidden charges.',
      icon: require('../../../assets/images/blacklist.png'),
    },
    {
      title: 'Transparent Process',
      content1: 'Clear documentation and policy terms.',
      content2: 'Real-time tracking of your insurance status.',
      icon: require('../../../assets/images/extrapay.png'),
    },
    {
      title: 'Expert Support',
      content1: 'Dedicated insurance advisors for guidance.',
      content2: 'Assistance with documentation and claim filing.',
      icon: require('../../../assets/images/alert.png'),
    },
    {
      title: '24/7 Customer Care',
      content1: 'Round-the-clock support for all your insurance needs.',
      icon: require('../../../assets/images/help.png'),
    },
  ];

  const toggleInquiryModal = () => {
    setInquiryModalVisible(!isInquiryModalVisible);
  };

  const handleCancel = () => {
    toggleInquiryModal();
  };

  const handlePress = () => {
    toggleInquiryModal();
  };

  const addInsuranceInquiry = async () => {
    // Validate all required fields
    let hasError = false;
    if (mobileNo === '') {
      setMobileNoError(true);
      hasError = true;
    }

    if (material === '') {
      setMaterialError(true);
      hasError = true;
    }

    if (billAmount === '') {
      setBillAmountError(true);
      hasError = true;
    }
    if (hasError) {
      setIsDisable(false);
      return;
    }

    setIsDisable(true);
    let formData = new FormData();
    formData.append('service_id', selectedCardServiceRequestId);
    formData.append('service_detail_id', selectedCardId);
    formData.append('mobile_no', mobileNo);
    formData.append('material', material);
    formData.append('bill_amount', billAmount);

    try {
      const response = await apiPost(
        API_ENDPOINTS.FASTAG_GPS_INSURANCE.ADD_INQUIRY,
        formData,
      );
      if (response.success) {
        navigation.navigate('Home');
        toggleInquiryModal();
        showMessage({
          message: response.message,
          description: '',
          type: 'success',
        });
      } else {
        console.log('Failed to fetch data');
      }
      // setRefreshing(false);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsDisable(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <Text style={styles.subtitle}>
          Designed exclusively for Cargo Or Container
        </Text>
        <Text style={styles.title}>Valk Insurance</Text>

        {/* Image */}
        <Image
          source={{uri: insuranceService?.large_image}}
          style={styles.image}
        />

        {/* Insurance Types */}
        <Text style={styles.sectionTitle}>Insurance Types</Text>
        <FlatList
          data={insuranceService?.get_services_details}
          keyExtractor={item => item?.type}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.bankName}>{item?.title}</Text>
              </View>

              {/* <Text style={styles.description}>{item.description}</Text> */}

              {/* Benefits */}
              <View style={styles.benefits}>
                <Text style={styles.benefit}>
                  ✅ Comprehensive coverage for your shippment
                </Text>
                <Text style={styles.benefit}>
                  ✅ Protection against theft, damage and loss
                </Text>
                <Text style={styles.benefit}>
                  ✅ Quick claim settlement process
                </Text>
                <Text style={styles.benefit}>✅ 24/7 customer support</Text>
                <Text style={styles.benefit}>✅ Competitive premium rates</Text>
              </View>

              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => {
                  handlePress();
                  setSelectedCardId(item?.id);
                  setSelectedInsuranceType(item?.type);
                  setSelectedCardServiceRequestId(item?.service_id);
                }}>
                <Text style={styles.buyButtonText}>BUY THIS INSURANCE</Text>
              </TouchableOpacity>
            </View>
          )}
          scrollEnabled={false}
        />
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
      </ScrollView>

      <InqueryModal
        isModalVisible={isInquiryModalVisible}
        toggleModal={toggleInquiryModal}
        mobileNo={mobileNo}
        setMobileNo={setMobileNo}
        material={material}
        setMaterial={setMaterial}
        billAmount={billAmount}
        setBillAmount={setBillAmount}
        disable={isDisable}
        handleCancel={handleCancel}
        handleSubmit={addInsuranceInquiry}
        mobileError={mobileNoError}
        materialError={materialError}
        billAmountError={billAmountError}
        type="Insurance"
      />
    </>
  );
};

export default InsuranceInquiryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(10),
    backgroundColor: '#F8F8F8',
  },
  subtitle: {
    textAlign: 'center',
    color: '#000',
    marginVertical: verticalScale(10),
    fontSize: moderateScale(14),
  },
  title: {
    textAlign: 'center',
    color: '#000',
    fontSize: moderateScale(22),
    fontWeight: 'bold',
  },
  image: {
    width: '80%',
    height: verticalScale(150),
    alignSelf: 'center',
    marginVertical: verticalScale(5),
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#000',
  },
  card: {
    padding: scale(10),
    borderRadius: moderateScale(10),
    backgroundColor: '#fff',
    elevation: 4,
    marginVertical: verticalScale(10),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  bankLogo: {
    width: scale(40),
    height: scale(40),
    marginRight: scale(10),
    resizeMode: 'contain',
  },
  bankName: {
    color: '#000',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    flexShrink: 1, // Prevents text overflow
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(5),
  },
  label: {
    color: '#000',
    fontSize: moderateScale(16),
    flexShrink: 1,
  },
  price: {
    color: '#000',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#000',
  },
  benefits: {
    marginTop: verticalScale(10),
  },
  benefit: {
    color: '#000',
    fontSize: moderateScale(14),
    marginVertical: verticalScale(2),
  },
  refundNote: {
    fontSize: moderateScale(12),
    color: '#000',
    marginTop: verticalScale(10),
    textAlign: 'center',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: scale(40),
    height: scale(40),
    tintColor: 'blue',
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
  description: {
    color: '#000',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(10),
  },
});
