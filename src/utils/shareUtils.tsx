// shareUtils.js

import { Share } from 'react-native';

export const shareLoadDetails = async (message, messageTitle) => {
    try {
        const shareOptions = {
            message: message,
            title: messageTitle,
        };

        const result = await Share.open(shareOptions);

        if (result.action === Share.sharedAction) {
            // handle the shared action if needed
        } else if (result.action === Share.dismissedAction) {
            // handle the dismissed action if needed
        }
    } catch (error) {
        console.error('Error sharing load details:', error);
    }
};
