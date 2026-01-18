import { StyleSheet } from 'react-native';

const ModalStyles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        // borderTopLeftRadius: 10,
        // alignItems: 'center',
    },
    modalHeader: {
        flexDirection: 'row', // Align items horizontally
        justifyContent: 'space-between', // Space out title and close button
        alignItems: 'center', // Center items vertically
        paddingBottom: 10, // Add vertical padding
    },
    modalCloseIcon: {
        padding: 5, // Add some padding around the icon
    },
    modalTitle: {
        fontSize: 18, // Title font size
        fontWeight: 'bold', // Make the title bold
        color: '#333', // Title color
    },
    timestamp: {
        position: 'absolute',
        left: '2%',
        bottom: '1%', // Adjust this value as needed
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'red',
        // padding: 5,
        fontSize: 12,
        // borderRadius: 5,
    },
    imageWithTimestamp: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        // marginBottom: 10,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    justifySpaceBetween: {
        justifyContent: 'space-between',
    },
    buttonBlue: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        elevation: 3,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: '#007BFF',
    },
    width45: {
        width: '45%',
    },
    buttonTextWhite: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default ModalStyles;
