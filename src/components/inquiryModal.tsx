import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {viewDocument} from '@react-native-documents/viewer';
import AntDesign from 'react-native-vector-icons/AntDesign';

const InquiryModal = ({
  isModalVisible,
  toggleModal,
  mobileNo,
  setMobileNo,
  material,
  setMaterial,
  billAmount,
  setBillAmount,
  uploadAdharFront,
  uploadAdharBack,
  uploadPan,
  uploadRc,
  quality,
  setQuality,
  handleCancel,
  type,
  handleSubmit,
  fileUriAdharFront,
  fileTypeAdharFront,
  fileUriAdharBack,
  fileTypeAdharBack,
  removeImageAdharFront,
  removeImageAdharBack,
  fileUriPan,
  fileTypePan,
  removeImagePan,
  fileUriRc,
  fileTypeRc,
  removeImageRc,
  fileNameAdharFront,
  fileNameAdharBack,
  fileNamePan,
  fileNameRc,
  disable,
  mobileError,
  uploadAdharFrontError,
  uploadAdharBackError,
  uploadPanError,
  uploadRcError,
  quelityError,
  materialError,
  billAmountError,
}) => {
  return (
    <Modal
      isVisible={isModalVisible}
      onRequestClose={toggleModal}
      animationType="slide"
      transparent={true}
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Inquiry Now</Text>
            {/*  Add Amount Form Field */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>
                Enter your Mobile No<Text style={{color: 'red'}}>*</Text>
              </Text>
              <View style={styles.rateInputContainer}>
                <TextInput
                  style={styles.rateInput}
                  value={mobileNo}
                  placeholder="Mobile No"
                  maxLength={10}
                  onChangeText={text => {
                    setMobileNo(text);
                  }}
                  keyboardType="numeric"
                />
              </View>
              {mobileError && (
                <Text style={{color: 'red'}}>
                  Please Enter Valid Mobile Number
                </Text>
              )}
            </View>
            {type === 'Insurance' && (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>
                    Material<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <View style={styles.rateInputContainer}>
                    <TextInput
                      style={[styles.rateInput]}
                      placeholder="Material"
                      value={material}
                      onChangeText={setMaterial}
                    />
                  </View>
                  {materialError && (
                    <Text style={{color: 'red'}}>Please Enter material</Text>
                  )}
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>
                    Bill Amount<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <View style={styles.rateInputContainer}>
                    <TextInput
                      style={[styles.rateInput]}
                      value={billAmount}
                      placeholder="Bill Amount"
                      onChangeText={setBillAmount}
                      keyboardType="numeric"
                    />
                  </View>
                  {billAmountError && (
                    <Text style={{color: 'red'}}>Please Enter Bill Amount</Text>
                  )}
                </View>
              </>
            )}
            {type === 'Fastag' && (
              <View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>
                    Upload Aadhaar Front<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <Pressable
                    onPress={uploadAdharFront}
                    style={styles.rateInputContainer}>
                    <TextInput
                      style={styles.rateInput}
                      value={''}
                      editable={false}
                      placeholder="Upload Adhar"
                    />
                  </Pressable>
                </View>
                {uploadAdharFrontError && (
                  <Text style={{color: 'red'}}>
                    Please Select Aadhaar Front Image
                  </Text>
                )}

                {fileUriAdharFront &&
                  (fileTypeAdharFront === 'pdf' ? (
                    <View style={styles.imageWithTimestamp}>
                      <View style={styles.pdfContainer}>
                        <Image
                          source={require('../assets/images/file.png')}
                          style={styles.pdfImage}
                          blurRadius={4}
                        />
                        <Text>{fileNameAdharFront}</Text>
                        <TouchableOpacity
                          style={styles.viewPdfBtn}
                          onPress={() =>
                            viewDocument({uri: fileUriAdharFront})
                          }>
                          <Text style={styles.viewPdfText}>View PDF</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.imageWithTimestamp}>
                      <Image
                        source={{uri: fileUriAdharFront}}
                        style={styles.image}
                      />
                    </View>
                  ))}

                {fileUriAdharFront && (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={removeImageAdharFront}>
                    <AntDesign name="closecircle" color="red" size={20} />
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.inputRow}>
                  <Text style={styles.label}>
                    Upload Aadhaar Back<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <Pressable
                    onPress={uploadAdharBack}
                    style={styles.rateInputContainer}>
                    <TextInput
                      style={styles.rateInput}
                      value={''}
                      editable={false}
                      placeholder="Upload Adhar"
                    />
                  </Pressable>
                </View>
                {uploadAdharBackError && (
                  <Text style={{color: 'red'}}>
                    Please select Aadhaar Back Image
                  </Text>
                )}

                {fileUriAdharBack &&
                  (fileTypeAdharBack === 'pdf' ? (
                    <View style={styles.imageWithTimestamp}>
                      <View style={styles.pdfContainer}>
                        <Image
                          source={require('../assets/images/file.png')}
                          style={styles.pdfImage}
                          blurRadius={4}
                        />
                        <Text>{fileNameAdharBack}</Text>
                        <TouchableOpacity
                          style={styles.viewPdfBtn}
                          onPress={() => viewDocument({uri: fileUriAdharBack})}>
                          <Text style={styles.viewPdfText}>View PDF</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.imageWithTimestamp}>
                      <Image
                        source={{uri: fileUriAdharBack}}
                        style={styles.image}
                      />
                    </View>
                  ))}

                {fileUriAdharBack && (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={removeImageAdharBack}>
                    <AntDesign name="closecircle" color="red" size={20} />
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.inputRow}>
                  <Text style={styles.label}>
                    Upload Pan<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <Pressable
                    onPress={uploadPan}
                    style={styles.rateInputContainer}>
                    <TextInput
                      style={styles.rateInput}
                      value={''}
                      editable={false}
                      placeholder="Upload Pan"
                    />
                  </Pressable>
                </View>
                {uploadPanError && (
                  <Text style={{color: 'red'}}>Please Select Pan Image</Text>
                )}

                {fileUriPan &&
                  (fileTypePan === 'pdf' ? (
                    <View style={styles.imageWithTimestamp}>
                      <View style={styles.pdfContainer}>
                        <Image
                          source={require('../assets/images/file.png')}
                          style={styles.pdfImage}
                          blurRadius={4}
                        />
                        <Text>{fileNamePan}</Text>
                        <TouchableOpacity
                          style={styles.viewPdfBtn}
                          onPress={() => viewDocument({uri: fileUriPan})}>
                          <Text style={styles.viewPdfText}>View PDF</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.imageWithTimestamp}>
                      <Image source={{uri: fileUriPan}} style={styles.image} />
                    </View>
                  ))}

                {fileUriPan && (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={removeImagePan}>
                    <AntDesign name="closecircle" color="red" size={20} />
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.inputRow}>
                  <Text style={styles.label}>
                    Upload Rc<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <Pressable
                    onPress={uploadRc}
                    style={styles.rateInputContainer}>
                    <TextInput
                      style={styles.rateInput}
                      value={''}
                      editable={false}
                      placeholder="Upload Rc"
                    />
                  </Pressable>
                </View>
                {uploadRcError && (
                  <Text style={{color: 'red'}}>Please Select Rc Image</Text>
                )}

                {fileUriRc &&
                  (fileTypeRc === 'pdf' ? (
                    <View style={styles.imageWithTimestamp}>
                      <View style={styles.pdfContainer}>
                        <Image
                          source={require('../assets/images/file.png')}
                          style={styles.pdfImage}
                          blurRadius={4}
                        />
                        <Text>{fileNameRc}</Text>
                        <TouchableOpacity
                          style={styles.viewPdfBtn}
                          onPress={() => viewDocument({uri: fileUriRc})}>
                          <Text style={styles.viewPdfText}>View PDF</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.imageWithTimestamp}>
                      <Image source={{uri: fileUriRc}} style={styles.image} />
                    </View>
                  ))}

                {fileUriRc && (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={removeImageRc}>
                    <AntDesign name="closecircle" color="red" size={20} />
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {type === 'GPS' && (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>
                    Quality<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <View style={styles.rateInputContainer}>
                    <TextInput
                      style={[styles.rateInput]}
                      value={quality}
                      placeholder="Quality"
                      onChangeText={setQuality}
                    />
                  </View>
                </View>
                {quelityError && (
                  <Text style={{color: 'red'}}>Please Enter Quality</Text>
                )}
              </>
            )}
            <View style={styles.buttonRow}>
              {disable ? (
                <Text style={[styles.label, {textAlign: 'center'}]}>
                  Waiting For Sending Inquiry...
                </Text>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={disable}
                    style={[styles.submitButton]}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%', // Set maximum height to 80% of screen
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
  scrollContent: {
    paddingBottom: 20, // Add some padding at the bottom
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
  submitButtonDisable: {
    backgroundColor: '#C0C0C0',
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
  imageWithTimestamp: {
    marginBottom: 10,
    width: '100%',
    minHeight: 100, // Minimum height to show something
    maxHeight: 200, // Maximum height to prevent taking too much space
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'blue',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensure the image stays within bounds
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
  pdfImage: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPdfBtn: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPdfText: {
    color: 'blue',
    fontSize: 16,
  },
  pdfContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Adjust to place below the image container
    alignSelf: 'flex-end', // Align to the right
  },
  removeBtnText: {
    color: 'red',
    marginLeft: 5,
  },
});

export default InquiryModal;
