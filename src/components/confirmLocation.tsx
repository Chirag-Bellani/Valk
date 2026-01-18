import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const ConfirmLocation = ({route, navigation}) => {
  // const userData = route.params.userData
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: route.params.latitude,
          longitude: route.params.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker
          coordinate={{
            latitude: route.params.latitude,
            longitude: route.params.longitude,
          }}
          title={route.params?.seletedAddress}
        />
      </MapView>
      <View
        style={{
          flex: 0.3,
          backgroundColor: '#fff',
          borderColor: '#000',
          borderWidth: 1,
          borderRadius: 10,
          padding: 20,
        }}>
        <Text style={styles.text}>Selected Location:</Text>
        <Text style={[styles.discription]}>{route.params?.seletedAddress}</Text>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() =>
            navigation.navigate('Profile', {
              type: 'confirmLocation',
              location: route.params,
            })
          }>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  descriptionContainer: {
    flex: 0.3,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#000',
    flexShrink: 1,
    paddingTop: 20,
  },
  discription: {
    fontSize: 16,
    color: '#000',
    flexShrink: 1,
    paddingTop: 5,
  },
  submitButton: {
    backgroundColor: '#0032e8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
