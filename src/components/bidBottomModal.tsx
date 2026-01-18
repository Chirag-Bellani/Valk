import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import loadCardStyles from '../assets/styles/loadCard';
import mainStyles from '../assets/styles/main';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';

const BidBottomModal = ({
  isModalVisible,
  toggleModal,
  rate,
  setRate,
  isRateFixed,
  toggleRateFixed,
  toggleAnim,
  remarks,
  setRemarks,
  handleCancel,
  postLoadId,
  bidID,
  bidData,
  requestType,
  status,
  bidDetailType,
  onNegotiate,
  addFirstBid
}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [validateAmount, setValidateAmount] = useState(false);
  const [isTandCSelected, setIsTandCSelected] = useState(false)
  const [amountErrorMessage, setAmountErrorMessage] = useState('')

  const handleSubmit = async () => {
    const parsedRate = parseFloat(rate);

    if (!rate || rate.toString().trim() === '') {
      setAmountErrorMessage('Enter a valid amount');
      setValidateAmount(true);
      setLoading(false);
      return;
    }

    if (isNaN(parsedRate) || parsedRate < 1) {
      setAmountErrorMessage('Minimum valid amount is 1');
      setValidateAmount(true);
      setLoading(false);
      return;
    }

    // Valid input
    setAmountErrorMessage('');
    setValidateAmount(false);

    if (!isTandCSelected) {
      setLoading(false);
      return;
    }

    if (requestType === 'addBid') {
      addBid();
    } else {
      negotiateBid(status);
    }
  };

  const addBid = async () => {
    const firstBidData = { bidID, postLoadId, rate, remarks }
    setLoading(false);
    toggleModal();
    addFirstBid(firstBidData);
    setAmountErrorMessage('')
  };

  const negotiateBid = async status => {
    const negotiateData = { bidID, postLoadId, rate, remarks, status };
    setLoading(false);
    toggleModal();
    setRate('')
    setRemarks('')
    onNegotiate(negotiateData);
  };

  const handleTAndCCheckbox = newValue => {
    setLoading(false);
    setIsTandCSelected(newValue);
  };


  return (
    <Modal
      isVisible={isModalVisible}
      onRequestClose={toggleModal}
      animationType="slide"
      transparent={true}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Bid Details</Text>
        {bidDetailType === 'Load Card' && (
          <View style={styles.bidDetailContainer}>
            <View style={styles.headerContainer}>
              <View>
                <Image
                  source={require('../assets/images/cargo-containers.png')}
                  style={styles.loadImage}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.locationText}>
                  {bidData?.from_location} --- {bidData?.to_location}
                </Text>
              </View>
            </View>

            {/* // bid details card content */}

            <View style={loadCardStyles.cardContent}>
              <View style={loadCardStyles.leftContent}>
                <View style={loadCardStyles.detailRow}>
                  <Image
                    source={require('../assets/images/box.png')}
                    style={loadCardStyles.icon}
                  />
                  <Text style={loadCardStyles.detailText}>
                    {bidData?.get_cargo?.cargo}
                  </Text>
                </View>
                <View style={loadCardStyles.detailRow}>
                  <Image
                    source={require('../assets/images/box-truck.png')}
                    style={loadCardStyles.icon}
                  />

                  <Text style={loadCardStyles.detailText}>



                    {bidData?.qty}{bidData?.unit}
                    {' '}

                    {bidData?.get_vehicle_category?.vehicle_category}
                  </Text>
                </View>
                <View style={loadCardStyles.detailRow}>
                  <Image
                    source={require('../assets/images/debit-card.png')}
                    style={loadCardStyles.icon}
                  />
                  <Text style={loadCardStyles.detailText}>
                    {bidData?.payment_type}
                  </Text>
                </View>
              </View>
              <View style={loadCardStyles.rightContainer}>
                <View style={loadCardStyles.rateContainer}>
                  <Text style={loadCardStyles.rateText}>Expected Rate</Text>
                </View>
                <View>
                  <Text style={loadCardStyles.amountText}>
                    ₹{bidData?.expected_price}
                  </Text>
                  <Text style={loadCardStyles.totalFreightText}>
                    Total Freight
                  </Text>
                </View>
              </View>
            </View>

          </View>
        )}
        {/*  Add Amount Form Field */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Enter your rate <Text>*</Text></Text>
          <View style={styles.rateInputContainer}>
            <TextInput
              style={styles.rateInput}
              value={rate}
              placeholder="Amount"
              onChangeText={text => {
                setRate(text);
                setValidateAmount(false);
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleRateFixed}>
              <View
                style={[
                  styles.toggleContainer,
                  { backgroundColor: isRateFixed ? 'blue' : 'lightgrey' },
                ]}>
                <Animated.View
                  style={[
                    styles.toggleCircle,
                    {
                      transform: [
                        {
                          translateX: toggleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 20],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
              <Text style={styles.toggleLabel}>
                {isRateFixed ? 'Fixed' : 'Fix'}
              </Text>
            </TouchableOpacity>
          </View>
          {validateAmount && (
            <Text style={styles.errorText}>{amountErrorMessage}</Text> // Error message
          )}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Detention Remarks (Other Charges)</Text>
          <TextInput
            style={[styles.textInput, { textAlignVertical: 'top' }]}
            numberOfLines={6}
            value={remarks}
            onChangeText={setRemarks}
            multiline
          />
        </View>
        <View style={mainStyles.bottomMargin}>
          <View style={mainStyles.checkboxContainer}>
            <CheckBox
              value={isTandCSelected}
              onValueChange={handleTAndCCheckbox}
              style={mainStyles.checkbox}
              tintColors={{ true: '#203afa' }}
            />
            <Text style={mainStyles.label}>
              I agree to the{' '}
              <Text
                style={mainStyles.linkText}
                onPress={() => navigation.navigate('TermsAndConditions')}
              >
                Terms and Conditions
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              if (isTandCSelected) {
                setLoading(true);
                handleSubmit();
              }
            }}
            disabled={loading}
            style={[styles.submitButton, !isTandCSelected && styles.disabledButton]}>
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

export default BidBottomModal;
