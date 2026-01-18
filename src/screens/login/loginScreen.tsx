import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  LogBox,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import loginStyles from '../../assets/styles/login';
import mainStyles from '../../assets/styles/main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {AuthContext} from '../../context/authContext';
import {apiPost} from '../../services/apiUtility';
import {navigate} from '../../navigation/navigationService';

const LoginScreen = ({navigation, route}) => {
  const {loginError, userToken} = useContext(AuthContext);
  const [mobileNo, setMobileNo] = useState('');
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.message) {
      showMessage({
        message: 'Success',
        description: route.params.message,
        type: 'success',
      });
    }
  }, [route.params?.message]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      let formData = new FormData();

      formData.append('mobile_no', mobileNo);
      const response = await apiPost('send-otp-authenticate-user', formData);
      if (response.success == true) {
        await AsyncStorage.setItem('otp', response.data.verify_otp.toString());
        navigation.navigate('OtpView', {
          mobileNo: mobileNo,
          actualOtp: response.data.verify_otp.toString(),
        });
      } else if (response.success === false) {
        showMessage({
          message: response.message,
          type: 'danger',
        });
      }
    } catch (error) {
      console.log('___________error________', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMobileValid(mobileNo.length === 10);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [mobileNo]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={[loginStyles.outerContainer]}>
        <Text style={mainStyles.title}>Welcome To Valk</Text>
        <View style={loginStyles.logoContainer}>
          <LinearGradient
            colors={['#FFDEE9', '#B5FFFC']}
            style={loginStyles.logoBackground}>
            <Image
              source={require('../../assets/images/valk-logo.png')}
              style={loginStyles.logo}
            />
          </LinearGradient>
        </View>
        <View style={loginStyles.innerContainer}>
          <Text style={mainStyles.discription}>Login With Mobile Number</Text>
          <Text style={mainStyles.discription}>
            Enter Your Mobile Number We Will Send you OTP To Verify
          </Text>
          <View style={loginStyles.inputContainer}>
            <Icon
              name="mobile"
              size={20}
              color="#fff"
              style={loginStyles.icon}
            />
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              style={loginStyles.input}
              value={mobileNo}
              onChangeText={setMobileNo}
              keyboardType="numeric"
              maxLength={10}
            />
            {loginError ? (
              <Text style={{color: 'red', marginTop: 10}}>{loginError}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={[
              mainStyles.button,
              {
                marginTop: 20,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor:
                  isMobileValid && !isLoading ? '#6b8cc9' : 'lightgrey',
                opacity: isMobileValid && !isLoading ? 1 : 0.5,
              },
            ]}
            onPress={handleLogin}
            disabled={!isMobileValid || isLoading}>
            <Text style={[mainStyles.buttonText]}>Get OTP</Text>
          </TouchableOpacity>
          <Text style={mainStyles.tncText}>
            By Clicking, I Accept The{' '}
            <Text
              onPress={() => navigate('TermsAndConditions')}
              style={{
                color: '#FFFFFF',
                textDecorationLine: 'underline',
                fontSize: 12,
              }}>
              Terms & conditions
            </Text>{' '}
            and{' '}
            <Text
              onPress={() => navigate('PrivacyPolicy')}
              style={{
                color: '#FFFFFF',
                textDecorationLine: 'underline',
                fontSize: 12,
              }}>
              Privacy Policy
            </Text>{' '}
          </Text>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
