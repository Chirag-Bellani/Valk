import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { apiPost } from '../../../services/apiUtility';
import { API_ENDPOINTS } from '../../../constants/apiEndPoints';

const GSTVerification = ({ navigation }) => {
  const [GSTNumber, setGSTNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateGSTNumber = async () => {
    if (GSTNumber.length === 15) {
      setError(''); // Clear error if valid
      await handleSave();
    } else {
      setError('* GST number must be 15 characters long'); // Set error if invalid
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      ;

      if (userInfo) {
        const formData = new FormData();
        formData.append('gst_no', GSTNumber);

        const response = await apiPost(API_ENDPOINTS.USER.UPDATE_LOGIN_USER_GST_DETAIL, formData)



        if (response.success) {
          showMessage({
            message: 'GST Number Updated Successfully',
            type: 'success',
          });
          navigation.navigate('Profile');
        } else {
          showMessage({
            message: 'Failed to Update GST Number',
            type: 'danger',
          });
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage({
        message: 'An error occurred while updating profile',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={GSTVerificationStyles.container}>
      <View style={GSTVerificationStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={GSTVerificationStyles.backBtn}>
          <AntDesign name="arrowleft" color="black" size={22} />
        </TouchableOpacity>
        <Text style={GSTVerificationStyles.headerText}>GST Verification</Text>
        <TouchableOpacity onPress={() => { }} style={GSTVerificationStyles.helpBtn}>
          <AntDesign name="questioncircleo" color="black" size={22} />
        </TouchableOpacity>
      </View>

      <View style={GSTVerificationStyles.inputWrapper}>
        <Text style={GSTVerificationStyles.label}>Enter GST Number</Text>
        <TextInput
          value={GSTNumber}
          onChangeText={(text) => {
            setGSTNumber(text);
            if (text.length === 15) {
              setError(''); // Clear the error when length is 15
            }
          }}
          style={[
            GSTVerificationStyles.input,
            error ? GSTVerificationStyles.inputError : {},
          ]}
          placeholder="Enter GST Number"
          keyboardType="default"
          color="#000000"
          maxLength={15}
          autoCapitalize="characters"
          placeholderTextColor="#C0C0C0"
        />
        {error ? <Text style={GSTVerificationStyles.errorText}>{error}</Text> : null}
      </View>

      <TouchableOpacity
        style={[
          GSTVerificationStyles.saveButton,
          loading ? GSTVerificationStyles.disabledButton : {},
        ]}
        onPress={validateGSTNumber}
        disabled={loading}>
        <Text style={GSTVerificationStyles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GSTVerification;

const GSTVerificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backBtn: {
    marginTop: 7,
  },
  helpBtn: {
    marginTop: 7,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  inputWrapper: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: '2%',
    paddingHorizontal: 15,
    borderWidth: 0.5,
    borderColor: '#000',
    color: '#333',
    elevation: 3,
    paddingVertical: 8,
    marginBottom: '3%',
  },
  inputError: {
    borderColor: 'red',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#7D7D7D',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#203afa',
    alignItems: 'center',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '90%',
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#C0C0C0',
    opacity: 0.7,
  },
});
