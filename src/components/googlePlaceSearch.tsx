import React, {useEffect, useRef, useState} from 'react';
import {View, KeyboardAvoidingView, Platform, Text} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {ActivityIndicator} from 'react-native-paper';

const GooglePlacesSearch = ({
  onPlaceSelected,
  placeHolder,
  customStyles = {},
  hasError = false,
  textInputProps = {},
  onChangeText,
  placeholderTextColor = 'grey',
}) => {
  const [location, setLocation] = useState('');
  const [reLocation, setReLocation] = useState(textInputProps.value || '');
  const placesRef = useRef(null);
  const defaultStyles = {
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
      borderColor: hasError ? 'red' : '#ccc',
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
      maxHeight: 200,
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
  };

  // Loading component to show while fetching results
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

  // Component to show when no results are found
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{flex: 1}}>
      <View style={{}}>
        <GooglePlacesAutocomplete
          placeholder={placeHolder}
          onPress={(data, details = null) => {
            // onPress(data, details);
            setLocation(data.description);
            onPlaceSelected(data, details);
            hasError = false;
          }}
          fetchDetails={true}
          listEmptyComponent={renderEmptyComponent} // Display when no results found
          listLoaderComponent={renderLoader}
          enablePoweredByContainer={false}
          query={{
            key: 'AIzaSyBuUVyHOxiZyUIvBIvsZg6O_ZiedhxW0FA', // Replace with your API key
            language: 'en',
            components: 'country:in',
          }}
          textInputProps={{
            value: location || reLocation,
            onChangeText: text => {
              setLocation(text);
              if (onChangeText) {
                onChangeText(text); // <-- pass the text to parent
              }
            },
            placeholderTextColor,
          }}
          styles={{
            ...defaultStyles,
            ...customStyles, // Merge custom styles if passed
          }}
          scrollEnabled={true}
          keyboardShouldPersistTaps="always"
          debounce={200} // Delay requests for smoother UI
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default GooglePlacesSearch;
