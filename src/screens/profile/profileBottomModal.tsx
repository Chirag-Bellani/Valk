import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RouteSelectorModal from '../../components/routeSelectorModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigate} from '../../navigation/navigationService';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';

const ProfileBottomModal = ({
  isModalVisible,
  toggleModal,
  currentUser,
  updateProfileData,
  onLocationPress,
  selectedLocation,
  onCanclePress,
  pageType,
}) => {
  const {mainDetail} = currentUser;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(mainDetail?.name ?? '');
  const [companyName, setCompanyName] = useState(
    mainDetail?.company_name ?? '',
  );
  const [email, setEmail] = useState(mainDetail?.email ?? '');
  const [mobileNo, setMobileNo] = useState(mainDetail?.mobile_no ?? '');
  const [partyLogo, setPartyLogo] = useState('');
  const [userLocation, setUserLocation] = useState(
    mainDetail?.user_location ?? '',
  );
  const [GSTNumber, setGSTNumber] = useState(
    mainDetail?.get_user_party_detail?.gst_no ?? '',
  );
  const [callingNo, setCallingNo] = useState(mainDetail?.calling_no ?? '');
  const [updatesCallingNo, setUpdatesCallingNo] = useState(
    mainDetail?.calling_no,
  );
  const [selectedRouteId, setSelectedRouteId] = useState([]); // Default to first route
  const [selectedRoute, setSelectedRoute] = useState([]); // Default to first route
  const [allRouteList, setAllRouteList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const KycVerified = currentUser?.mainDetail?.get_user_party_detail?.is_kyc;
  const navigation = useNavigation();

  const fetchStateList = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);

    try {
      const response = await apiPost(
        API_ENDPOINTS.LOCATION.GET_STATE_LIST,
        formData,
      );
      if (response.success) {
        setAllRouteList(response.data);
      } else {
        setAllRouteList([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    setLoading(false); // Reset loading state on modal open/close
  }, [isModalVisible]);

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Image Picker Error: ', response.errorMessage);
        } else {
          const source = {uri: response.assets[0].uri};
          setPartyLogo(source);
        }
      },
    );
  };

  const handleUpdate = async () => {
    setLoading(true);
    const updatedData = {
      name: name,
      companyName: companyName,
      mobile_no: mobileNo,
      email: email,
      profileImage: partyLogo,
      GSTNumber: GSTNumber,
      userLocation: selectedLocation || userLocation,
      calling_no: callingNo,
      selectedRoute: selectedRouteId,
    };

    updateProfileData(updatedData);
  };

  useEffect(() => {
    if (isModalVisible && currentUser && currentUser.mainDetail) {
      if (pageType !== 'confirmLocation') {
        // const {mainDetail} = currentUser;
        // setMobileNo(mainDetail?.mobile_no || '');
        // setName(mainDetail?.name || '');
        // setCompanyName(mainDetail?.company_name || '');
        // setEmail(mainDetail?.email || '');
        // setGSTNumber(mainDetail?.get_user_party_detail?.gst_no || '');
        // setUserLocation(mainDetail?.user_location || '');
        // setCallingNo(mainDetail?.calling_no || '');

        setSelectedRoute(
          mainDetail?.get_user_party_detail?.get_party_state_routes.map(
            route => ({
              id: route?.get_selected_party_state?.id, // Assuming `id` is the correct key for the route ID
              name: route?.get_selected_party_state?.name, // Assuming `name` is the correct key for the route name
            }),
          ) || [],
        );

        setSelectedRouteId(
          mainDetail?.get_user_party_detail?.get_party_state_routes.map(
            route => route?.state_id,
          ),
        );
        setPartyLogo(
          mainDetail?.get_user_party_detail &&
            mainDetail?.get_user_party_detail.party_logo
            ? {uri: mainDetail?.get_user_party_detail?.image_url}
            : null,
        );
      }
    }
    setLoading(false);
  }, [isModalVisible]);

  useEffect(() => {
    fetchStateList();
  }, []);

  const handleSelectRoute = selectedRoutes => {
    if (selectedRoutes && selectedRoutes.length > 0) {
      // Update state with selected routes
      setSelectedRouteId(selectedRoutes.map(route => route.id)); // Store only the IDs
      setSelectedRoute(selectedRoutes); // Store the full route objects
    } else {
      // Handle the case where no routes are selected (empty array)
      setSelectedRouteId([]); // Clear the IDs
      setSelectedRoute([]); // Clear the full route objects
    }

    // Close the modal in both cases
    setModalVisible(false);
  };

  if (loading) {
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>;
  }

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={toggleModal}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <View style={styles.imagePickerContainer}>
            <Pressable style={styles.addImageIcon} onPress={handleImagePicker}>
              <FontAwesome name="camera" size={16} color={'white'} />
            </Pressable>
            {partyLogo ? (
              <View style={styles.imageWrapper}>
                <Image source={partyLogo} style={styles.profileImage} />
              </View>
            ) : (
              <>
                <Image
                  source={require('../../assets/images/profile.png')}
                  style={styles.profileImage}
                />
              </>
            )}
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Profile Name</Text>
            <View style={styles.rateInputContainer}>
              <TextInput
                style={styles.rateInput}
                value={name}
                placeholder="Enter Profile Name"
                onChangeText={text => {
                  setName(text);
                }}
                editable={KycVerified === 1 ? false : true}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Company Name</Text>
            <View style={styles.rateInputContainer}>
              <TextInput
                style={styles.rateInput}
                value={companyName}
                placeholder="Enter Company Name"
                onChangeText={text => {
                  setCompanyName(text);
                }}
                editable={KycVerified === 1 ? false : true}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.rateInputContainer}>
              <TextInput
                style={styles.rateInput}
                value={email}
                placeholder="Enter your email"
                onChangeText={text => {
                  setEmail(text);
                }}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Mobile No</Text>
            <View style={styles.rateInputContainer}>
              <TextInput
                style={styles.rateInput}
                value={mobileNo}
                placeholder="Enter mobile number"
                onChangeText={text => {
                  setMobileNo(text);
                }}
                keyboardType="numeric"
                maxLength={10}
                editable={KycVerified === 1 ? false : true}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Calling No</Text>
            <View style={styles.rateInputContainer}>
              <TextInput
                style={styles.rateInput}
                value={callingNo}
                placeholder="Enter calling number"
                onChangeText={text => {
                  setCallingNo(text);
                }}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>User Location</Text>
            <View style={styles.rateInputContainer}>
              <TextInput
                style={styles.rateInput}
                value={selectedLocation || userLocation || ''}
                placeholder="Enter your  location"
                onPress={onLocationPress}
                editable={!selectedLocation && !userLocation}
                onChangeText={text => {
                  setUserLocation(text);
                }}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>GST Number</Text>
            <View style={styles.rateInputContainer}>
              <TextInput
                style={styles.rateInput}
                value={GSTNumber}
                editable={
                  mainDetail?.get_user_party_detail?.gst_no !== null
                    ? false
                    : true
                }
                placeholder="Enter GST Number"
                onChangeText={text => {
                  setGSTNumber(text);
                }}
                maxLength={15}
              />
            </View>
          </View>
          {currentUser?.mainDetail?.role === 2 && (
            <>
              <View
                style={[
                  styles.inputRow,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <Text style={styles.toggleLabel}>Operating State</Text>
                <Pressable onPress={() => setModalVisible(true)}>
                  <Icon name="chevron-right" size={26} color="#000" />
                </Pressable>
              </View>
              {selectedRoute.length > 0 && (
                <View style={styles.routeContainer}>
                  {selectedRoute.map((route, index) => (
                    <View key={index} style={styles.routeItem}>
                      <Text style={styles.routeText}>{route?.name}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          <View style={styles.buttonRow}>
            {loading ? (
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  marginBottom: 10,
                  fontWeight: 'bold',
                }}>
                Waiting For Profile Update...
              </Text>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setLoading(true);
                    handleUpdate();
                  }}
                  disabled={loading}
                  style={[
                    styles.submitButton,
                    loading && styles.disabledButton,
                  ]}>
                  <Text style={styles.submitButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onCanclePress}
                  style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </View>
      <RouteSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        routes={allRouteList}
        onSelect={handleSelectRoute}
        selectedRouteId={selectedRouteId}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginBottom: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  inputRow: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
    marginLeft: 5,
    // fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 14,
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#203afa',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'medium',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'medium',
    textAlign: 'center',
  },
  rateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  rateInput: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 15,
    color: 'black',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  toggleContainer: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    padding: 2,
  },
  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 2,
  },
  toggleLabel: {
    marginLeft: 5,
    color: 'black',
  },
  disabledButton: {
    backgroundColor: '#C0C0C0', // Set your desired color for the disabled state
    opacity: 0.7, // Adjust the opacity to indicate it's disabled
  },
  imagePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePickerText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 1,
  },
  addImageIcon: {
    position: 'absolute',
    top: 70,
    right: 125,
    backgroundColor: '#203afa',
    borderRadius: 15,
    padding: 7,
    zIndex: 7,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 5,
  },
  routeItem: {
    backgroundColor: '#ffefcc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  routeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  routeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
    paddingBottom: 25,
  },
});

export default ProfileBottomModal;
