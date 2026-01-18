import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const BankDetails = ({ bankData }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Bank Detail</Text>
        <Text style={styles.detailText}>Name: {bankData.bank_name}</Text>
        <Text style={styles.detailText}>IFSC Code: {bankData.bank_ifsc_code}</Text>
        <Text style={styles.detailText}>Account No: {bankData.ac_number}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'dashed',
    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    marginLeft: 10,
    fontWeight: '700',
    color: '#000',
  },
  detailText: {
    color: '#000',
    marginLeft: 10,
  },
});

export default BankDetails;
