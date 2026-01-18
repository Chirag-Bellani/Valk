import React from 'react';
import {View, StyleSheet} from 'react-native';
import VehicleDetailsComponent from './vehicleDetailsComponent';
import DriverDetails from './driverDetail';

const Card = ({vehicleType, vehicleDetails, driverDetails}) => {
  return (
    <View style={styles.card}>
      <VehicleDetailsComponent
        vehicleType={vehicleType}
        vehicleDetails={vehicleDetails}
      />
      <DriverDetails driverDetails={driverDetails} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
});

export default Card;
