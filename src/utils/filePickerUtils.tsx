import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { pick } from '@react-native-documents/picker';

// Function to request storage permission (if required)
const requestStoragePermission = async () => {
    // Implement permission logic if needed
};

export const DocumentPicker = async (onPdfFile, onImageFile) => {
    try {
        await requestStoragePermission();
        const results = await pick({
            mode: 'import',
            allowMultiSelection: false,
            type: ['application/pdf', 'image/*'],
        });

        if (results.length > 0) {
            const file = results[0];
            if (file.type === 'application/pdf') {
                onPdfFile(file);
            } else if (file.type?.startsWith('image/')) {
                onImageFile(file);
            }
        }
    } catch (err) {
        console.log('User cancelled the upload', err);
    }
};

export const CameraImagePicker = (onCancel, onError, onSuccess) => {
    const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
    };

    launchCamera(options, response => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
            onCancel();
        } else if (response.error) {
            console.log('Camera Error: ', response.error);
            onError(response.error);
        } else {
            onSuccess(response.assets[0]);
        }
    });
};

export const GalleryImagePicker = (onCancel, onError, onSuccess) => {
    const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
            onCancel();
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            onError(response.error);
        } else {
            onSuccess(response.assets[0]);
        }
    });
};
