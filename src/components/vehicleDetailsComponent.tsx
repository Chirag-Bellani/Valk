import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

// Import images
const trailerImage = require('../../assets/images/trailor.png');
const truckImage = require('../../assets/images/truck_1-42-tonn.png');
const hyvaImage = require('../../assets/images/hyva_truck.png');
const defaultImage = require('../../assets/images/tanker_truck.png');

const VehicleDetailsComponent = ({vehicleType, vehicleDetails}) => {
  const {location, licensePlate, weight, routes, isVerified} = vehicleDetails;

  return (
    <View style={styles.container}>
      <Image source={getVehicleImage(vehicleType)} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.vehicleType}>{vehicleType}</Text>
        <Text style={styles.licensePlate}>license Plate: {licensePlate}</Text>
        <Text style={styles.location}>{location}</Text>
        <View style={styles.infoRow}>
          <Feather name="truck" size={15} />
          <Text style={styles.infoText}>{weight} Tonnes</Text>
          <Feather name="git-merge" size={15} />
          <Text style={styles.infoText}>{routes} Routes</Text>
          <Feather name="check-circle" size={15} />
          {isVerified && <Text style={styles.verified}>RC Verified</Text>}
        </View>
      </View>
    </View>
  );
};

const getVehicleImage = vehicleType => {
  switch (vehicleType.toLowerCase()) {
    case 'trailer':
      return trailerImage;
    case 'truck':
      return truckImage;
    case 'hyva':
      return hyvaImage;
    default:
      return defaultImage;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
  details: {
    marginLeft: 10,
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  location: {
    color: 'gray',
  },
  licensePlate: {
    color: 'gray',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    marginRight: 10,
    color: 'gray',
  },
  verified: {
    color: 'green',
  },
});

export default VehicleDetailsComponent;
