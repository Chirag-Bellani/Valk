export const replaceUnderscoreWithSpace = (input) => {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }
    return input.replace(/_/g, ' ');
};



export const helperMaskedVehicleNo = (string = '') => {
    const length = string.length;
    if (length > 0) {
        let lastSix = length <= 6 ? string : string.slice(-6);
        lastSix = lastSix
            .split('')
            .map((char, index) => {
                // Replace 2nd, 4th, and 5th characters with '*'
                // Show 3rd and 6th characters
                if (index === 1 || index === 3 || index === 4) {
                    return '*';
                }
                return char;
            })
            .join('');
        return string.slice(0, length - 6) + lastSix;
    }
    return '';
};
