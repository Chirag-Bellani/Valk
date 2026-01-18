import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {showMessage} from 'react-native-flash-message';
import TextInputComponent from '../../../components/textInputComponent';
import {apiPost} from '../../../services/apiUtility';
import {API_ENDPOINTS} from '../../../constants/apiEndPoints';
import partyFormStyles from '../../../assets/styles/patyForm';

const AddParty = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [panNo, setPanNo] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [partyLogo, setPartyLogo] = useState('');
  const [errors, setErrors] = useState({});

  const handleImagePicker = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else {
        const source = {uri: response.assets[0].uri};
        setPartyLogo(source);
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!companyName) newErrors.companyName = 'Company Name is required';
    if (!address) newErrors.address = 'Address is required';
    if (!panNo || panNo.length !== 10)
      newErrors.panNo = 'Valid PAN number is required (10 characters)';
    if (!gstNo || gstNo.length !== 15)
      newErrors.gstNo = 'Valid GST number is required (15 characters)';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const addShipperParty = async () => {
    let formData = new FormData();
    formData.append('company_name', companyName);
    formData.append('address', address);
    formData.append('pan_no', panNo);
    formData.append('gst_no', gstNo);
    if (partyLogo) {
      formData.append('company_logo', {
        uri: partyLogo.uri,
        name: 'partyLogo.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      const response = await apiPost(
        API_ENDPOINTS.SHIPPER_PARTY.ADD_SHIPPER_PARTY,
        formData,
      );
      if (response.success) {
        navigation.navigate('PartyList');
        showMessage({
          message: response.message,
          description: '',
          type: 'success',
        });
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
  const handleSubmit = () => {
    if (validateForm()) {
      addShipperParty();
    } else {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={partyFormStyles.safeAreaContainer}>
      <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={20}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 90}}
          showsHorizontalScrollIndicator={false}>
          <View style={partyFormStyles.formContainer}>
            {/* Image Picker */}
            <View style={partyFormStyles.imagePickerContainer}>
              <Pressable
                style={partyFormStyles.addImageIcon}
                onPress={handleImagePicker}>
                <FontAwesome name="camera" size={16} color={'white'} />
              </Pressable>
              {partyLogo ? (
                <View style={partyFormStyles.imageWrapper}>
                  <Image
                    source={partyLogo}
                    style={partyFormStyles.profileImage}
                  />
                </View>
              ) : (
                <Image
                  source={require('../../../assets/images/default_party_logo.webp')}
                  style={partyFormStyles.profileImage}
                />
              )}
            </View>

            {/* Company Name Input */}
            <View style={partyFormStyles.inputWrapper}>
              <TextInputComponent
                label="Company Name"
                value={companyName}
                onChangeText={text => {
                  setCompanyName(text);
                  setErrors(prev => ({...prev, companyName: ''}));
                }}
                style={partyFormStyles}
                placeholder="Enter Company Name"
                keyboardType="default"
                color="#000000"
                placeholderTextColor="#C0C0C0"
                error={!!errors.companyName}
                errorMessage={errors.companyName}
              />
            </View>

            {/* Address Input */}
            <View style={partyFormStyles.inputWrapper}>
              <TextInputComponent
                label="Address"
                value={address}
                onChangeText={text => {
                  setAddress(text);
                  setErrors(prev => ({...prev, address: ''}));
                }}
                style={partyFormStyles}
                placeholder="Enter Address"
                keyboardType="default"
                color="#000000"
                multiline
                placeholderTextColor="#C0C0C0"
                error={!!errors.address}
                errorMessage={errors.address}
              />
            </View>

            {/* PAN Number Input */}
            <View style={partyFormStyles.inputWrapper}>
              <TextInputComponent
                label="Pan Number"
                value={panNo}
                onChangeText={text => {
                  setPanNo(text);
                  setErrors(prev => ({...prev, panNo: ''}));
                }}
                style={partyFormStyles}
                placeholder="Enter PAN Number"
                keyboardType="default"
                color="#000000"
                maxLength={10}
                autoCapitalize="characters"
                placeholderTextColor="#C0C0C0"
                error={!!errors.panNo}
                errorMessage={errors.panNo}
              />
            </View>

            {/* GST Input */}
            <View style={partyFormStyles.inputWrapper}>
              <TextInputComponent
                label="GST"
                value={gstNo}
                onChangeText={text => {
                  setGstNo(text);
                  setErrors(prev => ({...prev, gstNo: ''}));
                }}
                style={partyFormStyles}
                placeholder="Enter GST Number"
                keyboardType="default"
                color="#000000"
                maxLength={15}
                autoCapitalize="characters"
                placeholderTextColor="#C0C0C0"
                error={!!errors.gstNo}
                errorMessage={errors.gstNo}
              />
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={() => {
                setLoading(true);
                handleSubmit();
              }}
              disabled={loading}
              style={[
                partyFormStyles.submitButton,
                loading && partyFormStyles.disabledButton,
              ]}>
              <Text style={partyFormStyles.submitText}>Submit</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddParty;
