import { Alert, Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

// Notification Permission
export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permissions granted.');
      } else {
        console.log('Notification permissions denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  } else if (Platform.OS === 'ios') {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Authorization status:', authStatus);
      } else {
        console.log('Notification permissions denied.');
      }
    } catch (err) {
      console.warn('Notification permission request failed:', err);
    }
  }
};


// Location Permission
export const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to function properly.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return result === RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Camera Permission
export const requestCameraPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera for taking photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      return result === RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

// Microphone Permission
export const requestMicrophonePermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message:
            'This app needs access to your microphone for recording audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);
      return result === RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error requesting microphone permission:', error);
    return false;
  }
};

// Storage Permission
export const requestStoragePermission = async () => {
  console.log('Requesting storage permission...');
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return (
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    } else if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      return result === RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error requesting storage permission:', error);
    return false;
  }
};




// Show Alert for Permissions Denied
export const showPermissionAlert = (title, message) => {
  Alert.alert(
    title,
    message,
    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
    { cancelable: false },
  );
};
