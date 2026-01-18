import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import bidCardStyles from '../assets/styles/bidCard'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const PayButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={[
        bidCardStyles.actionButton,
        { backgroundColor: 'green', marginLeft: 10 },
      ]} onPress={onPress}>
      <Text style={[bidCardStyles.buttonText, { fontSize: 13 }]}>
        <FontAwesome name="rupee" size={14} color={'white'} />{' '}
        Pay
      </Text>
    </TouchableOpacity>
  )
}

export default PayButton
