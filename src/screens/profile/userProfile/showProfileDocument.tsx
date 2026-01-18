import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {viewDocument} from '@react-native-documents/viewer';
import {showMessage} from 'react-native-flash-message';
import RNFS from 'react-native-fs';

const ShowProfileDocument = ({navigation, route}) => {
  const [driverDocument, setDriverDocument] = useState('');
  const [uploadedFileTypes, setUploadedFileTypes] = useState({
    adharimgFront: null,
    adharimgBack: null,
    pan: null,
    GstNo: null,
  });

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
          setTimeout(async () => {
            try {
              await RNFS.unlink(localFilePath);
            } catch (e) {
              console.error('Error deleting PDF:', e);
            }
          }, 5000); // Wait 5 seconds (adjust as needed)
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
    if (route.params?.userDetails?.get_user_party_detail) {
      setUploadedFileTypes({
        adharimgFront: getFileType(
          route.params?.userDetails?.get_user_party_detail
            ?.party_aadhaar_front_image_url,
        ),
        adharimgBack: getFileType(
          route.params?.userDetails?.get_user_party_detail
            ?.party_aadhaar_back_image_url,
        ),
        pan: getFileType(
          route.params?.userDetails?.get_user_party_detail?.party_pan_image_url,
        ),
        GstNo: route.params?.userDetails?.get_user_party_detail?.gst_no,
      });
    }
  }, [route.params.userDetails.get_user_party_detail]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.uploadRow}>
          <Icon name="file-document" size={20} color="#000" />
          <Text style={styles.uploadTitle}>Adhar Image</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              handleView(
                route.params.userDetails.get_user_party_detail
                  .party_aadhaar_front_image_url,
              )
            }>
            <Icon name="eye" size={20} color="#000" />
            <Text style={{color: '#000', marginLeft: 5}}>View Front</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              handleView(
                route.params.userDetails.get_user_party_detail
                  .party_aadhaar_back_image_url,
              )
            }>
            <Icon name="eye" size={20} color="#000" />
            <Text style={{color: '#000', marginLeft: 5}}>View Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.uploadCard}>
        <View style={styles.uploadRow}>
          <Icon name="file-document" size={20} color="#000" />
          <Text style={styles.uploadTitle}>Pan Image</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              handleView(
                route.params?.userDetails?.get_user_party_detail
                  ?.party_pan_image_url,
              )
            }>
            <Icon name="eye" size={20} color="#000" />
            <Text style={{color: '#000', marginLeft: 5}}>View</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.uploadCard}>
        <View style={styles.uploadRow}>
          <Icon name="file-document" size={20} color="#000" />
          <Text style={styles.uploadTitle}>Gst No</Text>
        </View>
        <View style={styles.buttonRow}>
          {uploadedFileTypes.GstNo !== null ? (
            <Text style={styles.uploadTitle}>{uploadedFileTypes.GstNo}</Text>
          ) : (
            <Text style={styles.uploadTitle}>GSt No Not Available</Text>
          )}
        </View>
      </View>
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
  },
  uploadTitle: {
    fontSize: 16,
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

export default ShowProfileDocument;
