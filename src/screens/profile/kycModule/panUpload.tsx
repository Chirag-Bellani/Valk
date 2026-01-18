import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ENDPOINTS} from '../../../constants/apiEndPoints';
import {apiPost} from '../../../services/apiUtility';
import ImageOptionModalComponent from '../../../components/imageOptionModalComponent';
import {CameraImagePicker, compressImage, DocumentPicker} from '../../../utils';
import {viewDocument} from '@react-native-documents/viewer';
import {getFileSize} from 'react-native-compressor';
import RNFS from 'react-native-fs';

const PANUpload = ({navigation}) => {
  const [panCardImg, setPANCardImg] = useState('');
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result !== RESULTS.GRANTED) {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log('Camera permission error: ', error);
    }
  };

  const handleDocumentPicker = () => {
    setOptionModalVisible(false);
    DocumentPicker(
      // Handle PDF file
      pdfUri => {
        setPANCardImg(pdfUri.uri);
        setFileType('pdf');
        setFileName(pdfUri.name);
      },
      // Handle image file
      imageUri => {
        setPANCardImg(imageUri.uri);
        setFileType('image');
        setFileName(imageUri.name);
      },
    );
  };

  const handleCameraImagePicker = () => {
    setOptionModalVisible(false);
    CameraImagePicker(
      // onCancel callback
      () => {
        console.log('Camera capture cancelled');
        setOptionModalVisible(false);
      },
      // onError callback
      error => {
        console.log('Error capturing image:', error);
        setOptionModalVisible(false);
      },
      // onSuccess callback
      asset => {
        setPANCardImg(asset.uri);
        setFileType('image');
        setOptionModalVisible(false);
      },
    );
  };

  const removeImage = () => {
    setPANCardImg('');
    setFileType('');
    setFileName('');
  };

  const handleImageCompression = async imageUri => {
    const compressedUri = await compressImage(imageUri, {
      targetSizeKB: 300, // Custom target size
      qualityStep: 0.02, // Reduce quality by 5% each iteration
    });

    return compressedUri;
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const compressedPanUri =
        fileType === 'image'
          ? await handleImageCompression(panCardImg)
          : panCardImg;

      let currentSize = await getFileSize(compressedPanUri);

      var photo = {
        uri: compressedPanUri,
        type: fileType === 'image' ? 'image/jpeg' : 'application/pdf', // Set the correct MIME type
        name: fileType === 'image' ? 'photo.jpg' : 'document.pdf', // Give an appropriate name
      };
      const formData = new FormData();

      // if (compressedPanUri) {
      formData.append('pan_image', photo);
      // formData.append('aadhaar_front_image', null);
      // formData.append('aadhaar_back_image', null);
      // }

      const response = await apiPost(
        API_ENDPOINTS.UPLOAD.UPLOAD_DOCUMENT,
        formData,
      );
      if (response.success) {
        setPANCardImg('');
        setIsLoading(false);
        showMessage({
          message: 'Image uploaded successfully',
          type: 'success',
        });
        // Navigate back and pass params to indicate step completion
        navigation.navigate('Profile', {
          step2Completed: true,
        });
      } else {
        setIsLoading(false);
        showMessage({
          message: 'Failed to upload image',
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage({
        message: 'Please try again',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Aadhaar&PANVerification')}
          style={styles.backBtn}>
          <AntDesign name="arrowleft" color="black" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerText}>PAN verification</Text>
      </View>
      <View style={styles.uploadSections}>
        <View style={styles.uploadContainer}>
          <Text style={styles.uploadText}>Upload Image of Your PAN Card</Text>
          <View style={styles.imageContainer}>
            {panCardImg ? (
              fileType === 'pdf' ? (
                <View style={styles.pdfContainer}>
                  <Image
                    source={require('../../../assets/images/file.png')}
                    style={styles.pdfImage}
                    blurRadius={4}
                  />
                  <Text>{fileName}</Text>
                  <TouchableOpacity
                    style={styles.viewPdfBtn}
                    onPress={() => viewDocument({uri: panCardImg})}>
                    <Text style={styles.viewPdfText}>View PDF</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Image source={{uri: panCardImg}} style={styles.image} />
              )
            ) : (
              <Image
                source={require('../../../assets/images/pan-card.webp')}
                style={styles.placeholderImage}
                blurRadius={4}
              />
            )}
          </View>
          {panCardImg ? (
            <TouchableOpacity style={styles.removeBtn} onPress={removeImage}>
              <AntDesign name="closecircle" color="red" size={20} />
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => setOptionModalVisible(true)}>
            <Text style={styles.uploadBtnText}>Upload Pan Image</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fixedBottom}>
        <TouchableOpacity
          style={[
            styles.continueBtn,
            (!panCardImg || isLoading) && styles.disabledBtn,
          ]}
          onPress={handleContinue}
          disabled={!panCardImg || isLoading}>
          <Text style={styles.continueBtnText}>
            {isLoading ? 'Please wait...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
      <ImageOptionModalComponent
        title="Upload Aadhaar Card"
        visible={optionModalVisible}
        onClose={() => setOptionModalVisible(false)}
        onCameraPress={handleCameraImagePicker}
        onGalleryPress={handleDocumentPicker}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 15,
  },
  backBtn: {
    marginTop: 10,
    marginLeft: 3,
  },
  headerText: {
    fontSize: 17,
    marginTop: 5,
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: 'black',
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
  pdfImage: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadSections: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    marginTop: 20,
  },
  uploadContainer: {
    marginVertical: 10,
  },
  uploadText: {
    color: 'black',
    fontSize: 15,
  },
  imageContainer: {
    marginTop: 15,
    borderColor: 'blue',
    height: 180,
    width: '97%',
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderImage: {
    width: 150,
    height: 100,
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
  uploadBtn: {
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'blue',
    borderWidth: 1.5,
    borderRadius: 5,
  },
  uploadBtnText: {
    color: 'blue',
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 50,
    alignItems: 'center',
  },
  continueBtn: {
    backgroundColor: 'blue',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    borderRadius: 10,
  },
  disabledBtn: {
    backgroundColor: '#C0C0C0',
  },
  continueBtnText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PANUpload;
