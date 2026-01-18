import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import mainStyles from '../assets/styles/main';
import DropdownComponent from '../components/dropdownComponent';

const SelectBankAccountModal = ({
  isModalVisible,
  toggleModal,
  handleCancel,
  data,
  value,
  renderItem,
  bidDetails,
  onBankUpdate,
}) => {
  const [bankDetails, setBankDetails] = useState(true);

  const UpdateBankDetails = async () => {
    const updateBankData = {
      bid_id: bidDetails?.id,
      bank_id: bankDetails,
    };
    toggleModal();
    onBankUpdate(updateBankData);
  };

  return (
    <Modal
      isVisible={isModalVisible}
      onRequestClose={toggleModal}
      animationType="slide"
      transparent={true}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <DropdownComponent
          label="Select Bank Account"
          data={data}
          value={value}
          onChange={item => setBankDetails(item.id)}
          style={mainStyles}
          labelField="ac_number"
          valueField="id"
          placeholder="Select Bank Account"
          optionMenuPosition="top"
          searchPlaceholder="Search..."
          renderItem={renderItem}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={UpdateBankDetails}
            style={[styles.submitButton]}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginBottom: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  inputRow: {
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#203afa',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'medium',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'medium',
    textAlign: 'center',
  },
  rateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  rateInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: 'black',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  toggleContainer: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    padding: 2,
  },
  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 2,
  },
  toggleLabel: {
    marginLeft: 5,
    color: 'black',
  },
  disabledButton: {
    backgroundColor: '#C0C0C0', // Set your desired color for the disabled state
    opacity: 0.7, // Adjust the opacity to indicate it's disabled
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  bidDetailContainer: {
    width: '90%',
    // flex: 1,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: '5%',
    borderRadius: 10,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.7,
    borderBottomColor: 'lightgrey',
  },

  loadImage: {
    height: 50,
    width: 50,
    marginTop: 7,
  },
  textContainer: {
    marginTop: '3%',
    width: '80%',
  },
  locationText: {
    fontSize: 12,
    color: 'grey',
    fontWeight: '500',
  },
});

export default SelectBankAccountModal;
