import {
  Platform,
  View,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';

const VehicleCurrentLocation = ({navigation, route}) => {
  const [LocationFound, setLocationFound] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [location, setLocation] = useState('');

  const getCurrentLocation = async () => {
    setLoading(true);
    let formData = new FormData();
    if (route.params?.type === 'MyLorry') {
      formData.append('vehicle_no', route.params?.vehicle_no);
      formData.append('type', route.params?.type);
    } else {
      formData.append('bid_id', route.params?.bid_id);
    }
    try {
      const response = await apiPost(
        API_ENDPOINTS.VEHICLE.GET_VEHICLE_CURRENT_LOCATION,
        formData,
      );
      if (response.success) {
        setLat(parseFloat(response.data?.latitude));
        setLong(parseFloat(response.data?.longitude));
        setLocation(response.data?.location);
      } else {
        console.log('Failed to fetch data');
      }
    } catch (error) {
      setLocationFound(true);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    return () => {};
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {LocationFound ? (
        <View style={styles.locationErrorContainer}>
          <Text style={styles.locationErrorText}>Locaction Not Found...</Text>
        </View>
      ) : (
        <>
          <MapView
            provider={
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            mapType="satellite"
            style={styles.map}
            region={{
              latitude: lat,
              longitude: long,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            <Marker
              coordinate={{latitude: lat, longitude: long}}
              title={location}>
              <Image
                source={require('../../assets/images/truck_location_pin.png')}
                style={styles.markerImage}
                resizeMode="contain"
              />
            </Marker>
          </MapView>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerImage: {
    width: 35,
    height: 35,
  },
  locationErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationErrorText: {
    fontSize: 20,
    color: '#000',
  },
});
export default VehicleCurrentLocation;
