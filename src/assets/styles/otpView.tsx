import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth } = Dimensions.get('window'); // Full screen width


export default style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    height: screenWidth * 0.7, // Dynamic height based on the screen width (40% of screen width)
    width: screenWidth,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    padding: 10,
    width: 50,
    marginHorizontal: 5,
    color: '#fff',
    backgroundColor: '#2A2A3C',
  },
  verifyButton: {
    marginBottom: 20,
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#6b8cc9',
  },
  resendText: {
    color: '#00E6C3',
    fontWeight: 'bold',
  },
  timerText: {
    color: '#aaa',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
