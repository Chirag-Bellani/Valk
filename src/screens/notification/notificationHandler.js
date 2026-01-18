import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import {navigate} from '../../navigation/navigationService';
import {useScreenContext} from '../../services/screenProvider';

export const channelId = 'Valk';
export const channelName = 'Valk Services';

export const setupNotificationListeners = () => {
  // Foreground notifications
  messaging().onMessage(async remoteMessage => {
    //console.log('Foreground notification:', remoteMessage);
    if (Platform.OS === 'android') {
      await displayNotification(remoteMessage);
    }
  });
  notifee.onForegroundEvent(async ({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED: {
        // User dismissed the notification
        // Decrement the count by 1
        await notifee.decrementBadgeCount();
        break;
      }
      case EventType.PRESS: {
        // User pressed the notification
        const screen = detail?.notification?.data?.screen; // Extract screen from notification data
        const post_load_id = detail?.notification?.data?.post_load_id;
        if (screen) {
          switch (screen) {
            case 'LoadDetails':
              navigate('LoadDetails', {post_load_id}); // Navigate to the LeaveList screen
              break;

            default:
              navigate('NotificationScreen');
          }
        } else {
          console.log('No screen specified in notification data');
        }
        break;
      }
      default:
        console.log('Unhandled notification event:', type);
        break;
    }
  });
};

const displayedMessageIds = new Set();

const displayNotification = async remoteMessage => {
  console.log('remoteMessage', remoteMessage);
  try {
    if (displayedMessageIds.has(remoteMessage.messageId)) {
      console.log('Duplicate notification, skipping:', remoteMessage.messageId);
      return;
    }
    displayedMessageIds.add(remoteMessage.messageId);

    await notifee.displayNotification({
      title: remoteMessage.data.title || remoteMessage.notification.title,
      body: remoteMessage.data.body || remoteMessage.notification.body,
      data: remoteMessage.data,
      android: {
        channelId: channelId,
        smallIcon: 'ic_notification',
        color: '#203afa',
        largeIcon: 'ic_notification_large',
        timestamp: Date.now(),
        showTimestamp: true,
        pressAction: {
          id: 'default',
        },
      },
    });
  } catch (err) {
    console.error('Error displaying notification:', err);
  }
};

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted:', authStatus);
  } else {
    console.log('Notification permissions not granted.');
  }
};

notifee.isChannelCreated(channelId).then(isCreated => {
  if (!isCreated) {
    notifee.createChannel({
      id: channelId,
      name: channelName,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound: 'default',
    });
  }
});
