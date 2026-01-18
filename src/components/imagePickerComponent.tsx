import ImageCropPicker from 'react-native-image-crop-picker';

export const openCamera = (cropping, onSuccess = () => { }, mediaType) => {
    ImageCropPicker.openCamera({
        cropping,
        // width: 500,
        // height: 500,
        includeExif: true,
        mediaType,
    })
        .then((image) => {
            onSuccess(image);
        })
        .catch((e) => console.log(e));
};

export const openGallery = (onSuccess = () => { }, multiple = true, mediaType) => {
    ImageCropPicker.openPicker({
        waitAnimationEnd: false,
        sortOrder: 'desc',
        includeExif: true,
        forceJpg: true,
        multiple,
        mediaType,
    })
        .then((images) => {
            // images.forEach((gallryImage) => {
            //     console.log('received image', gallryImage);
            // });
            if (multiple) {
                onSuccess(images);
            } else {
                onSuccess(images);
            }
        })
        .catch((e) => console.log(e));
};
