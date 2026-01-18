import { Dimensions, StyleSheet } from 'react-native'

const { width: screenWidth } = Dimensions.get('window'); // Full screen width

export default style = StyleSheet.create({
    outerContainer: {
        flex: 1,
        paddingTop: '10%', // Adjust as needed
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, // Reduce as needed
    },
    innerContainer: {
        width: '90%',
        borderRadius: 20,
        padding: 20,
        marginTop: 10, // Adjusted to reduce space between the logo and text
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20,
        columnGap: 10
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#fff',
        borderBottomWidth: 1,
        color: '#fff',
    },
    logoBackground: {
        padding: 40,
        borderRadius: 300, // Circular shape
    },
    logo: {
        height: 100,
        width: 100,
    },
});

