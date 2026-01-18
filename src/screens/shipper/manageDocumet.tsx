import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageOptionModalComponent from '../../components/imageOptionModalComponent';
import {CameraImagePicker, DocumentPicker} from '../../utils';
import {sharePdf} from '../../utils';
import {viewDocument} from '@react-native-documents/viewer';
import {showMessage} from 'react-native-flash-message';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import {apiPost} from '../../services/apiUtility';
import RNFS from 'react-native-fs';

const ManageDocuments = ({navigation, route}) => {
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [imageType, setImageType] = useState('');
  const [lrBillity, setLrBillity] = useState('');
  const [proofOfDelivery, setProofOfDelivery] = useState('');
  const [driverDocument, setDriverDocument] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState('');
  const [uploadedFileTypes, setUploadedFileTypes] = useState({
    lr_bilty: null,
    pod: null,
    driver_doc: null,
    e_way: null,
  });

  const addBidImage = async photoUri => {
    setLoading(true);

    var photo = {
      uri: photoUri,
      type: fileType === 'image' ? 'image/jpeg' : 'application/pdf', // Set the correct MIME type
      name: fileType === 'image' ? 'photo.jpg' : 'document.pdf', // Give an appropriate name
    };
    let formData = new FormData();
    formData.append('bid_id', route.params.bidData.id);
    if (imageType === 'LR/BILITY') {
      formData.append('lr_bilty', photo);
    } else if (imageType === 'POD') {
      formData.append('pod', photo);
    } else if (imageType === 'DriverDocumets') {
      formData.append('driver_doc', photo);
    } else if (imageType === 'EWAY') {
      formData.append('e_way', photo);
    }

    try {
      const response = await apiPost(API_ENDPOINTS.BID.ADD_BID_IMAGE, formData);

      if (response.success) {
        navigation.navigate('Find Load', {tabName: 'MyBid'});
        setLoading(false);
        showMessage({
          message: response.message,
          description: '',
          type: 'success',
        });
      } else {
        setLoading(false);
        showMessage({
          message: response.message,
          description: '',
          type: 'danger',
        });
      }
    } catch (error) {
      setLoading(false);
      console.error(error.message);
      showMessage({
        message: 'Please try again.',
        description: '',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
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
        if (imageType === 'LR/BILITY') {
          setFileType('image');
          setLrBillity(asset.uri);
          addBidImage(asset.uri);
        } else if (imageType === 'POD') {
          setFileType('image');
          setProofOfDelivery(asset.uri);
          addBidImage(asset.uri);
        } else if (imageType === 'DriverDocumets') {
          setFileType('image');
          setDriverDocument(asset.uri);
          addBidImage(asset.uri);
        } else if (imageType === 'EWAY') {
          setFileType('image');
          setDriverDocument(asset.uri);
          addBidImage(asset.uri);
        }
        setOptionModalVisible(false);
      },
    );
  };

  const handleDocumentPicker = () => {
    setOptionModalVisible(false);
    DocumentPicker(
      // Handle PDF file
      pdfUri => {
        setFileType('pdf');
        if (imageType === 'LR/BILITY') {
          setLrBillity(pdfUri.uri);
          addBidImage(pdfUri.uri);
        } else if (imageType === 'POD') {
          setProofOfDelivery(pdfUri.uri);
          addBidImage(pdfUri.uri);
        } else if (imageType === 'DriverDocumets') {
          setDriverDocument(pdfUri.uri);
          addBidImage(pdfUri.uri);
        }
      },
      // Handle image file
      imageUri => {
        setFileType('image');
        if (imageType === 'LR/BILITY') {
          setLrBillity(imageUri.uri);
          addBidImage(imageUri.uri);
        } else if (imageType === 'POD') {
          setProofOfDelivery(imageUri.uri);
          addBidImage(imageUri.uri);
        } else if (imageType === 'DriverDocumets') {
          setDriverDocument(imageUri.uri);
          addBidImage(imageUri.uri);
        } else if (imageType === 'EWAY') {
          setDriverDocument(imageUri.uri);
          addBidImage(imageUri.uri);
        }
      },
    );
  };

  const handleShare = async (url, pdfFileName) => {
    const pdfUrl = url;
    const fileName = `${pdfFileName}_${route.params?.bidData?.get_vehicle_detail?.vehicle_no}`;

    try {
      await sharePdf(pdfUrl, fileName);
    } catch (error) {
      console.error('Error handling PDF sharing:', error);
    }
  };

  const getFileType = url => {
    if (!url) return null;

    try {
      // Extract file extension
      const extension = url
        .split('?')[0]
        .split('/')
        .pop()
        .split('.')
        .pop()
        .toLowerCase();

      if (['jpg', 'jpeg', 'png'].includes(extension)) {
        return 'image';
      } else if (extension === 'pdf') {
        return 'pdf';
      }
      return 'unknown';
    } catch (error) {
      console.error('Error extracting file type:', error);
      return 'unknown';
    }
  };

  const handleView = async fileUrl => {
    const fileType = getFileType(fileUrl);

    if (fileType === 'pdf') {
      try {
        // Define the local file path
        const localFilePath = `${RNFS.DocumentDirectoryPath}/temp.pdf`;

        // Download the file

        const downloadResult = await RNFS.downloadFile({
          fromUrl: fileUrl,
          toFile: localFilePath,
        }).promise;

        if (downloadResult.statusCode === 200) {
          // Open the downloaded PDF
          await viewDocument({uri: `file://${localFilePath}`});

          // After viewing, delete the file
          // await RNFS.unlink(localFilePath);
          // console.log('PDF Deleted from local storage.');
        } else {
          console.error('Failed to download PDF');
          showMessage({
            message: 'Failed to download the PDF.',
            type: 'danger',
          });
        }
      } catch (error) {
        console.error('Error handling PDF:', error);
        showMessage({
          message:
            'Error opening the PDF. Make sure a PDF viewer is installed.',
          type: 'danger',
        });
      }
    } else if (fileType === 'image') {
      navigation.navigate('ShowImage', {url: fileUrl});
    } else {
      showMessage({
        message: 'Unsupported file format',
        type: 'warning',
      });
    }
  };

  useEffect(() => {
    if (route.params.bidData) {
      setUploadedFileTypes({
        lr_bilty: getFileType(route.params.bidData?.lr_bilty),
        pod: getFileType(route.params.bidData?.pod),
        driver_doc: getFileType(route.params.bidData?.driver_doc),
        e_way: getFileType(route.params.bidData?.e_way),
      });
    }
  }, [route.params.bidData]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.uploadRow}>
          <Icon name="file-document" size={20} color="#000" />
          <Text style={styles.uploadTitle}>LR/Bilty</Text>
          {route.params.bidData?.lr_bilty === null &&
            route.params?.role === 2 && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => {
                  setOptionModalVisible(true);
                  setImageType('LR/BILITY');
                }}>
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            )}
        </View>
        {route.params.bidData?.lr_bilty !== null && (
          <>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleView(route.params.bidData?.lr_bilty)}>
                <Icon
                  name={
                    uploadedFileTypes.lr_bilty === 'image' ? 'eye' : 'download'
                  }
                  size={20}
                  color="#000"
                />
                <Text style={{color: '#000', marginLeft: 5}}>
                  {uploadedFileTypes.lr_bilty === 'image' ? 'View' : 'Download'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  handleShare(route.params.bidData?.lr_bilty, 'Lr_Bility')
                }>
                <Icon name="share" size={20} color="#000" />
                <Text style={{color: '#000'}}>Share</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {route.params.bidData?.lr_bilty === null &&
          route.params?.role === 3 && (
            <View style={styles.buttonRow}>
              <Text style={styles.uploadTitle}>Wait for Upload Document</Text>
            </View>
          )}
      </View>

      <View style={styles.uploadCard}>
        <View style={styles.uploadRow}>
          <Icon name="file-document" size={20} color="#000" />
          <Text style={styles.uploadTitle}>Driver Document</Text>
          {route.params.bidData?.driver_doc === null &&
            route.params?.role === 2 && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => {
                  setOptionModalVisible(true);
                  setImageType('DriverDocumets');
                }}>
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            )}
        </View>
        {route.params.bidData?.driver_doc !== null && (
          <>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleView(route.params.bidData?.driver_doc)}>
                <Icon
                  name={
                    uploadedFileTypes.driver_doc === 'image'
                      ? 'eye'
                      : 'download'
                  }
                  size={20}
                  color="#000"
                />
                <Text style={{color: '#000', marginLeft: 5}}>
                  {uploadedFileTypes.driver_doc === 'image'
                    ? 'View'
                    : 'Download'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  handleShare(
                    route.params.bidData.driver_doc,
                    'Driver Document',
                  )
                }>
                <Icon name="share" size={20} color="#000" />
                <Text style={{color: '#000'}}>Share</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {route.params.bidData?.driver_doc === null &&
          route.params?.role === 3 && (
            <View style={styles.buttonRow}>
              <Text style={styles.uploadTitle}>Wait for Upload Document</Text>
            </View>
          )}
      </View>

      <View style={styles.uploadCard}>
        <View style={styles.uploadRow}>
          <Icon name="file-document" size={20} color="#000" />
          <Text style={styles.uploadTitle}>Proof of Delivery</Text>
          {route.params.bidData?.pod === null && route.params?.role === 2 && (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => {
                setOptionModalVisible(true);
                setImageType('POD');
              }}>
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          )}
        </View>
        {route.params.bidData?.pod !== null && (
          <>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleView(route.params.bidData?.pod)}>
                <Icon
                  name={uploadedFileTypes.pod === 'image' ? 'eye' : 'download'}
                  size={20}
                  color="#000"
                />
                <Text style={{color: '#000', marginLeft: 5}}>
                  {uploadedFileTypes.pod === 'image' ? 'View' : 'Download'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  handleShare(route.params.bidData?.pod, 'Proof Of Delivery')
                }>
                <Icon name="share" size={20} color="#000" />
                <Text style={{color: '#000'}}>Share</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {route.params.bidData?.pod === null && route.params?.role === 3 && (
          <View style={styles.buttonRow}>
            <Text style={styles.uploadTitle}>Wait for Upload Document</Text>
          </View>
        )}
      </View>
      <View style={styles.uploadCard}>
        <View style={styles.uploadRow}>
          <Icon name="file-document" size={20} color="#000" />
          <Text style={styles.uploadTitle}>E-WAY</Text>
          {route.params.bidData?.e_way === null && route.params?.role === 2 && (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => {
                setOptionModalVisible(true);
                setImageType('EWAY');
              }}>
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          )}
        </View>
        {route.params.bidData?.e_way !== null && (
          <>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleView(route.params.bidData?.e_way)}>
                <Icon
                  name={
                    uploadedFileTypes.e_way === 'image' ? 'eye' : 'download'
                  }
                  size={20}
                  color="#000"
                />
                <Text style={{color: '#000', marginLeft: 5}}>
                  {uploadedFileTypes.e_way === 'image' ? 'View' : 'Download'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  handleShare(route.params.bidData?.e_way, 'E-WAY')
                }>
                <Icon name="share" size={20} color="#000" />
                <Text style={{color: '#000'}}>Share</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {route.params.bidData?.e_way === null && route.params?.role === 3 && (
          <View style={styles.buttonRow}>
            <Text style={styles.uploadTitle}>Wait for Upload Document</Text>
          </View>
        )}
      </View>
      <ImageOptionModalComponent
        title="Upload Document"
        visible={optionModalVisible}
        onClose={() => setOptionModalVisible(false)}
        onCameraPress={() => handleCameraImagePicker()}
        onGalleryPress={() => handleDocumentPicker()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
  },
  warningText: {
    marginLeft: 5,
    color: '#856404',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  uploadCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadTitle: {
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
    color: '#000',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
  },
  uploadText: {
    color: '#FFF',
  },
});

export default ManageDocuments;
