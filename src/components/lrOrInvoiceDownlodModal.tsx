import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import { showMessage, hideMessage } from 'react-native-flash-message';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import { apiPost } from '../services/apiUtility';
import { API_ENDPOINTS } from '../constants/apiEndPoints';

const LrOrInvoiceDownloadModal = ({
    isDownlodModalVisible,
    toggleModal,
    status,
    onpress,
    loadData
}) => {
    const getPdfFileUrl = async (type) => {

        let formData = new FormData();
        formData.append('pdf_type', type);
        formData.append('post_load_id', loadData.id);
        console.log('formData', formData)
        try {
            const response = await apiPost(API_ENDPOINTS.DOWNLOAD.DOWNLOAD_LR_OR_INVOICE, formData)

            if (response.success) {
                toggleModal()
                downloadPdf(response.data.url, type)
            }
        }
        catch (error) {
            console.log(error.message);
        }
    };

    const downloadPdf = (url, type) => {
        const fileName = `${type}.pdf`;
        const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

        // Check if the file already exists
        RNFS.exists(filePath)
            .then((exists) => {
                if (exists) {
                    // Delete the existing file
                    RNFS.unlink(filePath)
                        .then(() => {
                            console.log('Existing file deleted. Proceeding to download new file.');
                            // Proceed with downloading the new file
                            ReactNativeBlobUtil.config({
                                fileCache: true,
                                addAndroidDownloads: {
                                    useDownloadManager: true, // Use native download manager
                                    notification: true, // Show notification when download is complete
                                    path: filePath, // Path where the file should be saved
                                    mime: 'application/pdf',
                                    description: 'Downloading PDF...',
                                    mediaScannable: true,
                                    title: fileName,
                                },
                            })
                                .fetch('GET', url)
                                .then((res) => {
                                    showMessage({
                                        message: 'File Downloaded Successfully',
                                        description: '',
                                        type: 'success',
                                    });

                                    // Optionally, open the PDF after download
                                    // ReactNativeBlobUtil.android.actionViewIntent(filePath, 'application/pdf');
                                })
                                .catch((err) => {
                                    showMessage({
                                        message: 'Error downloading PDF',
                                        description: err.message,
                                        type: 'danger',
                                    });
                                });
                        })
                        .catch((err) => {
                            console.error('Error deleting existing file:', err);
                            showMessage({
                                message: 'Error deleting existing file',
                                description: err.message,
                                type: 'danger',
                            });
                        });
                } else {
                    // If the file doesn't exist, directly download 
                    ReactNativeBlobUtil.config({
                        fileCache: true,
                        addAndroidDownloads: {
                            useDownloadManager: true, // Use native download manager
                            notification: true, // Show notification when download is complete
                            path: filePath, // Path where the file should be saved
                            mime: 'application/pdf',
                            description: 'Downloading PDF...',
                            mediaScannable: true,
                            title: fileName,
                        },
                    })
                        .fetch('GET', url)
                        .then((res) => {
                            showMessage({
                                message: 'File Downloaded Successfully',
                                description: '',
                                type: 'success',
                            });

                            // Optionally, open the PDF after download
                            // ReactNativeBlobUtil.android.actionViewIntent(filePath, 'application/pdf');
                        })
                        .catch((err) => {
                            showMessage({
                                message: 'Error downloading PDF',
                                description: err.message,
                                type: 'danger',
                            });
                        });
                }
            })
            .catch((err) => {
                console.error('Error checking file existence:', err);
                showMessage({
                    message: 'Error checking file existence',
                    description: err.message,
                    type: 'danger',
                });
            });
    };
    return (
        <Modal
            isVisible={isDownlodModalVisible}
            onRequestClose={toggleModal}
            animationType="slide"
            transparent={true}
            style={styles.modal}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Lr Or Invoice Downlod</Text>
                    <Pressable onPress={onpress}>
                        <Feather name="x-circle" size={20} color='#000000' />
                    </Pressable>
                </View>
                <View style={styles.modalHeader}>
                    {/* <TouchableOpacity
                        style={{
                            marginHorizontal: 5,
                            padding: 12,
                            backgroundColor: '#0032e8', // Change background when disabled
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            borderRadius: 10,
                            zIndex: -1,
                        }}
                        onPress={() => getPdfFileUrl('trip_lr')}>
                        <Text style={styles.label}>Downnload LR</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={{
                            marginHorizontal: 5,
                            padding: 12,
                            backgroundColor: '#0032e8', // Change background when disabled
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            borderRadius: 10,
                            zIndex: -1,
                        }}
                        onPress={() => getPdfFileUrl('trip_invoice')}>
                        <Text style={styles.label}>Downnload Invoice</Text>
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
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'flex-start',
        // marginBottom: 20,
        borderBottomColor: 'grey',
        // borderBottomWidth: 1,
    },
    inputRow: {
        marginTop: 10,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#FFFFFF',
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
        backgroundColor: '#6b8cc9',
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

export default LrOrInvoiceDownloadModal;
