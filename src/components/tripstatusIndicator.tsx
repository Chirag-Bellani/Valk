import React from 'react';
import {View, Text, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const TripProgress = ({status, bidDetail, role, navigation}) => {
  const stepsTransporter = [
    {
      label: 'Accept',
      discription: `${bidDetail?.post_load_data?.advance_per}% Payment Received Done.`,
    },
    {
      label: 'Lorry_Attached',
      driverName: `Driver Name: ${bidDetail?.driver_name}`,
    },
    {
      label: 'Loaded_Request',
      discription: 'Lorry Received At The PickUp Point.',
    },
    {
      label: 'Loaded',
      discription: `${
        100 - bidDetail?.post_load_data?.advance_per
      }% Payment Received Done.`,
    },
    {
      label: 'Completed_Request',
      discription: 'Load Delivererd At Drop Point?',
    },
    {
      label: 'Completed',
      discription: 'Trip Completed',
    },
  ];

  const stepsShipper = [
    {
      label: 'Accept',
      discription: `${bidDetail?.post_load_data?.advance_per}% Payment Received Done.`,
    },
    {
      label: 'Lorry_Attached',
      discription: 'Lorry is attached',
    },
    {
      label: 'Loaded_Request',
      discription: 'Lorry Received At The PickUp Point.',
    },
    {
      label: 'Loaded',
      discription: `${
        100 - bidDetail?.post_load_data?.advance_per
      }% Payment Received Done.`,
    },
    {
      label: 'Completed_Request',
      discription: 'Load Delivererd At Drop Point?',
    },
    {
      label: 'Completed',
      discription: 'Trip Completed',
    },
  ];

  const statusAliasMap = {
    Reached_Request: 'Lorry_Attached',
  };

  const normalizedStatus = statusAliasMap[status] || status;

  const steps = role === 2 ? stepsTransporter : stepsShipper;
  const currentIndex = steps.findIndex(
    step => step?.label === normalizedStatus,
  );

  const getDisplayName = step => {
    switch (step?.label) {
      case 'Accept':
        return role === 2 ? 'Bid Transporter' : 'Accept Bid';
      case 'Lorry_Attached':
        return 'Lorry Attached';
      case 'Loaded':
        return role === 2 ? 'Full Payment Received' : 'Load Loaded';
      case 'Completed_Request':
        return 'Delivered?';
      case 'Completed':
        return 'Completed';
      case 'Bid_Sent':
        return 'Bid Sent';
      case 'Reached':
        return 'Lorry Received';
      case 'Hold_Loaded':
        return 'Loaded';
      default:
        return step?.label.replace(/_/g, ' ');
    }
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;

        return (
          <View key={index} style={styles.stepContainer}>
            {/* Step Circle and Line Container */}
            <View style={styles.circleLineContainer}>
              {/* Vertical Line */}
              {index !== 0 && (
                <View
                  style={[
                    styles.lineAbove,
                    isCompleted && styles.lineCompleted,
                    index === steps.length - 1 && {height: verticalScale(10)},
                  ]}
                />
              )}

              {/* Step Circle */}
              <View style={[styles.circle, isCompleted && styles.completed]}>
                {isCompleted && (
                  <MaterialIcons name="check" size={12} color="#fff" />
                )}
              </View>

              {/* Vertical Line Below */}
              {index !== steps.length - 1 && (
                <View
                  style={[
                    styles.lineBelow,
                    isCompleted && index < currentIndex && styles.lineCompleted,
                  ]}
                />
              )}
            </View>

            {/* Step Content */}
            <View style={styles.stepContent}>
              <Text style={[styles.label, isCompleted && styles.completedText]}>
                {getDisplayName(step)}
              </Text>
              {step?.label === 'Lorry_Attached' ? (
                <View style={styles.driverInfo}>
                  <View>
                    <Text
                      style={[
                        styles.description,
                        isCompleted && styles.completedText,
                      ]}>
                      Driver Name: {bidDetail?.driver_name}
                    </Text>
                    <Text
                      style={[
                        styles.description,
                        isCompleted && styles.completedText,
                      ]}
                      onPress={() =>
                        Linking.openURL(`tel:${bidDetail?.driver_mobile_no}`)
                      }>
                      Driver Mobile No: {bidDetail?.driver_mobile_no}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={[
                          styles.description,
                          isCompleted && styles.completedText,
                        ]}>
                        Vehicle No: {bidDetail?.get_vehicle_detail?.vehicle_no}{' '}
                      </Text>
                    </View>
                  </View>
                  {bidDetail?.get_vehicle_detail?.vehicle_no !== undefined &&
                    bidDetail?.bid_status !== 'Completed' && (
                      <TouchableOpacity
                        style={styles.trackIconContainer}
                        onPress={() =>
                          navigation.navigate('VehicleCurrentLocation', {
                            bid_id: bidDetail?.id,
                          })
                        }>
                        <FontAwesome5
                          name="map-marker-alt"
                          size={12}
                          color="#fff"
                        />
                        <Text style={{paddingLeft: 5, color: '#fff'}}>
                          Track Now
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
              ) : (
                <Text
                  style={[
                    styles.description,
                    isCompleted && styles.completedText,
                  ]}>
                  {step?.discription}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: verticalScale(60),
  },
  circleLineContainer: {
    width: moderateScale(24),
    alignItems: 'center',
    height: '100%',
  },
  circle: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  completed: {
    backgroundColor: '#4CAF50',
  },
  lineAbove: {
    width: verticalScale(2),
    height: verticalScale(10),
    backgroundColor: '#ccc',
    position: 'absolute',
    top: 0,
  },
  lineBelow: {
    width: verticalScale(2),
    backgroundColor: '#ccc',
    flex: 1,
    // marginTop: moderateVerticalScale(4),
    minHeight: verticalScale(15),
  },
  lineCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepContent: {
    flex: 1,
    marginLeft: moderateScale(10),
    paddingBottom: moderateVerticalScale(20),
  },
  label: {
    fontSize: moderateScale(12),
    color: '#777',
    fontWeight: '500',
    marginBottom: moderateVerticalScale(4),
  },
  description: {
    fontSize: moderateScale(11),
    color: '#777',
    lineHeight: moderateVerticalScale(16),
  },
  driverInfo: {
    marginTop: moderateVerticalScale(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  completedText: {
    color: '#4CAF50',
  },
  trackIconContainer: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#3f51b5',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default TripProgress;
