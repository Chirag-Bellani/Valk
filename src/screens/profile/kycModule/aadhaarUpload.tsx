import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {showMessage} from 'react-native-flash-message';
import {apiPost} from '../../../services/apiUtility';
import {API_ENDPOINTS} from '../../../constants/apiEndPoints';
import ImageOptionModalComponent from '../../../components/imageOptionModalComponent';
import {viewDocument} from '@react-native-documents/viewer';
import {CameraImagePicker, compressImage, DocumentPicker} from '../../../utils';

const AadhaarUpload = ({navigation}) => {
  const [aadhaarFrontImg, setAadhaarFrontImg] = useState('');
  const [aadhaarBackImg, setAadhaarBackImg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [imageType, setImageType] = useState('');
  const [fileTypeFront, setFileTypeFront] = useState('');
  const [fileTypeBack, setFileTypeBack] = useState('');
  const [fileNameFront, setFileNameFront] = useState('');
  const [fileNameBack, setFileNameBack] = useState('');

  const handleCameraImagePicker = (side: 'front' | 'back') => {
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
        if (side === 'front') {
          setAadhaarFrontImg(asset.uri);
        } else {
          setAadhaarBackImg(asset.uri);
        }
        setOptionModalVisible(false);
      },
    );
  };

  const handleDocumentPicker = (side: 'front' | 'back') => {
    setOptionModalVisible(false);
    DocumentPicker(
      // Handle PDF file
      pdfUri => {
        if (side === 'front') {
          setAadhaarFrontImg(pdfUri.uri);
          setFileTypeFront('pdf');
          setFileNameFront(pdfUri.name);
        } else {
          setAadhaarBackImg(pdfUri.uri);
          setFileTypeBack('pdf');
          setFileNameBack(pdfUri.name);
        }
      },
      // Handle image file
      imageUri => {
        if (side === 'front') {
          setAadhaarFrontImg(imageUri.uri);
          setFileTypeFront('image');
          setFileNameFront(imageUri.name);
        } else {
          setAadhaarBackImg(imageUri.uri);
          setFileTypeBack('image');
          setFileNameBack(imageUri.name);
        }
      },
    );
  };

  const removeFrontImage = () => {
    setAadhaarFrontImg('');
    setFileTypeFront('');
    setFileNameFront('');
  };

  const removeBackImage = () => {
    setAadhaarBackImg('');
    setFileTypeBack('');
    setFileNameBack('');
  };

  const handleImageCompression = async imageUri => {
    console.log('Compressing image...', imageUri);
    const compressedUri = await compressImage(imageUri, {
      targetSizeKB: 300, // Custom target size
      qualityStep: 0.02, // Reduce quality by 5% each iteration
    });

    console.log('Final compressed image URI:', compressedUri);
    return compressedUri;
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      // Check types and compress only if image
      const compressedFrontUri =
        fileTypeFront === 'image'
          ? await handleImageCompression(aadhaarFrontImg)
          : aadhaarFrontImg;

      const compressedBackUri =
        fileTypeBack === 'image'
          ? await handleImageCompression(aadhaarBackImg)
          : aadhaarBackImg;

      const formData = new FormData();

      if (compressedFrontUri) {
        formData.append('aadhaar_front_image', {
          uri: compressedFrontUri,
          name:
            fileTypeFront === 'image'
              ? 'aadhar-front-image.jpg'
              : 'aadhar-front-document.pdf',
          type: fileTypeFront === 'image' ? 'image/jpeg' : 'application/pdf',
        });
      }

      if (compressedBackUri) {
        formData.append('aadhaar_back_image', {
          uri: compressedBackUri,
          name:
            fileTypeBack === 'image'
              ? 'aadhar-back-image.jpg'
              : 'aadhar-back-document.pdf',
          type: fileTypeBack === 'image' ? 'image/jpeg' : 'application/pdf',
        });
      }

      const response = await apiPost(
        API_ENDPOINTS.UPLOAD.UPLOAD_DOCUMENT,
        formData,
      );

      if (response.success) {
        showMessage({
          message: 'Image uploaded successfully',
          type: 'success',
        });

        navigation.navigate('Aadhaar&PANVerification', {
          step1Completed: true,
        });
      } else {
        showMessage({
          message: 'Failed to upload image',
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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
        <Text style={styles.headerText}>Aadhaar verification</Text>
      </View>
      <View style={styles.uploadSections}>
        <View style={styles.uploadContainer}>
          <Text style={styles.uploadText}>
            Upload Front Side of Your Aadhaar
          </Text>
          <View style={styles.imageContainer}>
            {aadhaarFrontImg ? (
              fileTypeFront === 'pdf' ? (
                <View style={styles.pdfContainer}>
                  <Image
                    source={require('../../../assets/images/file.png')}
                    style={styles.pdfImage}
                    blurRadius={4}
                  />
                  <Text>{fileNameFront}</Text>
                  <TouchableOpacity
                    style={styles.viewPdfBtn}
                    onPress={() => viewDocument({uri: aadhaarFrontImg})}>
                    <Text style={styles.viewPdfText}>View PDF</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Image source={{uri: aadhaarFrontImg}} style={styles.image} />
              )
            ) : (
              <Image
                source={require('../../../assets/images/aadhaar-card.webp')}
                style={styles.placeholderImage}
                blurRadius={4}
              />
            )}
          </View>
          {aadhaarFrontImg ? (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={removeFrontImage}>
              <AntDesign name="closecircle" color="red" size={20} />
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => {
              setOptionModalVisible(true);
              setImageType('front');
            }}>
            <Text style={styles.uploadBtnText}>Upload Front Image</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadContainer}>
          <Text style={styles.uploadText}>
            Upload Back Side of Your Aadhaar
          </Text>
          <View style={styles.imageContainer}>
            {aadhaarBackImg ? (
              fileTypeBack === 'pdf' ? (
                <View style={styles.pdfContainer}>
                  <Image
                    source={require('../../../assets/images/file.png')}
                    style={styles.pdfImage}
                    blurRadius={4}
                  />
                  <Text>{fileNameBack}</Text>
                  <TouchableOpacity
                    style={styles.viewPdfBtn}
                    onPress={() => viewDocument({uri: aadhaarBackImg})}>
                    <Text style={styles.viewPdfText}>View PDF</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Image source={{uri: aadhaarBackImg}} style={styles.image} />
              )
            ) : (
              <Image
                source={require('../../../assets/images/aadhaar-card.webp')}
                style={styles.placeholderImage}
                blurRadius={4}
              />
            )}
          </View>
          {aadhaarBackImg ? (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={removeBackImage}>
              <AntDesign name="closecircle" color="red" size={20} />
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => {
              setOptionModalVisible(true);
              setImageType('back');
            }}>
            <Text style={styles.uploadBtnText}>Upload Back Image</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fixedBottom}>
        <TouchableOpacity
          style={[
            styles.continueBtn,
            ((!aadhaarFrontImg && !aadhaarBackImg) || isLoading) &&
              styles.disabledBtn,
          ]}
          onPress={handleContinue}
          disabled={(!aadhaarFrontImg && !aadhaarBackImg) || isLoading}>
          <Text style={styles.continueBtnText}>
            {isLoading ? 'Please wait...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
      <ImageOptionModalComponent
        title="Upload Aadhaar Card"
        visible={optionModalVisible}
        onClose={() => setOptionModalVisible(false)}
        onCameraPress={() => handleCameraImagePicker(imageType)}
        onGalleryPress={() => handleDocumentPicker(imageType)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  pdfImage: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
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

export default AadhaarUpload;
