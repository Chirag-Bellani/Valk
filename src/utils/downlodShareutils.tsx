import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { showMessage } from 'react-native-flash-message';

/**
 * Downloads a PDF file to the device's download directory.
 * @param {string} url - The URL of the PDF file to download.
 * @param {Array} vehicleNoData - Array of vehicle data.
 * @param {number|string} vehicleId - The ID of the vehicle for file naming.
 */
export const downloadPdf = (url, vehicleNoData, vehicleId) => {
    const vehicleNo = vehicleNoData.find((item) => item.id === vehicleId)?.vehicle_no || 'UnknownVehicle';
    const fileName = `DieselVoucher_${vehicleNo}.pdf`;
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    // Check if the file already exists
    RNFS.exists(filePath)
        .then((exists) => {
            if (exists) {
                // Delete the existing file
                RNFS.unlink(filePath)
                    .then(() => {
                        console.log('Existing file deleted. Proceeding to download new file.');
                        downloadFile(url, filePath, fileName);
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
                downloadFile(url, filePath, fileName);
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

// Helper function to handle file download
const downloadFile = (url, filePath, fileName) => {
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
            console.log(`File saved to ${res.path()}`);
            showMessage({
                message: 'File Downloaded Successfully',
                description: '',
                type: 'success',
            });

            // Optionally, open the PDF after download
            // ReactNativeBlobUtil.android.actionViewIntent(filePath, 'application/pdf');
        })
        .catch((err) => {
            console.error('Error downloading PDF:', err);
            showMessage({
                message: 'Error downloading PDF',
                description: err.message,
                type: 'danger',
            });
        });
};

export async function sharePdf(url, fileName) {
    console.log('url', fileName)
    const getFileExtension = (fileUrl) => {
        return fileUrl.split('.').pop();
    };

    const fileExtension = getFileExtension(url);
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}.${fileExtension}`;

    try {
        // Download the PDF to the device's local storage
        const downloadResult = await RNFS.downloadFile({
            fromUrl: url,
            toFile: filePath,
        }).promise;

        if (downloadResult.statusCode === 200) {
            // Share the downloaded PDF file
            const options = {
                title: 'Share PDF',
                url: `file://${filePath}`,
                subject: fileName,
            };

            const result = await Share.open(options);
            console.log('Share result:', result);

            // Remove the file after sharing
            await RNFS.unlink(filePath);
            console.log('File deleted successfully');
        } else {
            throw new Error('Failed to download file');
        }
    } catch (error) {
        console.error('Error sharing PDF:', error);
        showMessage({
            message: 'Error sharing PDF',
            description: error.message,
            type: 'danger',
        });

        // Attempt to remove the file in case of error
        try {
            if (await RNFS.exists(filePath)) {
                await RNFS.unlink(filePath);
                console.log('Temporary file deleted after error');
            }
        } catch (unlinkError) {
            console.error('Error deleting temporary file:', unlinkError);
        }
    }
}
