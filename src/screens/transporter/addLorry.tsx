import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';

import StepIndicator from 'react-native-step-indicator';
import CheckBox from '@react-native-community/checkbox';
import mainStyles from '../../assets/styles/main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MultiSelect} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {showMessage} from 'react-native-flash-message';
import TextInputComponent from '../../components/textInputComponent';
import GooglePlacesSearch from '../../components/googlePlaceSearch';
import CustomCard from '../../components/truckCard';
import DropdownComponent from '../../components/dropdownComponent';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import ImageOptionModalComponent from '../../components/imageOptionModalComponent';
import {CameraImagePicker, DocumentPicker} from '../../utils';
import {viewDocument} from '@react-native-documents/viewer';

const AddLorry = ({navigation}) => {
  const [vehicleNo, setVehicleNo] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentLocationState, setCurrentLocationState] = useState('');
  const [stateList, setStateList] = useState([]);
  const [vehicleTypeId, setVehicleTypeId] = useState(null);
  const [vehicleSizeId, setVehicleSizeId] = useState(null);
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [selectedStateId, setSelectedStateId] = useState([]);
  const [truckRc, setTruckRc] = useState([]);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [vehicleSizeList, setVehicleSizeList] = useState([]);
  const [isAllIndiaPermit, setIsAllIndiaPermit] = useState(0);
  const [vehicleCategoryList, setVehicleCategoryList] = useState([]);
  const [vehicleCategoryId, setVehicleCategoryId] = useState(null);
  const [isSelected, setSelection] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [fileType, setFileType] = useState('');
  const [fileName, setFileName] = useState('');

  const [fileUri, setFileUri] = useState('');

  const renderItem = item => {
    return (
      <TouchableOpacity onPress={() => toggleSelection(item.id)}>
        <View style={MultiSelectStyle.item}>
          <Text style={MultiSelectStyle.selectedTextStyle}>{item.name}</Text>
          <AntDesign
            style={MultiSelectStyle.icon}
            color="green"
            name="Safety"
            size={20}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const deleteState = (stateId: number) => {
    const updatedStateIds = selectedStateId.filter(id => id !== stateId);
    setSelectedStateId(updatedStateIds);
  };

  const toggleSelection = id => {
    if (selectedStateId.includes(id)) {
      // If already selected, remove it
      setSelectedStateId(prevState => {
        const updatedState = prevState.filter(itemId => itemId !== id);
        // If selection is empty, set error message
        if (updatedState.length === 0) {
          setValidationErrors(prev => ({
            ...prev,
            selectedStateId: 'Please select a vehicle route',
          }));
        }
        return updatedState;
      });
    } else {
      // If not selected, add it
      setSelectedStateId(prevState => {
        const updatedState = [...prevState, id];
        // Reset error message if any state is selected
        setValidationErrors(prev => ({...prev, selectedStateId: ''}));
        return updatedState;
      });
    }
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
        setFileUri(asset.uri);
        setOptionModalVisible(false);
      },
    );
  };

  const launchGallery = () => {
    setOptionModalVisible(false);
    DocumentPicker(
      // Handle PDF file
      pdfUri => {
        setFileUri(pdfUri.uri);
        setFileType('pdf');
        setFileName(pdfUri.name);
      },
      // Handle image file
      imageUri => {
        setFileUri(imageUri.uri);
        setFileType('image');
        setFileName(imageUri.name);
      },
    );
  };

  const removeImage = () => {
    setFileUri('');
    setFileType('');
    setFileName('');
  };

  const addLorry = async photoUri => {
    setLoading(true);
    const userInfo = await AsyncStorage.getItem('userInfo');

    var photo = {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };
    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('vehicle_no', vehicleNo);
    // formData.append('current_location', currentLocation);
    // formData.append('current_location_state', currentLocationState);
    formData.append('vehicle_category_id', vehicleCategoryId);
    formData.append('vehicle_type_id', vehicleTypeId);
    formData.append('vehicle_size_id', vehicleSizeId);
    formData.append('vehicle_capacity', vehicleCapacity);
    // formData.append('is_all_india_permit', isAllIndiaPermit);
    // formData.append('selected_state_id', selectedStateId.join(','));
    formData.append('truck_rc', photo);

    try {
      const response = await apiPost(
        API_ENDPOINTS.LORRY.ADD_POST_LORRY,
        formData,
      );

      if (response.success) {
        navigation.navigate('LorryStatus', {lorryDetail: response.data});
        setLoading(false);
        showMessage({
          message: response.message,
          description: '',
          type: 'success',
        });
      } else {
        setLoading(false);
        showMessage({
          message: response.message,
          description: '',
          type: 'danger',
        });
      }
    } catch (error) {
      setLoading(false);
      console.error(error.message);
      showMessage({
        message: error.message,
        description: '',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

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
        setStateList(response.data);
      } else {
        setStateList([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchVehicleCategoryList = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    try {
      const response = await apiPost(
        API_ENDPOINTS.VEHICLE.GET_VEHICLE_CATEGORY_LIST,
        formData,
      );
      if (response.success) {
        setVehicleCategoryList(response.data);
      } else {
        setVehicleCategoryList([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchVehicleTypeList = async id => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    setVehicleCategoryId(id);

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('vehicle_category_id', id);
    try {
      const response = await apiPost(
        API_ENDPOINTS.VEHICLE.GET_VEHICLE_TYPE_LIST,
        formData,
      );

      if (response.success) {
        setVehicleTypeList(response.data);
      } else {
        setVehicleTypeList([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchVehicleSizeList = async id => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('vehicle_category_id', vehicleCategoryId);
    formData.append('vehicle_type_id', id);

    try {
      const response = await apiPost(
        API_ENDPOINTS.VEHICLE.GET_VEHICLE_SIZE_LIST,
        formData,
      );

      if (response.success) {
        setVehicleSizeList(response.data);
      } else {
        setVehicleSizeList([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchStateList();
    fetchVehicleCategoryList();
  }, []);

  const vehicleCategorySelect = id => {
    setVehicleCategoryId(id);
    setValidationErrors(prev => ({...prev, selectedCard: ''}));
    fetchVehicleTypeList(id);
    setSelectedCard(id);
  };

  // const handlePermitCheckbox = newValue => {
  //   setSelection(newValue);
  //   setIsAllIndiaPermit(newValue ? 1 : 0);
  //   if (newValue) {
  //     const allStateIds = stateList.map(item => item.id);
  //     setSelectedStateId(allStateIds);
  //     setValidationErrors(prev => ({ ...prev, selectedStateId: '' }));
  //   } else {
  //     setSelectedStateId([]);

  //     setValidationErrors(prev => ({
  //       ...prev,
  //       selectedStateId: 'Please select a vehicle route',
  //     }));
  //   }
  // };

  // Form Validation step wise

  const validateStep = step => {
    const errors = {};

    if (step === 0) {
      if (!vehicleNo) errors.vehicleNo = ' Vehicle No is required';
      // if (!currentLocation)
      //   errors.currentLocation = '* Current Location is required';
      // if (!isSelected && selectedStateId.length === 0) {
      //   errors.selectedStateId = ' * Select at least one state for the route';
      // }
    }

    if (step === 1) {
      if (!selectedCard) errors.selectedCard = ' * Select a vehicle category';
      if (!vehicleTypeId) errors.vehicleTypeId = 'Select a vehicle type';
      if (!vehicleCapacity)
        errors.vehicleCapacity = 'Vehicle capacity is required';
      if (!fileUri) errors.truckRc = 'Upload RC Document';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const labels = ['Location & Material Details', 'Vehicle'];
  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 4,
    currentStepStrokeWidth: 3.5,
    stepStrokeCurrentColor: '#203afa',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#203afa',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#203afa',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#203afa',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#203afa',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 14,
    currentStepLabelColor: '#203afa',
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < labels.length - 1) {
        setCurrentStep(prevStep => {
          const newStep = prevStep + 1;
          return newStep;
        });
      } else {
        addLorry(fileUri);
      }
    }
  };

  const handlePlaceSelected = (data, details) => {
    if (data && data.description) {
      setCurrentLocation(data.description); // Set current location
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        currentLocation: '', // Clear the error for currentLocation
      }));

      let state = '';
      if (data.terms && data.terms.length > 1) {
        const stateTerm = data.terms.find((term, index) => {
          return index === data.terms.length - 2;
        });

        if (stateTerm) {
          state = stateTerm.value;
          setCurrentLocationState(state); // Set the state name
        }
      }
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        currentLocation: 'Please select a current location', // Set the error if no data
      }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={mainStyles.stepContainer}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}>
              <View style={mainStyles.flexRow}>
                <View style={{width: '100%'}}>
                  <TextInputComponent
                    label={
                      <Text>
                        Vehicle No <Text style={{color: 'red'}}>*</Text>
                      </Text>
                    }
                    value={vehicleNo}
                    onChangeText={text => {
                      setVehicleNo(text);
                      setValidationErrors(prev => ({...prev, vehicleNo: ''})); // Clear error on input
                    }}
                    style={mainStyles}
                    placeholder="Enter Vehicle No"
                    keyboardType="default"
                    color="#000000"
                    placeholderTextColor="#C0C0C0"
                    autoCapitalize="characters"
                    error={!!validationErrors.vehicleNo}
                    errorMessage={validationErrors.vehicleNo}
                  />
                </View>
              </View>

              {/* Google api call for places */}
              {/* <Text style={MultiSelectStyle.label}>
                Current Vehicle Location <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <GooglePlacesSearch
                onPlaceSelected={handlePlaceSelected}
                placeHolder={'Search Current Location'}
                hasError={!!validationErrors.currentLocation}
              />
              {validationErrors.currentLocation && (
                <Text style={{ color: 'red', fontSize: 12 }}>
                  {validationErrors.currentLocation}
                </Text>
              )} */}
              {/* All India Permit Check Box */}
              {/* <View>
                <View style={mainStyles.checkboxContainer}>
                  <CheckBox
                    value={isSelected}
                    onValueChange={handlePermitCheckbox}
                    style={mainStyles.checkbox}
                    tintColors={{ true: 'blue', false: 'grey' }}
                  />
                  <Text
                    style={[
                      mainStyles.label,
                      isAllIndiaPermit ? { color: 'blue' } : { color: '#7D7D7D' },
                    ]}>
                    All India Permit
                  </Text>
                </View>
              </View> */}

              {/* <View style={mainStyles.marginBottom}>
                <View style={{ width: '100%', marginTop: 5 }}>
                  <Text style={MultiSelectStyle.label}>
                    Vehicle Route <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <MultiSelect
                    data={stateList}
                    value={selectedStateId}
                    onChange={items => {
                      const selectedIds = items.map(item => item.id);
                      // Update the state with the array of selected IDs
                      setSelectedStateId(selectedIds);
                      if (selectedStateId.length > 0) {
                        setValidationErrors(prev => ({
                          ...prev,
                          selectedStateId: '',
                        }));
                      }
                    }}
                    renderItem={renderItem}
                    renderSelectedItem={item => (
                      <View style={MultiSelectStyle.selectedStyle}>
                        <Text style={MultiSelectStyle.textSelectedStyle}>
                          {item.name}
                        </Text>
                        <TouchableOpacity onPress={() => deleteState(item.id)}>
                          <AntDesign color="black" name="delete" size={15} />
                        </TouchableOpacity>
                      </View>
                    )}
                    placeholder="Select Vehicle Route"
                    labelField="name"
                    valueField="id"
                    activeColor="lightgrey"
                    showsVerticalScrollIndicator={false}
                    // search
                    // searchPlaceholder="Search..."
                    style={[
                      MultiSelectStyle.dropdown,
                      validationErrors.selectedStateId && {
                        borderColor: 'red',
                        borderWidth: 1,
                      },
                    ]}
                    placeholderStyle={MultiSelectStyle.placeholder}
                    selectedTextStyle={MultiSelectStyle.selectedTextStyle}
                    inputSearchStyle={MultiSelectStyle.inputSearchStyle}
                    selectedStyle={MultiSelectStyle.selectedStyle}
                  />
                  {validationErrors.selectedStateId && (
                    <Text style={{ color: 'red', fontSize: 12 }}>
                      {validationErrors.selectedStateId}
                    </Text>
                  )}
                </View>
              </View> */}
            </ScrollView>
          </View>
        );
      case 1:
        return (
          <View style={mainStyles.stepContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={mainStyles.cardRow}>
                {vehicleCategoryList.map(item => (
                  <CustomCard
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedCard}
                    onPress={() => {
                      vehicleCategorySelect(item.id);
                      setValidationErrors(prev => ({
                        ...prev,
                        selectedCard: '',
                      }));
                    }}
                  />
                ))}
                {validationErrors.selectedCard && (
                  <Text style={{color: 'red', marginTop: 10, fontSize: 13}}>
                    {validationErrors.selectedCard}
                  </Text>
                )}
              </View>

              <View style={mainStyles.marginBottom}>
                <View style={{width: '100%'}}>
                  <DropdownComponent
                    label={
                      <Text>
                        Vehicle Type <Text style={{color: 'red'}}>*</Text>
                      </Text>
                    }
                    data={vehicleTypeList}
                    value={vehicleTypeId}
                    onChange={item => {
                      fetchVehicleSizeList(item.id);
                      setVehicleTypeId(item.id);
                      setValidationErrors(prev => ({
                        ...prev,
                        vehicleTypeId: '',
                      }));
                    }}
                    style={mainStyles}
                    error={!!validationErrors.vehicleTypeId}
                    errorMessage={validationErrors.vehicleTypeId}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Vehicle Type"
                    searchPlaceholder="Search..."
                  />
                </View>
              </View>

              <View style={mainStyles.marginBottom}>
                <View style={{width: '100%', marginBottom: 20}}>
                  <DropdownComponent
                    label={'Vehicle Size'}
                    data={vehicleSizeList}
                    value={vehicleSizeId}
                    onChange={item => {
                      setVehicleSizeId(item.id);
                    }}
                    style={mainStyles}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Vehicle Size"
                    searchPlaceholder="Search..."
                  />
                </View>
              </View>

              <View style={mainStyles.flexRow}>
                <View style={{width: '100%'}}>
                  <TextInputComponent
                    label={
                      <Text>
                        Vehicle Capacity <Text style={{color: 'red'}}>*</Text>
                      </Text>
                    }
                    value={vehicleCapacity}
                    onChangeText={text => {
                      setVehicleCapacity(text);
                      setValidationErrors(prev => ({
                        ...prev,
                        vehicleCapacity: '',
                      }));
                    }}
                    style={mainStyles}
                    placeholder="Vehicle Capacity"
                    keyboardType="numeric"
                    color="#000000"
                    placeholderTextColor="#C0C0C0"
                    error={!!validationErrors.vehicleCapacity}
                    errorMessage={validationErrors.vehicleCapacity}
                  />
                </View>
              </View>

              {/* Choose truckRc file input */}

              <View style={mainStyles.flexRow}>
                <View style={{width: '100%'}}>
                  <Pressable onPress={() => setOptionModalVisible(true)}>
                    <TextInputComponent
                      label={
                        <Text>
                          Upload RC Document{' '}
                          <Text style={{color: 'red'}}>*</Text>
                        </Text>
                      }
                      caretHidden={true}
                      editable={false}
                      value={truckRc}
                      // onChangeText={text => setVehicleCapacity(text)}
                      style={mainStyles}
                      placeholder="Choose File"
                      // keyboardType="numeric"
                      color="#000000"
                      placeholderTextColor="#C0C0C0"
                      error={!!validationErrors.truckRc}
                      errorMessage={validationErrors.truckRc}
                    />
                  </Pressable>
                </View>
              </View>
              {fileUri &&
                (fileType === 'pdf' ? (
                  <View style={mainStyles.imageWithTimestamp}>
                    <View style={MultiSelectStyle.pdfContainer}>
                      <Image
                        source={require('../../assets/images/file.png')}
                        style={MultiSelectStyle.pdfImage}
                        blurRadius={4}
                      />
                      <Text>{fileName}</Text>
                      <TouchableOpacity
                        style={MultiSelectStyle.viewPdfBtn}
                        onPress={() => viewDocument({uri: fileUri})}>
                        <Text style={MultiSelectStyle.viewPdfText}>
                          View PDF
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={mainStyles.imageWithTimestamp}>
                    <Image
                      source={{uri: fileUri}}
                      style={MultiSelectStyle.image}
                    />
                  </View>
                ))}
              {fileUri ? (
                <TouchableOpacity
                  style={mainStyles.removeBtn}
                  onPress={removeImage}>
                  <AntDesign name="closecircle" color="red" size={20} />
                  <Text style={mainStyles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          </View>
        );
    }
  };

  return (
    <View style={MultiSelectStyle.container}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentStep}
        labels={labels}
        stepCount={2}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{marginTop: '10%'}}
        showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>
      {loading ? (
        <Text
          style={{
            textAlign: 'center',
            marginVertical: 10,
            color: '#000',
            fontSize: 15,
          }}>
          Wait For Adding Your Lorry....
        </Text>
      ) : (
        <>
          <View
            style={[
              MultiSelectStyle.navigationButtons,
              currentStep === 0 && {justifyContent: 'flex-end'},
            ]}>
            {currentStep > 0 && (
              <TouchableOpacity
                onPress={handlePreviousStep}
                style={MultiSelectStyle.button}>
                <AntDesign name="arrowleft" size={28} color={'blue'} />
              </TouchableOpacity>
            )}
            {currentStep < labels.length - 1 ? (
              <TouchableOpacity
                onPress={handleNextStep}
                style={[MultiSelectStyle.button, {marginLeft: '70%'}]}>
                <AntDesign name="arrowright" size={28} color={'blue'} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleNextStep}
                style={MultiSelectStyle.button}
                disabled={loading}>
                <Text
                  style={[
                    MultiSelectStyle.buttonText,
                    loading && {color: 'grey'},
                  ]}>
                  Submit
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
      <ImageOptionModalComponent
        title="Upload RC of Vehicle"
        visible={optionModalVisible}
        onClose={() => setOptionModalVisible(false)}
        onCameraPress={launchCamera}
        onGalleryPress={launchGallery}
      />
    </View>
  );
};

export default AddLorry;

const MultiSelectStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '5%',
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 10,
  },
  viewPdfBtn: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPdfText: {
    color: 'blue',
    fontSize: 16,
  },
  pdfContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfImage: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Arial',
    color: '#7D7D7D',
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 4,
    // marginTop: 20,
  },
  dropdown: {
    height: 50,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  placeholder: {
    fontSize: 15,
    color: '#c0c0c0',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },

  textSelectedStyle: {
    marginRight: 5,
    fontSize: 13,
    color: 'grey',
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Bottom button mainStyles
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    marginVertical: 2,
    // borderColor:'black',
    // borderWidth:1,
    paddingHorizontal: '6%',
    paddingTop: 5,
    paddingBottom: 20,
  },
  buttonText: {
    color: 'blue',
    fontSize: 18,
    textAlign: 'center',
  },
});
