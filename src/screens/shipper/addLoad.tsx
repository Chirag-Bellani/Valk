import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';

import StepIndicator from 'react-native-step-indicator';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CheckBox from '@react-native-community/checkbox';
import mainStyles from '../../assets/styles/main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';
import GooglePlacesSearch from '../../components/googlePlaceSearch';
import DropdownComponent from '../../components/dropdownComponent';
import TextInputComponent from '../../components/textInputComponent';
import CustomRadioButton from '../../components/customRadioButton';
import CustomCard from '../../components/truckCard';
import DatePickerComponent from '../../components/datePickerComponent';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import axios from 'axios';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import TimePickerComponent from '../../components/timePickerComponent';

const AddLoad = ({navigation, route}) => {
  const GOOGLE_MAPS_API_KEY = 'AIzaSyBuUVyHOxiZyUIvBIvsZg6O_ZiedhxW0FA';

  const partyId = route.params?.party_id;
  const repostLoadData = route.params?.loadDetail;
  const [loadingPoint, setLoadingPoint] = useState('');
  const [dropPoint, setDropPoint] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Tonn(s)');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTime, setSelectedTime] = useState(new Date()); // Default time
  const [displayValue, setDisplayValue] = useState('');

  const [fromLocationState, setFromLocationState] = useState('');
  const [toLocationState, setToLocationState] = useState('');
  const [selectedBoxLabour, setSelectedBoxLabour] = useState(1);
  const [selectedBox, setSelectedBox] = useState(1);
  const [labourChargeBox, setLabourChargeBox] = useState('YES');
  // const [selectedPayment, setSelectedPayment] = useState(2);
  const [selectedUnit, setSelectedUnit] = useState(1);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [fromDateDisplay, setFromDateDisplay] = useState('');
  const [fromDateServer, setFromDateServer] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [emptyParkName, setEmptyParkName] = useState('');
  const [addCargoName, setAddCargoName] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [isSelectedInsurance, setSelectionInsurance] = useState(false);
  const [isInsuranceNeeded, setIsInsuranceNeeded] = useState(null);
  const [isTandCSelected, setIsTandCSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cargoList, setCargoList] = useState([]);
  const [partyList, setPartyList] = useState([]);
  const [vehicleCategoryList, setVehicleCategoryList] = useState([]);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [vehicleSizeList, setVehicleSizeList] = useState([]);
  const [consignorId, setConsignorId] = useState(null);
  const [consigneeId, setConsigneeId] = useState(null);
  const [cargoId, setCargoId] = useState(null);
  const [vehicleCategoryId, setVehicleCategoryId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [vehicleTypeId, setVehicleTypeId] = useState(null);
  const [vehicleSizeId, setVehicleSizeId] = useState(null);
  const [paymentType, setPaymentType] = useState('Advance');
  // const [advancePer, setAdvancePer] = useState(null);
  const [labourCharge, setLabourCharge] = useState(0);
  const [expectedPrice, setExpectedPrice] = useState('');
  const [priceType, setPriceType] = useState('Fixed Price');
  const [isOdcConsignment, setIsOdcConsignment] = useState(null);
  const [isTandCAgree, setIsTandCAgree] = useState(null);
  const [length, setLength] = useState(null);
  const [height, setHeight] = useState(null);
  const [breadth, setBreadth] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [lengthError, setLengthError] = useState(null);
  const [heightError, setHeightError] = useState(null);
  const [breadthError, setBreadthError] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isAddMeterialModalVisible, setAddMaterialModalVisible] =
    useState(false);
  const [isAddOtherMaterialChecked, setAddOtherMaterialChecked] =
    useState(false);
  const [advancePerValue, setAdvancePerValue] = useState(50);
  const [cargoError, setCargoError] = useState(false);

  const handleFormSubmit = async () => {
    const timeIn24HourFormat = moment(displayValue, 'hh:mm A').format(
      'HH:mm:ss',
    );
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('from_location', loadingPoint);
    formData.append('from_location_state', fromLocationState);
    formData.append('to_location', dropPoint);
    formData.append('to_location_state', toLocationState);
    formData.append('cargo_id', cargoId);
    formData.append('consignor_id', consignorId);
    formData.append('consignee_id', consigneeId);
    formData.append('qty', quantity);
    formData.append('unit', unit);
    formData.append('vehicle_category_id', vehicleCategoryId);
    formData.append('vehicle_type_id', vehicleTypeId);
    formData.append('vehicle_size_id', vehicleSizeId);
    formData.append('payment_type', paymentType);
    formData.append('advance_per', advancePerValue);
    formData.append('expected_price', expectedPrice);
    formData.append('price_type', priceType);
    formData.append('pickup_date', fromDateServer);
    formData.append('pickup_time', timeIn24HourFormat);
    formData.append('is_odc_consignment', isOdcConsignment ? 1 : 0);
    formData.append('is_applied_t_n_c', isTandCAgree ? 1 : 0);
    formData.append('is_labour_charges', labourChargeBox);
    formData.append('is_cargo_insurance', isInsuranceNeeded ? 1 : 0);
    formData.append('labour_charges', labourCharge);
    formData.append('distance', distanceInfo?.distance);
    formData.append('empty_park', emptyParkName);
    formData.append('length', length);
    formData.append('breadth', breadth);
    formData.append('height', height);
    formData.append('remarks', remarks);

    var API_URL = API_ENDPOINTS.LOAD.ADD_LOAD;
    if (partyId) {
      API_URL = API_ENDPOINTS.LOAD.ADD_LOAD_BY_SHIPPER;
      formData.append('transporter_id', partyId);
    }

    try {
      const response = await apiPost(API_URL, formData);
      if (response.success) {
        if (partyId) {
          navigation.navigate('My Lorry List');
          showMessage({
            message: response.message,
            type: 'success',
          });
        } else {
          navigation.navigate('My Loads');
          showMessage({
            message: response.message,
            type: 'success',
          });
        }
      } else {
        showMessage({
          message: response.message,
          description: '',
          type: 'danger',
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCargoList = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    try {
      const response = await apiPost(
        API_ENDPOINTS.CARGO.GET_CARGO_LIST,
        formData,
      );
      if (response.success) {
        setCargoList(response.data);
      } else {
        setCargoList([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addNewCargo = async () => {
    if (addCargoName === '') {
      setCargoError(true);
      return false;
    }

    setLoading(true);
    let formData = new FormData();
    formData.append('name', addCargoName);
    try {
      const response = await apiPost(API_ENDPOINTS.CARGO.ADD_CARGO, formData);
      if (response.success) {
        setLoading(false);
        setCargoError(false);
        setAddMaterialModalVisible(false);
        fetchCargoList();
        setAddCargoName('');
        showMessage({
          message: response.message,
          type: 'success',
        });
      } else {
        setLoading(false);
        showMessage({
          message: response.message,
          type: 'success',
        });
      }
    } catch (error) {
      setAddCargoName('');
      setCargoError(false);
      setAddOtherMaterialChecked(false);
      showMessage({
        message: 'Cargo already exists, please select.',
        type: 'success',
      });
      setLoading(false);
      console.log(error.message);
    } finally {
      setAddMaterialModalVisible(false);
      setLoading(false);
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

  const fetchPartyList = async () => {
    try {
      const response = await apiPost(
        API_ENDPOINTS.SHIPPER_PARTY.GET_SHIPPER_PARTY,
      );

      if (response.success) {
        setPartyList(response.data);
      } else {
        console.log('Failed to fetch data');
        setPartyList([]);
      }

      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCargoList();
    fetchPartyList();
    fetchVehicleCategoryList();
  }, []);

  // Function to handle submission of the form

  const validateStep = step => {
    const errors = {};

    if (step === 0) {
      if (!loadingPoint)
        errors.loadingPoint = ' * Loading Location is required';
      if (!dropPoint) errors.dropPoint = '* Drop Location is required';
      if (!cargoId) errors.cargoId = 'Please select material';
      if (!quantity) errors.quantity = 'Quantity is required';
    }

    if (step === 1) {
      if (!selectedCard) errors.selectedCard = ' * Select a vehicle category';
      if (!vehicleTypeId) errors.vehicleTypeId = 'Select a vehicle type';
    }

    if (step === 2) {
      if (paymentType === 'null' || !paymentType) {
        errors.paymentType = 'Please select payment type'; // Fixed key
      }
      if (!expectedPrice) errors.expectedPrice = 'Please select expected price';
      // if (!priceType) errors.priceType = 'Please select  price type';
      if (!fromDateServer)
        errors.fromDateServer = 'Please select  booking  date';
      if (!displayValue) errors.displayValue = 'Please select time';
      // Advance Percentage Validation
      if (!isTandCAgree) {
        errors.isTandCAgree = 'Please agree to the terms and conditions';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const vehicleCategorySelect = id => {
    setVehicleCategoryId(id);
    fetchVehicleTypeList(id);
    setSelectedCard(id);
  };

  useEffect(() => {
    if (selectedCard) {
      fetchVehicleTypeList(selectedCard);
    }
  }, [selectedCard]);

  useEffect(() => {
    if (vehicleTypeId) {
      fetchVehicleSizeList(vehicleTypeId);
    }
  }, [vehicleTypeId]);

  const perPriceType = box => {
    if (selectedBox === box) return; // Do nothing if the same box is clicked

    setSelectedBox(box);

    if (box === 1) {
      setPriceType('Fixed Price');
    } else if (box === 2) {
      setPriceType('Per Tonne');
    } else if (box === 3) {
      setPriceType('Per KiloLitre');
    }
  };

  const labourCharges = box => {
    if (selectedBoxLabour === box) return;
    setSelectedBoxLabour(selectedBoxLabour === box ? null : box);
    if (box == 1) {
      setLabourChargeBox('Yes');
      setLabourCharge(0);
    } else if (box == 2) {
      setLabourChargeBox('No');
    }
  };

  // const selectPaymentType = box => {
  //   if (selectedPayment === box) {
  //     setSelectedPayment(null);
  //     setPaymentType(null);
  //   } else {
  //     setSelectedPayment(box);
  //     const unit = box === 1 ? 'Advance' : 'To Pay';
  //     setPaymentType(unit);
  //   }

  //   // Remove validation error if valid selection is made
  //   if (box && selectedPayment !== box) {
  //     setValidationErrors(prevErrors => {
  //       const { paymentType, ...otherErrors } = prevErrors; // Remove paymentType error
  //       return otherErrors;
  //     });
  //   }
  // };

  const selectUnit = box => {
    if (selectedUnit === box) return;
    setSelectedUnit(selectedUnit === box ? null : box);
    const unit = box === 1 ? 'Tonne(s)' : 'Kilo Litre(s)';
    setUnit(unit);
  };

  const toggleFromDatePicker = () => {
    setShowFromPicker(!showFromPicker);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const onTimeChange = (event, time) => {
    setShowTimePicker(false); // Hide the picker after selection
    if (time) {
      setSelectedTime(time);
      const formattedTime = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setDisplayValue(formattedTime); // Update the display value
      setValidationErrors(prev => ({...prev, displayValue: ''}));
    }
  };

  const onChangeFromDate = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    if (Platform.OS === 'android') {
      setShowFromPicker(false);
    }
    setFromDate(currentDate);
    setFromDateDisplay(formatDate(currentDate, 'display'));
    setFromDateServer(formatDate(currentDate, 'server'));
    setValidationErrors(prevErrors => {
      const {fromDateServer, ...otherErrors} = prevErrors; // Remove `fromDateServer` error
      return otherErrors;
    });
    setStep3Data(prevState => ({
      ...prevState,
      BookingDate: formatDate(currentDate, 'display'),
    }));
  };

  const formatDate = (rawDate, type) => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    if (type === 'display') {
      return `${day}-${month}-${year}`;
    } else {
      return `${year}-${month}-${day}`;
    }
  };

  const handleODCCheckbox = newValue => {
    setSelection(newValue);
    setIsOdcConsignment(newValue);
  };

  const handleInsuranceCheckbox = newValue => {
    setSelectionInsurance(newValue);
    setIsInsuranceNeeded(newValue);
  };

  const handleTAndCCheckbox = newValue => {
    setIsTandCSelected(newValue);
    setIsTandCAgree(newValue);
    setValidationErrors(prev => ({...prev, isTandCAgree: null}));
  };

  const labels = [
    'Location & Material Details',
    'Vehicle Details',
    'Payment Detail',
  ];

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
        handleFormSubmit(); // This should get called if it's the last step
      }
    }
  };

  const handleLoadingPoint = (data, details) => {
    if (data && data.description) {
      setLoadingPoint(data.description); // Set current location
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        loadingPoint: '', // Clear the error for currentLocation
      }));

      let state = '';
      if (data.terms && data.terms.length > 1) {
        const stateTerm = data.terms.find((term, index) => {
          return index === data.terms.length - 2;
        });

        if (stateTerm) {
          state = stateTerm.value;
          setFromLocationState(state); // Set the state name
        }
      }
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        loadingPoint: 'Please select a loading location', // Set the error if no data
      }));
    }
  };

  const handleDropPoint = (data, details) => {
    if (data && data.description) {
      setDropPoint(data.description); // Set current location
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        dropPoint: '', // Clear the error for currentLocation
      }));
      let state = '';
      if (data.terms && data.terms.length > 1) {
        const stateTerm = data.terms.find((term, index) => {
          return index === data.terms.length - 2;
        });

        if (stateTerm) {
          state = stateTerm.value;
          setToLocationState(state);
        }
      }
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        dropPoint: 'Please select a drop location', // Set the error if no data
      }));
    }
  };

  const calculateDistance = async (origin, destination) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
          origin,
        )}&destinations=${encodeURIComponent(
          destination,
        )}&key=${GOOGLE_MAPS_API_KEY}`,
      );

      if (response.data.status === 'OK') {
        const distance = response.data.rows[0].elements[0].distance.text; // e.g., "12.3 km"
        const duration = response.data.rows[0].elements[0].duration.text; // e.g., "15 mins"
        return {distance, duration};
      } else {
        console.error(
          'Error from Distance Matrix API:',
          response.data.error_message,
        );
        return null;
      }
    } catch (error) {
      console.error('Error fetching distance:', error);
      return null;
    }
  };

  const handleCalculateDistance = async () => {
    if (loadingPoint && dropPoint) {
      const result = await calculateDistance(loadingPoint, dropPoint);

      if (result) {
        setDistanceInfo(result); // Save the distance and duration
      } else {
        console.error('Failed to calculate distance.');
      }
    } else {
      console.error('Both loading and drop points must be selected.');
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    setFromDate(currentDate);
    setFromDateDisplay(formatDate(currentDate, 'display'));
    setFromDateServer(formatDate(currentDate, 'server'));
    if (loadingPoint && dropPoint) {
      handleCalculateDistance();
    }
  }, [loadingPoint, dropPoint]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={mainStyles.stepContainer}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}>
              <View
                style={[mainStyles.flexRow, {justifyContent: 'space-between'}]}>
                <Text style={MultiSelectStyle.label}>
                  Loading Point <Text style={{color: 'red'}}>*</Text>
                </Text>
                <Text style={MultiSelectStyle.label}>
                  Dist: {distanceInfo?.distance || `0 Km`}
                </Text>
              </View>
              <GooglePlacesSearch
                onPlaceSelected={handleLoadingPoint}
                placeHolder={'Search Loading Point'}
                hasError={!!validationErrors.loadingPoint}
              />
              {validationErrors.loadingPoint && (
                <Text style={{color: 'red', fontSize: 12, paddingBottom: 12}}>
                  {validationErrors.loadingPoint}
                </Text>
              )}

              <Text style={MultiSelectStyle.label}>
                Drop Point <Text style={{color: 'red'}}>*</Text>
              </Text>
              <GooglePlacesSearch
                onPlaceSelected={handleDropPoint}
                placeHolder={'Search Drop Point'}
                hasError={!!validationErrors.dropPoint}
              />
              {validationErrors.dropPoint && (
                <Text style={{color: 'red', fontSize: 12}}>
                  {validationErrors.dropPoint}
                </Text>
              )}

              {/* Consignor Dropdown */}

              <DropdownComponent
                label="Consignor"
                data={partyList}
                value={''}
                onChange={item => {
                  setConsignorId(item.id);
                }}
                style={mainStyles}
                labelField="company_name"
                valueField="id"
                placeholder="Select Consignor"
                searchPlaceholder="Search..."
              />

              {/* Consignee Dropdown */}
              <DropdownComponent
                label="Consignee"
                data={partyList}
                value={''}
                onChange={item => {
                  setConsigneeId(item.id);
                }}
                style={mainStyles}
                labelField="company_name"
                valueField="id"
                placeholder="Select Consignee"
                searchPlaceholder="Search..."
                error={!!validationErrors.consigneeId}
                errorMessage={validationErrors.consigneeId}
              />

              <View style={{width: '100%'}}>
                <DropdownComponent
                  label={
                    <Text>
                      Material <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  }
                  data={cargoList}
                  value={cargoId}
                  onChange={item => {
                    // setMaterialName(item);
                    setCargoId(item.id);
                    setValidationErrors(prev => ({...prev, quantity: ''}));
                  }}
                  style={mainStyles}
                  labelField="name"
                  valueField="id"
                  placeholder="Select Material"
                  searchPlaceholder="Search..."
                  error={!!validationErrors.cargoId}
                  errorMessage={validationErrors.cargoId}
                />
              </View>

              <View style={[mainStyles.flexRow, {marginBottom: 0}]}>
                <CheckBox
                  value={isAddOtherMaterialChecked}
                  onValueChange={newValue => {
                    if (newValue) {
                      setAddMaterialModalVisible(true);
                      setAddOtherMaterialChecked(true);
                    } else {
                      setAddOtherMaterialChecked(false);
                    }
                  }}
                  style={mainStyles.checkbox}
                  tintColors={{true: '#203afa'}}
                />
                <Text style={mainStyles.label}>Other (Add Material)</Text>
              </View>

              {/* Quatity Input */}
              <View style={{marginVertical: '3%', width: '98%'}}>
                <TextInputComponent
                  label={
                    <Text>
                      Quantity <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  }
                  value={quantity}
                  onChangeText={text => setQuantity(text)}
                  style={mainStyles}
                  placeholder="Enter Quantity"
                  keyboardType="numeric"
                  color="#000000"
                  placeholderTextColor="#C0C0C0"
                  error={!!validationErrors.quantity}
                  errorMessage={validationErrors.quantity}
                />
              </View>

              <View style={mainStyles.checkboxContainer}>
                <CustomRadioButton
                  isSelected={selectedUnit === 1}
                  onPress={() => selectUnit(1)}
                  label="Tonne(s)"
                />
                <CustomRadioButton
                  isSelected={selectedUnit === 2}
                  onPress={() => selectUnit(2)}
                  label="Kilo Litre(s)"
                />
              </View>
            </ScrollView>
          </View>
        );
      case 1:
        return (
          <View style={mainStyles.stepContainer}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}>
              {/* Displaying Step 1 Data */}

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

              {vehicleCategoryId === 2 && (
                <View style={{width: '100%'}}>
                  <TextInputComponent
                    label="Empty Park Name"
                    value={emptyParkName}
                    onChangeText={text => {
                      setEmptyParkName(text);
                    }}
                    style={mainStyles}
                    placeholder="Enter Empty Park Name"
                    color="#000000"
                    placeholderTextColor="#C0C0C0"
                    error={undefined}
                    errorMessage={''}
                  />
                </View>
              )}

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
                    labelField="name"
                    valueField="id"
                    placeholder="Select Vehicle Type"
                    searchPlaceholder="Search..."
                    error={!!validationErrors.vehicleTypeId}
                    errorMessage={validationErrors.vehicleTypeId}
                  />
                </View>
              </View>

              <View style={mainStyles.marginBottom}>
                <View style={{width: '100%', marginBottom: 20}}>
                  <DropdownComponent
                    label="Vehicle Size"
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
            </ScrollView>
          </View>
        );
      case 2:
        return (
          <View style={mainStyles.stepContainer}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}>
              <View style={mainStyles.bottomMargin}>
                <Text style={mainStyles.label}>Select Advance Percentage</Text>
                <View
                  style={[
                    mainStyles.checkboxContainer,
                    {flexDirection: 'row', justifyContent: 'space-between'},
                  ]}>
                  {/* <CustomRadioButton
                    isSelected={selectedPayment === 1}
                    onPress={() => selectPaymentType(1)}
                    label="Advance"
                    hasError={!!validationErrors.paymentType}
                    errorMessage={validationErrors.paymentType}
                  />
                  <CustomRadioButton
                    isSelected={selectedPayment === 2}
                    onPress={() => selectPaymentType(2)}
                    label="To Pay"
                    hasError={!!validationErrors.paymentType}
                    errorMessage={validationErrors.paymentType}
                  /> */}
                  <Slider
                    style={{
                      flex: 1,
                      height: 40,
                    }}
                    minimumValue={20}
                    maximumValue={100}
                    step={1}
                    value={advancePerValue}
                    onValueChange={setAdvancePerValue}
                    minimumTrackTintColor="#007BFF"
                    maximumTrackTintColor="#000"
                    thumbTintColor="#007BFF"
                  />
                  <View
                    style={{
                      backgroundColor: '#232323',
                      padding: '1.5%',
                      borderRadius: 10,
                    }}>
                    <Text style={{color: '#fff'}}>{advancePerValue} %</Text>
                  </View>
                </View>
              </View>

              {/* {paymentType === 'Advance' && (
                <View style={mainStyles.flexRow}>
                  <View style={{ width: '100%' }}>
                    <TextInputComponent
                      label="Advance Percentage (%)"
                      value={advancePer}
                      onChangeText={text => {
                        setAdvancePer(text);
                        setValidationErrors(prev => ({
                          ...prev,
                          advancePer: '',
                        }));
                      }}
                      style={mainStyles}
                      placeholder="Enter price"
                      keyboardType="numeric"
                      color="#000000"
                      placeholderTextColor="#C0C0C0"
                      error={!!validationErrors.advancePer}
                      errorMessage={validationErrors.advancePer}
                    />
                  </View>
                </View>
              )} */}

              <TextInputComponent
                label={
                  <Text>
                    Enter Expected Price <Text style={{color: 'red'}}>*</Text>
                  </Text>
                }
                value={expectedPrice}
                onChangeText={item => {
                  setExpectedPrice(item);
                  setValidationErrors(prev => ({...prev, expectedPrice: ''}));
                }}
                style={mainStyles}
                placeholder="Enter price"
                keyboardType="numeric"
                color="#000000"
                placeholderTextColor="#C0C0C0"
                error={!!validationErrors.expectedPrice}
                errorMessage={validationErrors.expectedPrice}
              />

              <View style={mainStyles.bottomMargin}>
                <View style={mainStyles.checkboxContainer}>
                  <CustomRadioButton
                    isSelected={selectedBox === 1}
                    onPress={() => perPriceType(1)}
                    label="Fixed Price"
                  />
                  <CustomRadioButton
                    isSelected={selectedBox === 2}
                    onPress={() => perPriceType(2)}
                    label="Per Tonne"
                  />
                  <CustomRadioButton
                    isSelected={selectedBox === 3}
                    onPress={() => perPriceType(3)}
                    label="Per KiloLitre"
                  />
                </View>
              </View>

              <View style={mainStyles.bottomMargin}>
                {expectedPrice !== '' && (
                  <>
                    <Text style={mainStyles.label}>
                      Does Your Expected Price{' '}
                      <Text style={{color: 'blue'}}>{expectedPrice}/-</Text>{' '}
                      includes labour charge? (loading/unloading)
                    </Text>

                    <View style={mainStyles.checkboxContainer}>
                      <CustomRadioButton
                        isSelected={selectedBoxLabour === 1}
                        onPress={() => labourCharges(1)}
                        label="Yes"
                      />
                      <CustomRadioButton
                        isSelected={selectedBoxLabour === 2}
                        onPress={() => labourCharges(2)}
                        label="No"
                      />
                    </View>
                  </>
                )}
              </View>
              {labourChargeBox === 'No' && expectedPrice !== '' && (
                <View style={mainStyles.flexRow}>
                  <View style={{width: '100%'}}>
                    <TextInputComponent
                      label={<Text>Enter Labour Charge</Text>}
                      value={labourCharge}
                      onChangeText={text => {
                        setLabourCharge(text);
                      }}
                      style={mainStyles}
                      placeholder="Enter Labour Charges"
                      keyboardType="numeric"
                      color="#000000"
                      placeholderTextColor="#C0C0C0"
                    />
                  </View>
                </View>
              )}

              <View
                style={[
                  mainStyles.bottomMargin,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <View style={{width: '50%'}}>
                  <DatePickerComponent
                    label={
                      <Text>
                        Booking Date <Text style={{color: 'red'}}>*</Text>
                      </Text>
                    }
                    showPicker={showFromPicker}
                    minimumDate={fromDate}
                    date={fromDate}
                    onDateChange={onChangeFromDate}
                    togglePicker={toggleFromDatePicker}
                    displayValue={fromDateDisplay}
                    style={mainStyles}
                    placeholder="Select Booking Date"
                    color="#000000"
                    placeholderTextColor="#C0C0C0"
                    error={!!validationErrors.fromDateServer}
                    errorMessage={validationErrors.fromDateServer}
                  />
                </View>
                <View style={{width: '50%'}}>
                  <TimePickerComponent
                    label={
                      <Text>
                        Booking Time <Text style={{color: 'red'}}>*</Text>
                      </Text>
                    }
                    showPicker={showTimePicker}
                    togglePicker={toggleTimePicker}
                    time={selectedTime}
                    onTimeChange={onTimeChange}
                    displayValue={displayValue}
                    placeholder="Select Booking Time"
                    style={mainStyles}
                    error={!!validationErrors.displayValue}
                    errorMessage={validationErrors.displayValue}
                  />
                </View>
              </View>

              {/* <View style={mainStyles.bottomMargin}>
                <View style={{ width: '100%' }}>
                  <TimePickerComponent
                    label={
                      <Text>
                        Booking Time <Text style={{ color: 'red' }}>*</Text>
                      </Text>
                    }
                    showPicker={showTimePicker}
                    togglePicker={toggleTimePicker}
                    time={selectedTime}
                    onTimeChange={onTimeChange}
                    displayValue={displayValue}
                    placeholder="Select Booking Time"
                    style={mainStyles}
                    error={!!validationErrors.displayValue}
                    errorMessage={validationErrors.displayValue}
                  />
                </View>
              </View> */}

              <View style={mainStyles.bottomMargin}>
                <View style={mainStyles.checkboxContainer}>
                  <CheckBox
                    value={isSelectedInsurance}
                    onValueChange={handleInsuranceCheckbox}
                    style={mainStyles.checkbox}
                    tintColors={{true: '#203afa'}}
                  />
                  <Text style={mainStyles.label}>Need Cargo Insurance?</Text>
                </View>
              </View>

              <View style={mainStyles.bottomMargin}>
                <View style={mainStyles.checkboxContainer}>
                  <CheckBox
                    value={isSelected}
                    onValueChange={handleODCCheckbox}
                    style={mainStyles.checkbox}
                    tintColors={{true: '#203afa'}}
                  />
                  <Text style={mainStyles.label}>
                    Add ODC Consignment(feet)
                  </Text>
                </View>
              </View>

              {isOdcConsignment && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',

                      gap: 10,
                    }}>
                    <View style={{width: '31%'}}>
                      <TextInputComponent
                        label="Length (L)"
                        value={length}
                        onChangeText={text => setLength(text)}
                        style={mainStyles}
                        placeholder="Enter Length"
                        keyboardType="numeric"
                        color="#000000"
                        placeholderTextColor="#C0C0C0"
                        error={lengthError}
                        errorMessage="Enter Valid Length"
                      />
                    </View>

                    <View style={{width: '33%'}}>
                      <TextInputComponent
                        label="Breadth (B)"
                        value={breadth}
                        onChangeText={text => setBreadth(text)}
                        style={mainStyles}
                        placeholder="Enter Breadth"
                        keyboardType="numeric"
                        color="#000000"
                        placeholderTextColor="#C0C0C0"
                        error={breadthError}
                        errorMessage="Enter Valid Breadth"
                      />
                    </View>

                    <View style={{width: '30.3%'}}>
                      <TextInputComponent
                        label="Height (H)"
                        value={height}
                        onChangeText={text => setHeight(text)}
                        style={mainStyles}
                        placeholder="Enter Height"
                        keyboardType="numeric"
                        color="#000000"
                        placeholderTextColor="#C0C0C0"
                        error={heightError}
                        errorMessage="Enter Valid Height"
                      />
                    </View>
                  </View>
                </>
              )}
              {/* T & C checkbox */}
              <View style={mainStyles.bottomMargin}>
                <View style={mainStyles.checkboxContainer}>
                  <CheckBox
                    value={isTandCSelected}
                    onValueChange={handleTAndCCheckbox}
                    style={mainStyles.checkbox}
                    tintColors={{true: '#203afa'}}
                  />
                  <Text style={mainStyles.label}>
                    I agree to the{' '}
                    <Text
                      style={mainStyles.linkText}
                      onPress={() => navigation.navigate('TermsAndConditions')}>
                      Terms and Conditions
                    </Text>
                  </Text>
                </View>
                {validationErrors.isTandCAgree && (
                  <Text style={{color: 'red', fontSize: 12, marginTop: 5}}>
                    {validationErrors.isTandCAgree}
                  </Text>
                )}
              </View>
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
        stepCount={3}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{marginTop: '8%', paddingHorizontal: -10}}
        showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>
      <View
        style={[
          MultiSelectStyle.navigationButtons,
          currentStep === 0 && {justifyContent: 'flex-end'},
        ]}>
        {currentStep > 0 && (
          <TouchableOpacity
            onPress={handlePreviousStep}
            style={MultiSelectStyle.button}>
            <Text style={MultiSelectStyle.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        {currentStep < labels.length - 1 ? (
          <TouchableOpacity
            onPress={handleNextStep}
            style={[MultiSelectStyle.button]}>
            <Text style={MultiSelectStyle.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNextStep}
            style={MultiSelectStyle.button}>
            <Text style={MultiSelectStyle.buttonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddMeterialModalVisible}
        onRequestClose={() => {
          setAddMaterialModalVisible(false);
          setAddOtherMaterialChecked(false);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setAddMaterialModalVisible(false);
            setAddOtherMaterialChecked(false);
          }}>
          <View style={mainStyles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={mainStyles.modalContent}>
                <Text style={mainStyles.modalTitle}>Add Material</Text>
                <TextInput
                  style={mainStyles.modalTextArea}
                  placeholder="Add Material"
                  placeholderTextColor="#888"
                  value={addCargoName}
                  multiline={true}
                  onChangeText={text => {
                    setAddCargoName(text);
                    setCargoError(false);
                  }}
                />
                {cargoError ? (
                  <Text style={{color: 'red', alignItems: 'flex-end'}}>
                    Plese Enter the valid Cargo name
                  </Text>
                ) : null}
                <View style={mainStyles.modalButtonContainer}>
                  <TouchableOpacity
                    onPress={addNewCargo}
                    style={[
                      mainStyles.button,
                      loading
                        ? mainStyles.disabledButton
                        : mainStyles.buttonSubmit,
                    ]}>
                    <Text style={mainStyles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setAddMaterialModalVisible(false);
                      setAddOtherMaterialChecked(false);
                    }}
                    style={[
                      mainStyles.button,
                      loading
                        ? mainStyles.disabledButton
                        : mainStyles.buttonCancel,
                    ]}>
                    <Text style={mainStyles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default AddLoad;

const MultiSelectStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '5%',
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 10,
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    marginVertical: 2,
    // borderColor:'black',
    // borderWidth:1,
    paddingHorizontal: '5%',
    paddingTop: 5,
    paddingBottom: 20,
  },
  buttonText: {
    color: 'blue',
    fontSize: 18,
    textAlign: 'center',
  },
});
