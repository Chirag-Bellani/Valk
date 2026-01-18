import { Image, Video, getFileSize } from 'react-native-compressor'; // Adjust based on your library

/**
 * Compress a video file.
 * @param {string} videoUri - The URI of the video to compress.
 * @param {object} options - Compression options.
 * @param {number} options.targetSizeMB - Target size in MB.
 * @param {number} options.bitrate - Target bitrate in bps.
 * @param {number} options.maxWidth - Maximum width of the video.
 * @param {number} options.maxHeight - Maximum height of the video.
 * @param {string} options.compressionMethod - Compression method ('manual' or others).
 * @returns {Promise<string>} - URI of the compressed video.
 */
export const compressVideo = async (videoUri, options = {}) => {
    const {
        targetSizeMB = 2, // Default target size: 2 MB
        bitrate = 800000, // Default bitrate: 800 kbps
        maxWidth = 1280, // Default width: 1280px
        maxHeight = 720, // Default height: 720px
        compressionMethod = 'manual', // Default compression method
    } = options;

    try {
        console.log('Compressing video...');

        const targetSizeBytes = targetSizeMB * 1024 * 1024;

        const compressedUri = await Video.compress(
            videoUri,
            {
                compressionMethod,
                bitrate,
                maxWidth,
                maxHeight,
            },
            (progress) => {
                console.log(`Compression Progress: ${Math.round(progress * 100)}%`);
            }
        );

        // Verify the file size after compression
        const compressedFileSize = await getFileSize(compressedUri);
        console.log('Compressed file size (bytes):', compressedFileSize);

        if (compressedFileSize > targetSizeBytes) {
            console.warn('Compressed file is larger than target size. Further adjustments might be needed.');
        }

        console.log('Compressed video URI:', compressedUri);
        return compressedUri;
    } catch (error) {
        console.error('Video compression failed:', error);
        return videoUri; // Fallback to original if compression fails
    }
};

/**
 * Compress an image file to meet a target size.
 * @param {string} imageUri - The URI of the image to compress.
 * @param {object} options - Compression options.
 * @param {number} options.targetSizeKB - Target size in KB.
 * @param {number} options.maxWidth - Maximum width of the image.
 * @param {number} options.maxHeight - Maximum height of the image.
 * @param {number} options.qualityStep - Step to reduce quality (e.g., 0.1 = 10%).
 * @returns {Promise<string>} - URI of the compressed image.
 */
export const compressImage = async (
    imageUri,
    {
        targetSizeKB = 300, // Default target size: 300 KB
        // maxWidth = 1920, // Set max dimensions to avoid over-compression
        // maxHeight = 1080,
        qualityStep = 0.02, // Smaller quality steps for finer control
        // lossless = true,
    } = {}
) => {
    try {
        console.log('Compressing image...');
        let compressedUri = imageUri; // Start with the original image
        let quality = 1; // Start with the highest quality
        const targetSizeBytes = targetSizeKB * 1024; // Convert KB to bytes
        let currentSize = await getFileSize(imageUri); // Get the current file size

        // Loop to reduce quality until the target size is reached
        while (currentSize > targetSizeBytes && quality > 0) {
            compressedUri = await Image.compress(imageUri, {
                quality,
                // maxWidth,
                // maxHeight,
                compressionMethod: 'auto',
                // lossless,
            });
            currentSize = await getFileSize(compressedUri); // Update current size
            quality -= qualityStep; // Decrease quality
            console.log(`Current size: ${Math.round(currentSize / 1920)} KB, Quality: ${quality.toFixed(1)}`);
        }

        console.log('Compression complete:', compressedUri);
        return compressedUri;
    } catch (error) {
        console.error('Image compression failed:', error);
        return imageUri; // Fallback to the original image if compression fails
    }
};
