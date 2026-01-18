import { Dimensions, ImageBackground, View, StyleSheet } from 'react-native';
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
import React, { useEffect, useState } from 'react';

const ShowImage = ({ navigation, route }) => {
  let deviceHeight = Dimensions.get('window').height;
  let deviceWidth = Dimensions.get('window').width;
  useEffect(() => {
    return () => { };
  }, []);

  return (
    <View>
      <ImageBackground
        source={{ uri: route.params?.url }}
        style={{ height: deviceHeight, width: deviceWidth }}
      />
    </View>
  );
};
const styles = StyleSheet.create({});
export default ShowImage;
