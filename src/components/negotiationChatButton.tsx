// NegotiationChatButton.js

import React from 'react';
import {TouchableOpacity, Image, StyleSheet, Text} from 'react-native';

const NegotiationChatButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={require('../assets/images/negotiation.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 7,
    // marginVertical: '2%',
    // width: '20%',
    paddingHorizontal: 20,
    // borderColor: 'orange',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 2,
    marginRight: 5,
  },
  icon: {
    width: 26,
    height: 26,
  },
});

export default NegotiationChatButton;
