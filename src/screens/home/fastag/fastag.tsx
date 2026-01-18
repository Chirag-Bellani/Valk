import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Accordion from 'react-native-collapsible/Accordion';
import InqueryModal from '../../../components/inquiryModal';
import {API_ENDPOINTS} from '../../../constants/apiEndPoints';
import {apiPost} from '../../../services/apiUtility';
import {showMessage} from 'react-native-flash-message';
import ImageOptionModalComponent from '../../../components/imageOptionModalComponent';
import {CameraImagePicker, DocumentPicker} from '../../../utils';
import {useIsFocused} from '@react-navigation/native';

const FastTagScreen = ({navigation, route}) => {
  const fastagService = route.params?.data.find(
    item => item?.name === 'FasTag',
  );
  const [isInquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [mobileNo, setMobileNo] = useState('');
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [fileTypeAdharFront, setFileTypeAdharFront] = useState('');
  const [fileTypeAdharBack, setFileTypeAdharBack] = useState('');
  const [fileTypePan, setFileTypePan] = useState('');
  const [fileTypeRc, setFileTypeRc] = useState('');
  const [fileNameAdharFront, setFileNameAdharFront] = useState('');
  const [fileNameAdharBack, setFileNameAdharBack] = useState('');
  const [fileNamePan, setFileNamePan] = useState('');
  const [fileNameRc, setFileNameRc] = useState('');
  const [fileUriAdharFront, setFileUriAdharFront] = useState('');
  const [fileUriAdharBack, setFileUriAdharBack] = useState('');
  const [fileUriPan, setFileUriPan] = useState('');
  const [fileUriRc, setFileUriRc] = useState('');
  const [selectedCardId, setSelectedCardId] = useState('');
  const [selectedCardServiceRequestId, setSelectedCardServiceRequestId] =
    useState('');
  const [activeSections, setActiveSections] = useState([]);

  const [uploadType, setUploadType] = useState(null);

  const [mobileNoError, setMobileNoError] = useState(false);
  const [adharUploadFrontError, setAdharUploadFrontError] = useState(false);
  const [adharUploadBackError, setAdharUploadBackError] = useState(false);
  const [panUploadError, setPanUploadError] = useState(false);
  const [rcUploadError, setRcUploadError] = useState(false);

  const handleMobileNoChange = (text: string) => {
    setMobileNo(text);
    if (text.trim() !== '') {
      setMobileNoError(false);
    }
  };

  const handleAdharFrontUpload = (uri: string) => {
    setFileUriAdharFront(uri);
    setAdharUploadFrontError(false);
  };

  const handleAdharBackUpload = (uri: string) => {
    setFileUriAdharBack(uri);
    setAdharUploadBackError(false);
  };

  const handlePanUpload = (uri: string) => {
    setFileUriPan(uri);
    setPanUploadError(false);
  };

  const handleRcUpload = (uri: string) => {
    setFileUriRc(uri);
    setRcUploadError(false);
  };

  const launchCamera = async () => {
    setOptionModalVisible(false);
    CameraImagePicker(
      // onCancel callback
      () => {
        console.log('Camera capture cancelled');
        setOptionModalVisible(false);
      },
      // onError callback
      error => {
        console.log('Error capturing image:', error);
        setOptionModalVisible(false);
      },
      // onSuccess callback
      asset => {
        if (uploadType === 'AdharFront') {
          handleAdharFrontUpload(asset?.uri);
        } else if (uploadType === 'AdharBack') {
          handleAdharBackUpload(asset?.uri);
        } else if (uploadType === 'Pan') {
          handlePanUpload(asset?.uri);
        } else {
          handleRcUpload(asset?.uri);
        }
        setOptionModalVisible(false);
      },
    );
  };

  const launchGallery = () => {
    setOptionModalVisible(false);
    DocumentPicker(
      // Handle PDF file
      pdfUri => {
        if (uploadType === 'AdharFront') {
          handleAdharFrontUpload(pdfUri?.uri);
          setFileTypeAdharFront('pdf');
          setFileNameAdharFront(pdfUri?.name);
        } else if (uploadType === 'AdharBack') {
          handleAdharBackUpload(pdfUri?.uri);
          setFileTypeAdharBack('pdf');
          setFileNameAdharBack(pdfUri?.name);
        } else if (uploadType === 'Pan') {
          handlePanUpload(pdfUri?.uri);
          setFileTypePan('pdf');
          setFileNamePan(pdfUri?.name);
        } else {
          handleRcUpload(pdfUri?.uri);
          setFileTypeRc('pdf');
          setFileNameRc(pdfUri?.name);
        }
      },
      // Handle image file
      imageUri => {
        if (uploadType === 'AdharFront') {
          handleAdharFrontUpload(imageUri?.uri);
          setFileTypeAdharFront('image');
          setFileNameAdharFront(imageUri?.name);
        } else if (uploadType === 'AdharBack') {
          handleAdharBackUpload(imageUri?.uri);
          setFileTypeAdharBack('image');
          setFileNameAdharBack(imageUri?.name);
        } else if (uploadType === 'Pan') {
          handlePanUpload(imageUri?.uri);
          setFileTypePan('image');
          setFileNamePan(imageUri?.name);
        } else {
          handleRcUpload(imageUri?.uri);
          setFileTypeRc('image');
          setFileNameRc(imageUri?.name);
        }
      },
    );
  };

  const removeImageAdharFront = () => {
    setFileUriAdharFront('');
    setFileTypeAdharFront('');
    setFileNameAdharFront('');
  };

  const removeImageAdharBack = () => {
    setFileUriAdharBack('');
    setFileTypeAdharBack('');
    setFileNameAdharBack('');
  };
  const removeImagePan = () => {
    setFileUriPan('');
    setFileTypePan('');
    setFileNamePan('');
  };
  const removeImageRc = () => {
    setFileUriRc('');
    setFileTypeRc('');
    setFileNameRc('');
  };

  const toggleInquiryModal = () => {
    setInquiryModalVisible(!isInquiryModalVisible);
  };

  const handleCancel = () => {
    toggleInquiryModal();
  };

  const handlePress = () => {
    toggleInquiryModal();
  };

  const addFastagInquiry = async () => {
    // Reset all error states
    setMobileNoError(false);
    setAdharUploadFrontError(false);
    setAdharUploadBackError(false);
    setPanUploadError(false);
    setRcUploadError(false);

    // Validate all required fields
    let hasError = false;
    if (mobileNo === '') {
      setMobileNoError(true);
      hasError = true;
    }

    if (fileUriAdharFront === '') {
      setAdharUploadFrontError(true);
      hasError = true;
    }

    if (fileUriAdharBack === '') {
      setAdharUploadBackError(true);
      hasError = true;
    }

    if (fileUriPan === '') {
      setPanUploadError(true);
      hasError = true;
    }

    if (fileUriRc === '') {
      setRcUploadError(true);
      hasError = true;
    }

    if (hasError) {
      setIsDisable(false);
      return;
    }

    setIsDisable(true);
    let formData = new FormData();
    formData.append('mobile_no', mobileNo);
    formData.append('service_id', selectedCardServiceRequestId);
    formData.append('service_detail_id', selectedCardId);
    if (fileUriAdharFront) {
      formData.append('aadhaar_front_image', {
        uri: fileUriAdharFront,
        name:
          fileTypeAdharFront === 'image'
            ? 'aadhar-front-image.jpg'
            : 'aadhar-front-document.pdf',
        type: fileTypeAdharFront === 'image' ? 'image/jpeg' : 'application/pdf',
      });
    }
    if (fileUriAdharBack) {
      formData.append('aadhaar_back_image', {
        uri: fileUriAdharBack,
        name:
          fileTypeAdharBack === 'image'
            ? 'aadhar-front-image.jpg'
            : 'aadhar-front-document.pdf',
        type: fileTypeAdharBack === 'image' ? 'image/jpeg' : 'application/pdf',
      });
    }
    if (fileUriPan) {
      formData.append('pan_image', {
        uri: fileUriPan,
        name:
          fileTypePan === 'image'
            ? 'aadhar-front-image.jpg'
            : 'aadhar-front-document.pdf',
        type: fileTypePan === 'image' ? 'image/jpeg' : 'application/pdf',
      });
    }
    if (fileUriRc) {
      formData.append('rc_image', {
        uri: fileUriRc,
        name:
          fileTypeRc === 'image'
            ? 'aadhar-front-image.jpg'
            : 'aadhar-front-document.pdf',
        type: fileTypeRc === 'image' ? 'image/jpeg' : 'application/pdf',
      });
    }
s
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
        removeImageAdharBack();
        removeImageAdharFront();
        removeImagePan();
        removeImageRc();
        setMobileNo('');
      } else {
        console.log('Failed to fetch data');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      toggleInquiryModal();
      setIsDisable(false);
    }
  };

  const Fastagcard = ({item}) => {
    // Transform the data into the expected format
    const bookingDetails = [];

    // Get all field keys from the item
    const fieldKeys = Object.keys(item).filter(
      key => key.startsWith('field_') && key.endsWith('_amt'),
    );

    // Process each field
    fieldKeys.forEach(fieldKey => {
      const amount = item[fieldKey];
      const labelKey = fieldKey.replace('_amt', '_label');
      const label = item[labelKey];

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
      bankName: item?.title,
      bookingDetails,
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.bankName}>{transformedItem?.bankName}</Text>
        </View>

        {/* Booking Details - Straightforward amount Display */}
        {transformedItem?.bookingDetails.map((detail, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{detail?.label}</Text>
            <Text style={styles.price}>{detail?.amount}</Text>
          </View>
        ))}

        {/* Benefits */}
        <View style={styles.benefits}>
          <Text style={styles.benefit}>✅ Protection from Valk</Text>
          <Text style={styles.benefit}>
            ✅ Pan-India replacement within 24 hours
          </Text>
          <Text style={styles.benefit}>✅ On-ground support at every toll</Text>
        </View>

        {/* Refund Notice */}
        <Text style={styles.refundNote}>
          * If you are not satisfied with your FASTag experience, you will
          receive a full refund within 60 days from the date of issuance.
        </Text>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => {
            handlePress();
            setSelectedCardId(item?.id);
            setSelectedCardServiceRequestId(item?.service_id);
          }}>
          <Text style={styles.buyButtonText}>BUY THIS PLAN</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = (section, index, isActive) => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image source={section?.icon} style={styles.headerImage} />
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
      title: 'Seamless activation',
      content1: 'Instant activation on delivery.',
      content2: 'Delivery within 24 hours.',
      icon: require('../../../assets/images/Activation.png'),
    },
    {
      title: 'Easy recharge',
      content1: 'Easy recharge using UPI, debit & credit cards.',
      content2: 'Auto recharge feature for managing multiple trucks.',
      icon: require('../../../assets/images/recharge.png'),
    },
    {
      title: 'Never get blacklisted',
      content1:
        'Maintaining balance 24*7 through unique auto recharge plus offering.',
      content2: 'Vehicle will never be stopped at toll plaza.',
      icon: require('../../../assets/images/blacklist.png'),
    },
    {
      title: 'Never pay extra for your vehicle',
      content1: 'Same day refund for chargebacks.',
      content2: 'Get auto refund for extra deduction.',
      icon: require('../../../assets/images/extrapay.png'),
    },
    {
      title: 'Real time transaction alerts',
      content1: 'Get notified everytime your truck crossed plaza.',
      content2: 'Download statement anytime from app.',
      icon: require('../../../assets/images/alert.png'),
    },
    {
      title: '24*7 Support',
      content1:
        'Contact Us 24X7 for any customer support on toll-free pan-India customer care number.',
      icon: require('../../../assets/images/help.png'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title Section */}
      <Text style={styles.subtitle}>Designed exclusively for trucks</Text>
      <Text style={styles.title}>Valk FASTag</Text>

      {/* Image */}
      <Image source={{uri: fastagService?.large_image}} style={styles.image} />

      {/* Partner Banks */}
      <Text style={styles.sectionTitle}>FASTag Partner Banks</Text>
      <FlatList
        data={fastagService?.get_services_details}
        contentContainerStyle={{paddingBottom: 25}}
        renderItem={({item}) => <Fastagcard item={item} />}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
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
      <InqueryModal
        isModalVisible={isInquiryModalVisible}
        toggleModal={toggleInquiryModal}
        mobileNo={mobileNo}
        disable={isDisable}
        setMobileNo={handleMobileNoChange}
        uploadAdharFront={() => {
          setUploadType('AdharFront');
          setOptionModalVisible(true);
        }}
        uploadAdharBack={() => {
          setUploadType('AdharBack');
          setOptionModalVisible(true);
        }}
        uploadPan={() => {
          setUploadType('Pan');
          setOptionModalVisible(true);
        }}
        uploadRc={() => {
          setUploadType('Rc');
          setOptionModalVisible(true);
        }}
        fileTypeAdharFront={fileTypeAdharFront}
        fileTypeAdharBack={fileTypeAdharBack}
        fileUriAdharFront={fileUriAdharFront}
        fileUriAdharBack={fileUriAdharBack}
        fileNameAdharFront={fileNameAdharFront}
        fileNameAdharBack={fileNameAdharBack}
        removeImageAdharFront={removeImageAdharFront}
        removeImageAdharBack={removeImageAdharBack}
        fileTypePan={fileTypePan}
        fileTypeRc={fileTypeRc}
        fileUriPan={fileUriPan}
        fileUriRc={fileUriRc}
        fileNamePan={fileNamePan}
        fileNameRc={fileNameRc}
        removeImagePan={removeImagePan}
        removeImageRc={removeImageRc}
        handleSubmit={addFastagInquiry}
        handleCancel={handleCancel}
        mobileError={mobileNoError}
        uploadAdharFrontError={adharUploadFrontError}
        uploadAdharBackError={adharUploadBackError}
        uploadPanError={panUploadError}
        uploadRcError={rcUploadError}
        type="Fastag"
      />
      <ImageOptionModalComponent
        title="Upload Documents"
        visible={optionModalVisible}
        onClose={() => setOptionModalVisible(false)}
        onCameraPress={launchCamera}
        onGalleryPress={launchGallery}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(15),
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
    padding: scale(15),
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
});

export default FastTagScreen;
