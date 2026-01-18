import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TransporterTopHeaderButtons from '../transporter/transporterTopHeaderButtons';
import ShipperTopHeaderButtons from '../shipper/shipperTopHeaderButtons';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import KycModal from '../../components/kycModal';

const HomeTopHeader = ({loginusername, role, loginuserData}) => {
  const navigation = useNavigation();

  // const openWhatsApp = async () => {
  //   const phoneNumber = '9825134269';
  //   const message = `Hi, My Register Mobile No on Valk is ${loginuserData?.mainDetail?.mobile_no} i want to talk with the support agent regarding the query.`;
  //   const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
  //     message,
  //   )}`;
  //   const fallbackUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
  //     message,
  //   )}`;

  //   try {
  //     const supported = await Linking.canOpenURL(fallbackUrl);
  //     if (supported) {
  //       await Linking.openURL(url);
  //     } else {
  //       // Try fallback to wa.me
  //       await Linking.openURL(fallbackUrl);
  //     }
  //   } catch (err) {
  //     Alert.alert(
  //       'Error',
  //       'Could not open WhatsApp. Please make sure it is installed.',
  //     );
  //   }
  // };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <View style={styles.headerUserInfo}>
          {role === 2 ? (
            <Image
              source={require('../../assets/images/truck2.png')}
              style={styles.headerImage}
            />
          ) : (
            <Image
              source={require('../../assets/images/boxes.png')}
              style={[
                styles.headerImage,
                {
                  width: 40,
                  height: 40,
                },
              ]}
            />
          )}
          <View style={styles.headerUserText}>
            <Text style={styles.greetingText}>Hello..</Text>
            <Text style={styles.usernameText}>{loginusername}</Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.notificationIconContainer}
            onPress={() => navigation.navigate('HelpAndSupport')}
            // onPress={openWhatsApp}
          >
            <MaterialIcons name="support-agent" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationIconContainer}
            onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.headerTitle}>
        <Text style={styles.headerTitleText}>
          {/* {"Become world's \nTranspoter"} */}
          {' Vyapar vahi '}
        </Text>
        <Text style={styles.headerTitleText}>{' Soch nai '}</Text>
        <Text style={styles.identityVerifiedText}>
          Identity Verified{' '}
          <MaterialCommunityIcons name="check-decagram" size={18} />
        </Text>
      </View>
      <View style={styles.headerButtons}>
        {role == '3' || role == '4' ? (
          <ShipperTopHeaderButtons />
        ) : (
          <TransporterTopHeaderButtons />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#203afa',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 50,
    height: 50,
  },
  headerUserText: {
    marginLeft: 10,
  },
  greetingText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '400',
  },
  usernameText: {
    color: 'white',
    fontSize: 19,
    fontWeight: '500',
  },
  notificationIconContainer: {
    // backgroundColor: 'rgba(255, 255, 255, 0.3)',
    // backgroundColor: '#0032e8',
    borderRadius: 15,
    padding: 5,
  },
  headerTitle: {
    marginTop: 10,
    marginLeft: 10,
  },
  headerTitleText: {
    color: 'white',
    fontSize: 34,
    fontWeight: '700',
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  identityVerifiedText: {
    fontSize: 15,
    color: 'white',
    marginTop: 5,
    fontWeight: '300',
  },
  headerButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default HomeTopHeader;
