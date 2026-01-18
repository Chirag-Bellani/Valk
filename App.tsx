import React, {useEffect} from 'react';
import {
  StatusBar,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid,
  AppState,
} from 'react-native';
import {AuthProvider} from './src/context/authContext';
import AppNav from './src/navigation/appNav';
import FlashMessage from 'react-native-flash-message';
import VersionCheck from 'react-native-version-check';
import {setupNotificationListeners} from './src/screens/notification/notificationHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {
  requestCameraPermission,
  requestLocationPermission,
  requestNotificationPermission,
  requestStoragePermission,
} from './src/utils';

function App(): React.JSX.Element {
  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const latestVersion =
          Platform.OS === 'ios'
            ? await fetch(
                `https://itunes.apple.com/in/lookup?bundleId=com.jatayu.valk`,
              )
                .then(r => r.json())
                .then(res => {
                  return res?.results[0]?.version;
                })
            : await VersionCheck.getLatestVersion({
                provider: 'playStore',
                packageName: 'com.jatayu.valk',
                ignoreErrors: true,
              });

        let currentVersion = null;

        if (Platform.OS === 'android') {
          currentVersion = await VersionCheck.getCurrentVersion({
            provider: 'playStore',
            packageName: 'com.jatayu.valk',
            ignoreErrors: true,
          });
        } else if (Platform.OS === 'ios') {
          // Add a null check here for iOS
          currentVersion = VersionCheck.getCurrentVersion();
        }

        if (latestVersion > currentVersion && latestVersion !== undefined) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: async () => {
                  let url;
                  if (Platform.OS === 'ios') {
                    const appStoreUrl = await VersionCheck.getAppStoreUrl({
                      appID: 'com.jatayu.valk',
                    });
                    url = appStoreUrl;
                  } else {
                    const playStoreUrl = await VersionCheck.getPlayStoreUrl({
                      packageName: 'com.jatayu.valk',
                    });
                    url = playStoreUrl;
                  }
                  Linking.openURL(url);
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          // App is up-to-date; proceed with the app
        }
      } catch (error) {
        // Handle error while checking app version
        console.error('Error checking app version:', error);
      }
    };

    checkAppVersion();
  }, []);

  const getToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      await AsyncStorage.setItem('fcmToken', fcmToken);
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  };

  useEffect(() => {
    // Request permissions and setup listeners once
    const initializeNotifications = async () => {
      await requestNotificationPermission();
      await requestLocationPermission();
      await requestCameraPermission();
      await requestStoragePermission();

      setupNotificationListeners();
      getToken();
      notifee.setBadgeCount(0).then(() => console.log('Badge count removed'));
    };

    initializeNotifications();

    // App state listener
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'active') {
          notifee.cancelAllNotifications();
        }
      },
    );

    // Cleanup function
    return () => {
      appStateListener.remove();
    };
  }, []);

  // useEffect(() => {
  //   Linking.getInitialURL().then(url => {
  //     if (url) {
  //       console.log('App launched with URL:', url);
  //     }
  //   });

  //   const subscription = Linking.addEventListener('url', ({url}) => {
  //     console.log('App opened with URL:', url);
  //   });

  //   return () => subscription.remove();
  // }, []);

  return (
    <>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
      <FlashMessage duration={3000} position="top" />
    </>
  );
}

export default App;
