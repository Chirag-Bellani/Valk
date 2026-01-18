import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, View, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthContext} from '../context/authContext';
import AppStack from './appStack';
import AuthStack from './authStack';
import {createNavigationContainerRef} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import HomeSkeleton from '../skeleton/latestPostLoadCardSkeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiPost} from '../services/apiUtility';
import {API_ENDPOINTS} from '../constants/apiEndPoints';

export const navigationRef = createNavigationContainerRef();

function AppNav() {
  const Stack = createNativeStackNavigator();
  const {isLoading, userToken, setIsLoading} = useContext(AuthContext);

  const [initialRoute, setInitialRoute] = useState('BottomNav'); // Default to null
  const [notificationHandled, setNotificationHandled] = useState(0);

  const [loadDetail, setLoadDetail] = useState([]);

  const getLoadDetailByLoadId = async post_load_id => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('type', 'Single');
    formData.append('post_load_id', post_load_id);
    try {
      const response = await apiPost(
        API_ENDPOINTS.LOAD.GET_LOAD_DETAIL,
        formData,
      );
      if (response.success) {
        return response.data;
      } else {
        console.log('Failed to fetch data');
        setLoadDetail([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      // 1. Check if app was opened via notification (killed state)
      const remoteMessage = await messaging().getInitialNotification();

      if (remoteMessage) {
        const {screen, post_load_id} = remoteMessage.data || {};
        console.log('Notification handled in kill state!', remoteMessage);

        switch (screen) {
          case 'LoadDetails':
            setInitialRoute({
              name: 'LoadDetails',
              params: post_load_id,
            });
            break;
          default:
            setInitialRoute('NotificationScreen');
        }

        setNotificationHandled(true);
      } else {
        // 2. No notification => Check for deep link
        const url = await Linking.getInitialURL();
        if (url) {
          const match = url.match(/\/(\d+)$/);
          const postId = match ? match[1] : null;

          let userInfoString = await AsyncStorage.getItem('userInfo');
          const userInfo = JSON.parse(userInfoString); // Parse once
          const userId = userInfo.id; // Get ID
          const userRole = userInfo.role; // Get Role

          const getLoadDetail = await getLoadDetailByLoadId(postId);
          const post_by_user_id = getLoadDetail.get_load_post_by.id;
          const post_status = getLoadDetail?.post_status;

          if (
            ((userRole === 3 || userRole === 4) &&
              userId === post_by_user_id) || // ✅ If role 3/4 and owner
            (userRole === 2 && post_status === 'Pending')
          ) {
            setInitialRoute({
              name: 'LoadDetails',
              params: postId,
            });
          } else {
            setInitialRoute('BottomNav');
          }
        } else {
          setInitialRoute('BottomNav');
        }
      }

      setIsLoading(false);
    };

    initializeApp();

    // 3. Handle notification tap when app is in the background
    const notificationListener = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          'Notification caused app to open from background state!',
          remoteMessage,
        );
        const {screen, post_load_id} = remoteMessage.data || {};

        switch (screen) {
          case 'LoadDetails':
            setInitialRoute({
              name: 'LoadDetails',
              params: post_load_id,
            });
            break;
          default:
            setInitialRoute('NotificationScreen');
        }

        setNotificationHandled(true);
      },
    );

    // 4. Handle deep link if app is resumed via a link
    const urlListener = Linking.addEventListener('url', async event => {
      if (!notificationHandled) {
        const match = event.url.match(/\/(\d+)$/);
        const postId = match ? match[1] : null;

        if (postId) {
          let userInfoString = await AsyncStorage.getItem('userInfo');
          const userInfo = JSON.parse(userInfoString); // Parse once
          const userId = userInfo.id;
          const userRole = userInfo.role;

          const getLoadDetail = await getLoadDetailByLoadId(postId);

          const post_by_user_id = getLoadDetail?.get_load_post_by?.id;
          const post_status = getLoadDetail?.post_status;

          if (
            ((userRole === 3 || userRole === 4) &&
              userId === post_by_user_id) ||
            (userRole === 2 && post_status === 'Pending')
          ) {
            setInitialRoute({
              name: 'LoadDetails',
              params: postId,
            });
          } else {
            setInitialRoute('BottomNav');
          }
        } else {
          setInitialRoute('BottomNav');
        }
      }
    });

    return () => {
      urlListener.remove();
      notificationListener();
    };
  }, []);

  const linking = {
    prefixes: ['valk://', 'https://valk.com'],
    config: {
      screens: {
        // BottomNav contains tabs (Home, Profile, etc.)
        BottomNav: {
          path: 'nav', // Optional: if you want a prefix like valk://nav/home
          screens: {
            Home: 'home',
            Profile: 'profile',
            LoadDetails: 'loaddetails/:post_load_id',
            // Other tabs...
          },
        },
        // LoadDetails is a standalone screen in AppStack
      },
    },
  };

  // useEffect(() => {
  //   const handleDeepLink = async url => {
  //     if (notificationHandled === 1) {
  //       return false; // ✅ Skip if already handled by notification
  //     }
  //     console.log('url', url);
  //     const match = url?.match(/\/(\d+)$/);
  //     const postId = match ? match[1] : null;
  //     console.log('url', url);
  //     console.log('match', postId);

  //     if (url) {
  //       setInitialRoute({
  //         name: 'LoadDetails',
  //         params: postId,
  //       });
  //     } else {
  //       setInitialRoute('BottomNav');
  //     }
  //   };

  //   // Handle cold start (app launched from URL)
  //   const getInitialUrl = async () => {
  //     const url = await Linking.getInitialURL();
  //     handleDeepLink(url);
  //   };

  //   // Handle warm start (app resumed from background via URL)
  //   const urlListener = Linking.addEventListener('url', event => {
  //     handleDeepLink(event.url);
  //   });

  //   getInitialUrl();

  //   return () => {
  //     urlListener.remove(); // Clean up the listener
  //   };
  // }, [notificationHandled]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      {userToken ? <AppStack initialRoute={initialRoute} /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  mainView: {
    marginTop: 50,
    alignItems: 'center',
  },
});

export default AppNav;
