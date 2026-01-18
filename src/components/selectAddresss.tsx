import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {scale, verticalScale} from 'react-native-size-matters';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {requestLocationPermission} from '../utils';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';

const SelectAddress = ({navigation, route}) => {
  // const userData = route.params.userData
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentLocationState, setCurrentLocationState] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');

  async function handleCheckPressed() {
    if (Platform.OS === 'android') {
      const enableResult = await promptForEnableLocationIfNeeded();
      return enableResult;
    }
  }

  const handlePlaceSelected = (data, details) => {
    if (data && data.description) {
      setCurrentLocation(data.description); // Set current location
      // In SelectAddress.tsx
      const latitude = details.geometry.location.lat;
      const longitude = details.geometry.location.lng;
      const seletedAddress = data.description;
      navigation.navigate('ConfirmLocation', {
        latitude,
        longitude,
        seletedAddress,
      });
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        currentLocation: '', // Clear the error for currentLocation
      }));

      let state = '';
      if (data.terms && data.terms.length > 1) {
        const stateTerm = data.terms.find((term, index) => {
          return index === data.terms.length - 2;
        });

        if (stateTerm) {
          state = stateTerm.value;
          setCurrentLocationState(state); // Set the state name
        }
      }
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        currentLocation: 'Please select a current location', // Set the error if no data
      }));
    }
  };

  // const handlePlaceSelected = (data, details) => {
  //     console.log('handlePlaceSelected:', data, details);
  //     // ...
  // }
  const fetchCurrentLocation = async () => {
    setIsLoading(true);

    // Check for location permission
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setIsLoading(false);
      Alert.alert('Permission Denied', 'Location access is required!');
      return;
    }

    try {
      // Fetch the current location
      const locationData = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000,
      });

      const {latitude, longitude} = locationData;

      // Use Geocoder to get the address
      Geocoder.init('AIzaSyBuUVyHOxiZyUIvBIvsZg6O_ZiedhxW0FA'); // Replace with your API key
      const geoData = await Geocoder.from(latitude, longitude);

      if (geoData.results.length > 0) {
        const address = geoData.results[0].formatted_address;
        setLocation(address); // Update state with the address
        navigation.navigate('ConfirmLocation', {
          latitude,
          longitude,
          seletedAddress: address,
        });
      } else {
        Alert.alert('Error', 'Could not fetch the address. Try again.');
      }
    } catch (error) {
      // Handle location-related errors and prompt the user
      if (
        error.code === 'CANCELLED' ||
        error.code === 'UNAUTHORIZED' ||
        error.code === 'TIMEOUT' ||
        error.code === 'UNAVAILABLE'
      ) {
        const enabled = await promptForEnableLocationIfNeeded();

        if (enabled === 'enabled') {
          console.log('Location services enabled. Retrying...');
          // Retry fetching location
          fetchCurrentLocation();
          return; // Exit the current execution to prevent multiple calls
        } else {
          Alert.alert('Error', 'Please enable location services to continue.');
          setIsLoading(false);
          return;
        }
      }

      // Handle other unknown errors
      // Alert.alert('Error', `Something went wrong: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: '10%',
        paddingHorizontal: '20%',
        // height: 100, // Same height as listView items
        width: '100%', // Match listView width
      }}>
      <Text>No results found</Text>
    </View>
  );

  const renderLoader = () => (
    <ActivityIndicator
      color="blue"
      size={40}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: '10%',
        paddingHorizontal: '20%',

        width: '100%', // Match listView width
      }}
    />
  );

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          marginTop: '5%',
          backgroundColor: '#f4f4f4',
        }}>
        <GooglePlacesAutocomplete
          placeholder="Select the location"
          onPress={(data, details = null) => {
            setLocation(data.description);
            handlePlaceSelected(data, details);
            const hasError = false;
          }}
          fetchDetails={true}
          listEmptyComponent={renderEmptyComponent} // Display when no results found
          listLoaderComponent={renderLoader}
          currentLocation={false}
          enablePoweredByContainer={false}
          query={{
            key: 'AIzaSyBuUVyHOxiZyUIvBIvsZg6O_ZiedhxW0FA', // Replace with your API key
            language: 'en',
            components: 'country:in',
          }}
          textInputProps={{
            value: location, // Bind the state to the input value
            onChangeText: text => {
              setLocation(text); // Update the state as user types
            }, // Update the state as user types
            placeholderTextColor: '#C0C0C0',
          }}
          styles={defaultStyles}
          scrollEnabled={true}
          keyboardShouldPersistTaps="always"
          debounce={200} // Delay requests for smoother UI
          renderLeftButton={() => (
            <View style={{justifyContent: 'center', marginRight: scale(10)}}>
              <FontAwesome6Icon
                name={'location-dot'}
                size={21}
                color={'green'}
              />
            </View>
          )}
        />
      </View>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '70%',
            backgroundColor: '#f4f4f4',
          }}>
          <ActivityIndicator size="large" size={50} color="blue" />
        </View>
      ) : (
        <TouchableOpacity
          style={defaultStyles.selectButton}
          onPress={fetchCurrentLocation}>
          <FontAwesome6Icon
            name={'location-crosshairs'}
            size={21}
            color={'blue'}
          />
          <Text style={defaultStyles.selectButtonText}>
            Select Current Location
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SelectAddress;

const defaultStyles = StyleSheet.create({
  textInputContainer: {
    width: '98%',
    height: 45,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    color: '#000000',
    fontSize: 14.3,
    paddingVertical: 5,
    paddingLeft: -1,
  },
  listView: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    height: '100%',
  },
  row: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    height: 44,
    flexDirection: 'row',
  },
  description: {
    fontSize: 14,
    color: '#000',
  },
  selectButton: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderTopWidth: 1,
  },
  selectButtonText: {
    marginLeft: 10,
    color: 'blue',
    fontSize: 16,
    fontWeight: '600',
  },
});
