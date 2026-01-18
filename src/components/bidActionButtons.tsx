import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
const BidActionButton = ({ buttonType, onPress }) => {
  let backgroundColor, icon, label;

  switch (buttonType) {
    case 'negotiate':
      backgroundColor = '#2E73F2';
      icon = <Text style={{ color: 'white' }}>Negotiate</Text>;
      break;
    case 'accept':
      backgroundColor = 'green';
      icon = (
        <Text style={{ color: 'white' }}>
          <AntDesign name="checkcircle" size={13} color={'white'} /> Accept
        </Text>
      );
      break;
    case 'reject':
      backgroundColor = 'red';
      icon = (
        <Text style={{ color: 'white' }}>
          <Entypo name="circle-with-cross" size={13} color={'white'} /> Reject
        </Text>
      );
      break;
    default:
      backgroundColor = '#2E73F2';
      icon = <Text style={{ color: 'white' }}>Negotiate</Text>;
      break;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor,
        padding: 7,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginLeft: 10,
      }}
      onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
};

export default BidActionButton;
