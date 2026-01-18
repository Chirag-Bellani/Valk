import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
const DriverDetail = ({ driverName, driverMobileNo, vehicleNo, onPress, bidStatus }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Attached Lorry Detail</Text>
        <Text style={styles.detailText}>Driver Name: {driverName}</Text>
        <Text style={styles.detailText}>Driver Mobile No: {driverMobileNo}</Text>
        <Text style={styles.detailText}>Vehicle No: {vehicleNo}</Text>
      </View>
      {(
        bidStatus === 'Completed'
      ) && (
          <TouchableOpacity
            style={{
              // marginHorizontal: 5,
              padding: 12,
              backgroundColor: '#0032e8', // Change background when disabled
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 10,
              zIndex: -1,

            }}
            onPress={onPress}>
            <Feather name="download" size={18} color='#FFFFFF' />
          </TouchableOpacity>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'dashed',
    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    marginLeft: 10,
    fontWeight: '700',
    color: '#000',
  },
  detailText: {
    color: '#000',
    marginLeft: 10,
  },
});

export default DriverDetail;
