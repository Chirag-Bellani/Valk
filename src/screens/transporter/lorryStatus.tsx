import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const VerificationScreen = ({ navigation, route, type }) => {
  const { lorryDetail } = route.params;
  // Helper function to determine the status message and styles
  const getStatusBoxDetails = () => {
    switch (lorryDetail?.is_verified) {
      case 'Pending':
        return {
          message: 'Verification In-progress',
          style: styles.statusBox,
          textStyle: styles.statusText,
          infoText: 'Your RC will be verified in 3 to 4 days.',
        };
      case 'Failed':
        return {
          message: 'RC Verification Failed',
          style: styles.statusBoxFailed,
          textStyle: styles.statusTextFailed,
          infoText: 'Please upload valid RC documents for verification.',
        };
      case 'Verified':
        return {
          message: 'Vehicle is Verified',
          style: styles.statusBoxVerified,
          textStyle: styles.statusTextVerified,
          infoText: null, // No info text for Verified status
        };
      default:
        return {
          message: 'Unknown Status',
          style: styles.statusBox,
          textStyle: styles.statusText,
        };
    }
  };

  const { message, style, textStyle, infoText } = getStatusBoxDetails();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior of going back
      e.preventDefault();

      // Navigate explicitly to 'My Lorry'
      navigation.navigate('My Lorry');
      // if (route.params?.type !== 'MyLorry') {
      //   navigation.navigate('Find Lorry');
      // } else {
      // }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>
          <MaterialCommunityIcons name="truck" size={22} color="black" />{' '}
          {lorryDetail?.vehicle_no}
        </Text>
      </View>

      {/* Vehicle Details */}
      <View style={styles.vehicleDetails}>
        <Ionicons name="bus" size={35} color="black" />
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleText}>
            {lorryDetail?.get_vehicle_size?.vehicle_size}{' '}
            {lorryDetail?.get_vehicle_category?.vehicle_category} •{' '}
            {lorryDetail?.vehicle_capacity} Tonnes •
          </Text>
          <Text style={styles.vehicleText}>
            {lorryDetail?.get_vehicle_type?.vehicle_type}
          </Text>
        </View>
      </View>

      {/* Verification Status */}
      <View style={style}>
        <Text style={textStyle}>{message}</Text>
      </View>
      {infoText && <Text style={styles.infoText}>{infoText}</Text>}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.supportButton}
          onPress={() => navigation.navigate('HelpAndSupport')}
        >
          <MaterialIcons name="support-agent" size={24} color="grey" />
          <Text style={styles.buttonText}>Support</Text>
        </Pressable>
        <View style={styles.pendingButton}>
          <Text style={styles.buttonText}>
            {lorryDetail?.is_verified === 'Pending'
              ? 'Verification Pending'
              : lorryDetail?.is_verified === 'Failed'
                ? 'RC Rejected'
                : 'Verified'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 90,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black'
  },
  vehicleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center',
  },
  vehicleInfo: {
    marginLeft: 10,
  },
  vehicleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusBox: {
    backgroundColor: '#FFF4E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusBoxFailed: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusBoxVerified: {
    backgroundColor: '#C6F7BE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusTextFailed: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusTextVerified: {
    color: 'green',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    padding: 12,
    borderRadius: 8,
    width: '45%',
  },
  pendingButton: {
    backgroundColor: '#EDEDED',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
});

export default VerificationScreen;
