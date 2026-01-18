import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropdownComponent from '../../components/dropdownComponent';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';

const AttachLorryModal = ({isVisible, onClose, bidDetails, onLorryAttach}) => {
  const [selectedLorryId, setSelectedLorryId] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverMobileNo, setDriverMobileNo] = useState('');
  const [selectedLorryIdError, setSelectedLorryIdError] = useState(false);
  const [driverNameError, setDriverNameError] = useState(false);
  const [driverMobileNoError, setDriverMobileNoError] = useState(false);
  const [lorryListData, setlorryListData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchLorryList = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    let formData = new FormData();
    formData.append('user_id', JSON.parse(userInfo).id);

    try {
      const response = await apiPost(
        API_ENDPOINTS.LORRY.GET_VERIFIED_LORRY_LIST,
        formData,
      );
      if (response.success) {
        setlorryListData(response.data);
      } else {
        setlorryListData([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const validateInput = () => {
    let isValid = true;
    setSelectedLorryIdError(false);
    setDriverNameError(false);
    setDriverMobileNoError(false);

    if (selectedLorryId === '') {
      setSelectedLorryIdError(true);
      isValid = false;
    }
    if (driverName === '') {
      setDriverNameError(true);
      isValid = false;
    }
    if (driverMobileNo.length < 10) {
      setDriverMobileNoError(true);
      isValid = false;
    }
    return isValid;
  };

  const AttachLorryDetails = async () => {
    setLoading(true);
    if (!validateInput()) {
      setLoading(false);
      return;
    }
    const attachLorryData = {
      vehicle_id: selectedLorryId,
      bid_id: bidDetails.id,
      driver_name: driverName,
      driver_mobile_no: driverMobileNo,
      bid_status: 'Lorry Attached',
    };
    onClose();
    setLoading(false);
    onLorryAttach(attachLorryData);
  };

  useEffect(() => {
    fetchLorryList();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Attach Lorry</Text>
          <Text style={[styles.label, {marginBottom: -14}]}>
            Vehicle No<Text style={{color: 'red'}}>*</Text>
          </Text>
          <DropdownComponent
            // label="Vehicle No"
            data={lorryListData}
            value={selectedLorryId}
            onChange={item => {
              setSelectedLorryId(item.id);
            }}
            // error={dropdownError}
            style={styles}
            labelField="vehicle_no"
            valueField="id"
            placeholder="Select Vehicle No"
            searchPlaceholder="Search..."
          />
          {selectedLorryIdError ? (
            <Text style={styles.errorLable}>Select Valid Vehicle No</Text>
          ) : null}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>
              Driver Name<Text style={{color: 'red'}}>*</Text>
            </Text>
            <TextInput
              label="Driver Name"
              style={styles.input}
              onChangeText={text => setDriverName(text)}
              value={driverName}
              placeholder="Enter Driver Name"
              keyboardType="default"
            />
            {driverNameError ? (
              <Text style={styles.errorLable}>Enter Valid Driver Name</Text>
            ) : null}
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>
              Driver Mobile No<Text style={{color: 'red'}}>*</Text>
            </Text>
            <TextInput
              label="Driver Mobile No"
              style={styles.input}
              onChangeText={text => setDriverMobileNo(text)}
              value={driverMobileNo}
              placeholder="Enter Driver Mobile No"
              keyboardType="numeric"
              maxLength={10}
            />
            {driverMobileNoError ? (
              <Text style={styles.errorLable}>
                Enter Valid Driver Mobile No
              </Text>
            ) : null}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                AttachLorryDetails();
              }}
              disabled={loading}
              style={[
                styles.button,
                styles.buttonColorBlue,
                loading && styles.disabledButton,
              ]}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.buttonColorRed]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  formView: {
    marginBottom: 5,
  },

  dropdown: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#c0c0c0',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  itemTextStyle: {
    color: '#333',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },

  inputWrapper: {
    marginVertical: '1.5%',
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
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#7D7D7D',
  },
  bottomMargin: {
    marginBottom: 10,
  },
  errorLable: {
    color: 'red',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 7,
    borderRadius: 5,
    marginTop: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonColorRed: {backgroundColor: 'red', borderRadius: 10},
  buttonColorBlue: {backgroundColor: '#203afa', borderRadius: 10},
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#C0C0C0', // Set your desired color for the disabled state
    opacity: 0.7, // Adjust the opacity to indicate it's disabled
  },
});

export default AttachLorryModal;
