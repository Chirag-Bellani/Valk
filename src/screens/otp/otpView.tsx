import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import otpStyles from '../../assets/styles/otpView';
import mainStyles from '../../assets/styles/main';
import {AuthContext} from '../../context/authContext';

const OtpView = ({navigation, route}) => {
  const {login, loginError} = useContext(AuthContext);
  const [otpArr, setOtpArr] = useState(['', '', '', '']);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120);
  const [showResend, setShowResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const otpInputs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setShowResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otpArr];
    newOtp[index] = value;
    const otpString = newOtp.join('');
    setOtpArr(newOtp);
    setOtp(otpString);
    if (value && index < otpArr.length - 1) {
      let nextIndex = index + 1;
      while (nextIndex < otpArr.length && newOtp[nextIndex] !== '') {
        nextIndex++;
      }
      if (nextIndex < otpArr.length) {
        otpInputs.current[nextIndex].focus();
      }
    }
  };

  const checkOtp = () => {
    setIsLoading(true);
    if (otp === route.params.actualOtp) {
      login(route.params.mobileNo, registerNewUser);
    } else {
      setErrorMessage('OTP does not match. Please try again!');
    }
    setIsLoading(false);
  };
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otpArr[index] === '' && index > 0) {
        const newOtp = [...otpArr];
        newOtp[index - 1] = '';
        setOtpArr(newOtp);
        const otpString = newOtp.join('');
        setOtp(otpString);
        otpInputs.current[index - 1].focus();
      } else if (otpArr[index] !== '') {
        const newOtp = [...otpArr];
        newOtp[index] = '';
        setOtpArr(newOtp);
        const otpString = newOtp.join('');
        setOtp(otpString);
      }
    }
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleResendOtp = () => {
    // Logic to resend OTP
    setTimer(120);
    setShowResend(false);
  };

  const registerNewUser = async userInfo => {
    navigation.navigate('SignupScreen', {userDetail: userInfo});
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={otpStyles.container}>
        <Image
          source={require('../../assets/images/otpImage.png')}
          style={otpStyles.logo}
        />
        <Text style={otpStyles.headerText}>Enter the Verification Code</Text>
        <Text style={otpStyles.subHeaderText}>
          Enter the 4 digit number that we sent to {route.params.mobileNo}.
        </Text>
        <View style={otpStyles.otpContainer}>
          {otpArr.map((value, index) => (
            <TextInput
              key={index}
              value={value}
              onChangeText={text => handleOtpChange(text, index)}
              style={otpStyles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              ref={ref => (otpInputs.current[index] = ref)}
              onKeyPress={e => handleKeyPress(e, index)}
            />
          ))}
        </View>
        {errorMessage ? (
          <Text style={otpStyles.errorText}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity
          onPress={checkOtp}
          style={[mainStyles.button, otpStyles.verifyButton]}>
          <Text style={mainStyles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
        {showResend ? (
          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={otpStyles.resendText}>
              Didn't Receive Anything? Resend Code
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={otpStyles.timerText}>
            Resend OTP in {formatTime(timer)} seconds
          </Text>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default OtpView;
