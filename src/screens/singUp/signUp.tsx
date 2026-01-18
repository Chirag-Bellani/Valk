import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import signUpStyles from '../../assets/styles/signUp';
import mainStyles from '../../assets/styles/main';
import {showMessage} from 'react-native-flash-message';
import {RadioButton} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {EndPoint} from '../../services';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from '../../context/authContext';
import {saveAuthToken} from '../../services/apiUtility';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GooglePlacesSearch from '../../components/googlePlaceSearch';

const SignupScreen = ({navigation, route}) => {
  const {userDetail} = route.params;
  const {setUserInfo, setUserToken} = useContext(AuthContext);
  const [mobile_no, setMobile_No] = useState(userDetail.mobile_no);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState(2);
  const [userLocation, setUserLocation] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentLat, setCurrentLat] = useState('');
  const [currentLong, setCurrentLong] = useState('');

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errors = {};

    if (!name) errors.name = '* Name is required';
    // if (!mobile_no) errors.mobile_no = '* Mobile number is required';
    // else if (!/^\d{10}$/.test(mobile_no))
    //   errors.mobile_no = '* Mobile number must be 10 digits';
    if (!email) errors.email = '* Email is required';
    else if (!emailRegex.test(email))
      errors.email = '* Please enter a valid email address';
    if (!companyName) errors.companyName = '* Company Name is required';
    if (!role) errors.role = '* Please select a role';
    if (!currentLocation)
      errors.currentLocation = '* Please enter your location';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFrom = (data, details) => {
    setCurrentLocation(data?.description);
    setCurrentLat(details?.geometry?.location?.lat);
    setCurrentLong(details?.geometry?.location?.lng);
    setValidationErrors(prev => ({...prev, currentLocation: ''}));
  };

  const registerUser = async () => {
    if (!validateForm()) {
      return;
    }
    let formData = new FormData();
    formData.append('mobile_no', mobile_no);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('role', role);
    formData.append('company_name', companyName);
    formData.append('user_location', currentLocation);
    formData.append('latitude', currentLat);
    formData.append('longitude', currentLong);
    console.log('formData', formData);
  
    try {
      const response = await fetch(`${EndPoint}register-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        body: formData,
      });
      const json = await response.json();
      if (json && json.success) {
        setUserInfo(json.data.user);
        setUserToken(json.data.api_token);
        AsyncStorage.setItem('userInfo', JSON.stringify(json.data.user));
        await saveAuthToken(json.data.api_token);
        // navigation.navigate('LoginScreen', { message: json.message });
      } else {
        showMessage({
          message: json.message || 'Unexpected response format',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: error.message,
        type: 'danger',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={[signUpStyles.outerContainer]}>
        <ScrollView
          contentContainerStyle={signUpStyles.container}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          <Text style={[mainStyles.title, {fontWeight: 'bold'}]}>
            Update Account
          </Text>
          <Text style={[mainStyles.discription, {opacity: 0.7}]}>
            Please fill up the details
          </Text>

          {/* company name */}
          <View style={signUpStyles.inputWrapper}>
            <View style={signUpStyles.inputContainer}>
              <Icon name="office-building" size={20} color="#fff" />
              <TextInput
                placeholder="Company Name"
                placeholderTextColor="#aaa"
                style={signUpStyles.input}
                value={companyName}
                onChangeText={text => {
                  setCompanyName(text);
                  setValidationErrors(prev => ({...prev, companyName: ''})); // Clear error on input
                }}
              />
            </View>
            {validationErrors.companyName && (
              <Text style={signUpStyles.errorText}>
                {validationErrors.companyName}
              </Text>
            )}
          </View>

          {/* name field */}
          <View style={signUpStyles.inputWrapper}>
            <View style={signUpStyles.inputContainer}>
              <Icon name="account" size={20} color="#fff" />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                style={signUpStyles.input}
                value={name}
                onChangeText={text => {
                  setName(text);
                  setValidationErrors(prev => ({...prev, name: ''})); // Clear error on input
                }}
              />
            </View>
            {validationErrors.name && (
              <Text style={signUpStyles.errorText}>
                {validationErrors.name}
              </Text>
            )}
          </View>

          {/* mobile number input */}
          <View style={signUpStyles.inputWrapper}>
            <View style={signUpStyles.inputContainer}>
              <Icon name="phone" size={20} color="#fff" />
              <TextInput
                placeholder="Phone"
                placeholderTextColor="#aaa"
                style={signUpStyles.input}
                value={mobile_no}
                editable={false}
                onChangeText={text => {
                  setMobile_No(text);
                  // setValidationErrors((prev) => ({ ...prev, mobile_no: "" })); // Clear error on input
                }}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* {validationErrors.mobile_no && (
            <Text style={signUpStyles.errorText}>
              {validationErrors.mobile_no}
            </Text>
          )} */}
          </View>

          {/* email input */}
          <View style={signUpStyles.inputWrapper}>
            <View style={signUpStyles.inputContainer}>
              <Icon name="email" size={20} color="#fff" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                style={signUpStyles.input}
                value={email}
                onChangeText={text => {
                  const lowerCaseText = text.toLowerCase(); // Convert to lowercase
                  setEmail(lowerCaseText);
                  setValidationErrors(prev => ({...prev, email: ''})); // Clear error on input
                }}
                autoCapitalize="none"
              />
            </View>
            {validationErrors.email && (
              <Text style={signUpStyles.errorText}>
                {validationErrors.email}
              </Text>
            )}
          </View>
          <View style={signUpStyles.locationInputWrapper}>
            <View style={[signUpStyles.locationInputContainer]}>
              <Icon name="map-marker-radius" size={20} color="#fff" />
              <GooglePlacesSearch
                onPlaceSelected={handleFrom}
                placeHolder={'Select Location'}
                placeholderTextColor="#aaa"
                customStyles={{
                  textInputContainer: {
                    width: '100%',
                    paddingHorizontal: 5,
                  },
                  textInput: {
                    color: '#fff',
                    backgroundColor: 'transparent',
                  },
                  listView: {
                    position: 'absolute',
                    top: 50, // Give space below the input
                    backgroundColor: '#fff',
                    borderRadius: 7,
                    shadowColor: '#000',
                    marginTop: 10,
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                    elevation: 10,
                    zIndex: 9999,
                  },
                  row: {
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  },
                  poweredContainer: {
                    display: 'none',
                  },
                }}
              />
            </View>
            {validationErrors.currentLocation && (
              <Text style={signUpStyles.errorText}>
                {validationErrors.currentLocation}
              </Text>
            )}
          </View>

          {/* role select */}
          <View style={signUpStyles.inputWrapper}>
            <View style={[signUpStyles.inputContainer]}>
              <View style={signUpStyles.radioContainer}>
                <Text style={signUpStyles.label}>Register As:</Text>
                <View style={signUpStyles.radioOption}>
                  <RadioButton
                    value={2}
                    status={role === 2 ? 'checked' : 'unchecked'}
                    onPress={() => setRole(2)}
                  />
                  <Text style={signUpStyles.radioLabel}>Transporter</Text>
                </View>
                <View style={signUpStyles.radioOption}>
                  <RadioButton
                    value={3}
                    status={role === 3 ? 'checked' : 'unchecked'}
                    onPress={() => setRole(3)}
                  />
                  <Text style={signUpStyles.radioLabel}>Shipper</Text>
                </View>
                <View style={signUpStyles.radioOption}>
                  <RadioButton
                    value={4}
                    status={role === 4 ? 'checked' : 'unchecked'}
                    onPress={() => setRole(4)}
                  />
                  <Text style={signUpStyles.radioLabel}>Commission agent</Text>
                </View>
              </View>
            </View>
            {validationErrors.role && (
              <Text style={signUpStyles.errorText}>
                {validationErrors.role}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              mainStyles.button,
              {
                width: '100%',
                backgroundColor: '#6b8cc9',
                paddingVertical: 10,
                marginBottom: 5,
              },
            ]}
            onPress={registerUser}>
            <Text style={mainStyles.buttonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
